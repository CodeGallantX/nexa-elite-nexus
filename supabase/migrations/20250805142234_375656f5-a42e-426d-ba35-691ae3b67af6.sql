-- Fix RLS policies for attendance to ensure admins and clan masters can insert attendance
DROP POLICY IF EXISTS "Admins can manage attendance" ON public.attendance;
DROP POLICY IF EXISTS "Users can view attendance" ON public.attendance;

-- Create new attendance policies
CREATE POLICY "Admins and clan masters can manage attendance" 
ON public.attendance 
FOR ALL 
USING (get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role]));

CREATE POLICY "Users can view attendance" 
ON public.attendance 
FOR SELECT 
USING (true);

-- Fix profiles policies to allow proper admin deletion
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Create comprehensive admin policy for profiles
CREATE POLICY "Admins and clan masters can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'clan_master'::user_role]));

-- Function to delete user completely (from both auth.users and profiles)
CREATE OR REPLACE FUNCTION public.delete_user_completely(user_id_to_delete uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_role user_role;
BEGIN
  -- Get current user's role
  SELECT role INTO current_user_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  -- Only allow admins and clan masters to delete users
  IF current_user_role NOT IN ('admin', 'clan_master') THEN
    RAISE EXCEPTION 'Only admins and clan masters can delete users';
  END IF;
  
  -- Delete from profiles first (due to potential FK constraints)
  DELETE FROM public.profiles WHERE id = user_id_to_delete;
  
  -- Delete from auth.users using admin API
  -- Note: This requires elevated privileges in production
  DELETE FROM auth.users WHERE id = user_id_to_delete;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the transaction
    RAISE NOTICE 'Error deleting user: %', SQLERRM;
    RETURN false;
END;
$$;
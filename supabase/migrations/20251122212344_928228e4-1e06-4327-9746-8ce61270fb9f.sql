-- Simplify delete_user_completely to only delete from profiles
CREATE OR REPLACE FUNCTION public.delete_user_completely(user_id_to_delete uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
  
  -- Only delete from profiles table
  -- Other related records will be handled by ON DELETE CASCADE or left as orphaned records
  DELETE FROM public.profiles WHERE id = user_id_to_delete;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error deleting user: %', SQLERRM;
END;
$$;
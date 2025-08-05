-- Fix RLS policies for attendance table
DROP POLICY IF EXISTS "Admins can manage attendance" ON public.attendance;
DROP POLICY IF EXISTS "Anyone can view attendance" ON public.attendance;

-- Create proper RLS policies for attendance
CREATE POLICY "Admins can manage attendance" 
ON public.attendance 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Users can view attendance" 
ON public.attendance 
FOR SELECT 
USING (true);

-- Fix RLS policies for profiles table to allow admin updates
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Fix event deletion by ensuring admins can delete events
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;

CREATE POLICY "Admins can manage events" 
ON public.events 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Fix player deletion by allowing admins to delete profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Update functions with proper search paths (recreate without dropping)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.increment_total_kills(uid uuid, new_kills integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE profiles
  SET kills = COALESCE(kills, 0) + new_kills
  WHERE id = uid;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_attendance_percentage()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET attendance = (
    SELECT COALESCE(
      ROUND(
        (COUNT(*) FILTER (WHERE status = 'present')::DECIMAL / 
         NULLIF(COUNT(*), 0)) * 100, 2
      ), 0.00
    )
    FROM public.attendance
    WHERE player_id = COALESCE(NEW.player_id, OLD.player_id)
  )
  WHERE id = COALESCE(NEW.player_id, OLD.player_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;
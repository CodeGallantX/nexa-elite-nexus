-- Fix RLS policies for events table to allow admin operations
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;

CREATE POLICY "Admins can manage events" 
ON public.events 
FOR ALL 
USING (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'clan_master'::user_role]));

-- Also ensure proper insert policy
DROP POLICY IF EXISTS "Admins can create events" ON public.events;

CREATE POLICY "Admins can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'clan_master'::user_role]));
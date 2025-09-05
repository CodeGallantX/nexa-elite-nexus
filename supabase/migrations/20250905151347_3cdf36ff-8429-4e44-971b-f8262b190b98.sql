-- Update attendance RLS policies to include moderator role
DROP POLICY IF EXISTS "Admins and clan masters can manage attendance" ON public.attendance;

CREATE POLICY "Admins, clan masters and moderators can manage attendance" 
ON public.attendance 
FOR ALL 
USING (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'clan_master'::user_role, 'moderator'::user_role]));

-- Ensure moderators can also view attendance (update existing policy)
DROP POLICY IF EXISTS "Users can view attendance" ON public.attendance;

CREATE POLICY "Users can view attendance" 
ON public.attendance 
FOR SELECT 
USING (true);
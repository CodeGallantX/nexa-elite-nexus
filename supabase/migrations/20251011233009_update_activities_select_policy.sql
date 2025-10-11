-- Drop the old policy
DROP POLICY IF EXISTS "Clan masters can view all activities" ON public.activities;

-- Create a new policy that allows all authenticated users to view activities
CREATE POLICY "Allow authenticated users to view activities" ON public.activities
FOR SELECT USING (auth.role() = 'authenticated');

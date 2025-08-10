/*
  # Fix event_groups RLS policies

  1. Security Updates
    - Drop existing problematic policies for event_groups table
    - Create new comprehensive policies for event_groups table
    - Allow admins and clan_masters to insert, update, delete event_groups
    - Allow all authenticated users to view event_groups

  2. Policy Details
    - INSERT: Only admins and clan_masters can create event groups
    - SELECT: All authenticated users can view event groups
    - UPDATE: Only admins and clan_masters can update event groups
    - DELETE: Only admins and clan_masters can delete event groups
*/

-- Drop existing policies for event_groups table
DROP POLICY IF EXISTS "Admins and clan masters can manage event groups" ON event_groups;
DROP POLICY IF EXISTS "Anyone can view event groups" ON event_groups;
DROP POLICY IF EXISTS "Clan masters and admins can delete event groups" ON event_groups;
DROP POLICY IF EXISTS "Clan masters and admins can insert event groups" ON event_groups;
DROP POLICY IF EXISTS "Clan masters and admins can update all event groups" ON event_groups;
DROP POLICY IF EXISTS "Clan masters and admins can view all event groups" ON event_groups;

-- Create new comprehensive policies for event_groups table
CREATE POLICY "Allow admins and clan masters to insert event groups"
  ON event_groups
  FOR INSERT
  TO authenticated
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'clan_master'::user_role]));

CREATE POLICY "Allow all authenticated users to view event groups"
  ON event_groups
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow admins and clan masters to update event groups"
  ON event_groups
  FOR UPDATE
  TO authenticated
  USING (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'clan_master'::user_role]))
  WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'clan_master'::user_role]));

CREATE POLICY "Allow admins and clan masters to delete event groups"
  ON event_groups
  FOR DELETE
  TO authenticated
  USING (get_user_role(auth.uid()) = ANY (ARRAY['admin'::user_role, 'clan_master'::user_role]));
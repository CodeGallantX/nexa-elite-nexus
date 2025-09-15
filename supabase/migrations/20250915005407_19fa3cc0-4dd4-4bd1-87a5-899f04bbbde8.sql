-- Fix net schema error by replacing net.http_post with proper approach and add weapon layout code field
-- First, let's add weapon_code field to weapon_layouts table
ALTER TABLE weapon_layouts ADD COLUMN weapon_code TEXT;

-- Create activities table for tracking moderator actions
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action_type TEXT NOT NULL, -- e.g., 'update_kills', 'create_event', 'delete_player'
    action_description TEXT NOT NULL,
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Only clan masters can view activities
CREATE POLICY "Clan masters can view all activities" ON activities
FOR SELECT USING (
    get_user_role(auth.uid()) = 'clan_master'::user_role
);

-- Moderators and admins can insert activities
CREATE POLICY "Moderators and admins can insert activities" ON activities
FOR INSERT WITH CHECK (
    get_user_role(auth.uid()) = ANY(ARRAY['admin'::user_role, 'moderator'::user_role, 'clan_master'::user_role])
);

-- Remove the problematic triggers that use net.http_post
DROP TRIGGER IF EXISTS send_push_notification_after_insert ON notifications;
DROP TRIGGER IF EXISTS send_broadcast_push_notification_after_insert ON announcements;
DROP TRIGGER IF EXISTS send_push_notification_on_insert ON notifications;

-- Drop the functions that use net schema with CASCADE
DROP FUNCTION IF EXISTS public.send_push_notification_trigger() CASCADE;
DROP FUNCTION IF EXISTS public.send_broadcast_push_notification_trigger() CASCADE;

-- Create a trigger to log attendance updates (kill modifications)
CREATE OR REPLACE FUNCTION log_attendance_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Log when kills are updated
    IF OLD.event_kills IS DISTINCT FROM NEW.event_kills THEN
        INSERT INTO activities (
            action_type,
            action_description,
            performed_by,
            target_user_id,
            old_value,
            new_value
        ) VALUES (
            'update_kills',
            'Updated kill count for player',
            auth.uid(),
            NEW.player_id,
            jsonb_build_object('kills', OLD.event_kills, 'event_id', OLD.event_id),
            jsonb_build_object('kills', NEW.event_kills, 'event_id', NEW.event_id)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for attendance updates
CREATE TRIGGER log_attendance_changes
    AFTER UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION log_attendance_activity();
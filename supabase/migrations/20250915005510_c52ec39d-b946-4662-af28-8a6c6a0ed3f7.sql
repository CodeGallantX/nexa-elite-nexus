-- Fix the search path warning for the new function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
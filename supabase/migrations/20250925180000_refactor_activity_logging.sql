
-- Drop existing triggers and functions to avoid conflicts
DROP TRIGGER IF EXISTS log_profile_changes ON public.profiles;
DROP TRIGGER IF EXISTS log_event_changes ON public.events;
DROP TRIGGER IF EXISTS log_attendance_changes ON public.attendance;

DROP FUNCTION IF EXISTS log_profile_activity();
DROP FUNCTION IF EXISTS log_event_activity();
DROP FUNCTION IF EXISTS log_attendance_activity();

-- 1. Add category and details to activities table
ALTER TABLE public.activities
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS details JSONB;

-- 2. Create a more detailed function to log profile changes
CREATE OR REPLACE FUNCTION log_profile_changes_detailed()
RETURNS TRIGGER AS $$
DECLARE
    actor_username TEXT;
    target_username TEXT;
    details_jsonb JSONB;
BEGIN
    -- Get actor and target usernames
    SELECT username INTO actor_username FROM public.profiles WHERE id = auth.uid();
    
    IF TG_OP = 'UPDATE' THEN
        SELECT username INTO target_username FROM public.profiles WHERE id = NEW.id;

        -- Track role change
        IF OLD.role IS DISTINCT FROM NEW.role THEN
            details_jsonb := jsonb_build_object(
                'actor_username', actor_username,
                'target_username', target_username,
                'field', 'role',
                'old_value', OLD.role,
                'new_value', NEW.role
            );
            INSERT INTO public.activities (category, action_type, performed_by, target_user_id, details)
            VALUES ('Player Management', 'update_role', auth.uid(), NEW.id, details_jsonb);
        END IF;

        -- Track kills change
        IF OLD.kills IS DISTINCT FROM NEW.kills THEN
            details_jsonb := jsonb_build_object(
                'actor_username', actor_username,
                'target_username', target_username,
                'field', 'kills',
                'old_value', OLD.kills,
                'new_value', NEW.kills
            );
            INSERT INTO public.activities (category, action_type, performed_by, target_user_id, details)
            VALUES ('Player Management', 'update_kills', auth.uid(), NEW.id, details_jsonb);
        END IF;

        -- Track attendance change
        IF OLD.attendance IS DISTINCT FROM NEW.attendance THEN
            details_jsonb := jsonb_build_object(
                'actor_username', actor_username,
                'target_username', target_username,
                'field', 'attendance',
                'old_value', OLD.attendance,
                'new_value', NEW.attendance
            );
            INSERT INTO public.activities (category, action_type, performed_by, target_user_id, details)
            VALUES ('Attendance', 'update_attendance', auth.uid(), NEW.id, details_jsonb);
        END IF;

        -- Track ban status change
        IF OLD.is_banned IS DISTINCT FROM NEW.is_banned THEN
            details_jsonb := jsonb_build_object(
                'actor_username', actor_username,
                'target_username', target_username,
                'field', 'is_banned',
                'old_value', OLD.is_banned,
                'new_value', NEW.is_banned,
                'reason', NEW.ban_reason
            );
            INSERT INTO public.activities (category, action_type, performed_by, target_user_id, details)
            VALUES ('Moderation', CASE WHEN NEW.is_banned THEN 'ban' ELSE 'unban' END, auth.uid(), NEW.id, details_jsonb);
        END IF;

        RETURN NEW;

    ELSIF TG_OP = 'DELETE' THEN
        SELECT username INTO target_username FROM public.profiles WHERE id = OLD.id;
        details_jsonb := jsonb_build_object(
            'actor_username', actor_username,
            'target_username', target_username
        );
        INSERT INTO public.activities (category, action_type, performed_by, target_user_id, details)
        VALUES ('Player Management', 'delete_player', auth.uid(), OLD.id, details_jsonb);
        RETURN OLD;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create a trigger for the new detailed profile logging function
CREATE TRIGGER detailed_profile_activity_trigger
AFTER UPDATE OR DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION log_profile_changes_detailed();

-- 4. Create a more detailed function to log event changes
CREATE OR REPLACE FUNCTION log_event_changes_detailed()
RETURNS TRIGGER AS $$
DECLARE
    actor_username TEXT;
    details_jsonb JSONB;
BEGIN
    SELECT username INTO actor_username FROM public.profiles WHERE id = auth.uid();

    IF TG_OP = 'INSERT' THEN
        details_jsonb := jsonb_build_object(
            'actor_username', actor_username,
            'event_name', NEW.name
        );
        INSERT INTO public.activities (category, action_type, performed_by, details)
        VALUES ('Events', 'create_event', auth.uid(), details_jsonb);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        details_jsonb := jsonb_build_object(
            'actor_username', actor_username,
            'event_name', NEW.name,
            'old_value', row_to_json(OLD),
            'new_value', row_to_json(NEW)
        );
        INSERT INTO public.activities (category, action_type, performed_by, details)
        VALUES ('Events', 'update_event', auth.uid(), details_jsonb);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        details_jsonb := jsonb_build_object(
            'actor_username', actor_username,
            'event_name', OLD.name
        );
        INSERT INTO public.activities (category, action_type, performed_by, details)
        VALUES ('Events', 'delete_event', auth.uid(), details_jsonb);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create a trigger for the new detailed event logging function
CREATE TRIGGER detailed_event_activity_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.events
FOR EACH ROW EXECUTE FUNCTION log_event_changes_detailed();

-- 6. Create a more detailed function to log attendance changes
CREATE OR REPLACE FUNCTION log_attendance_changes_detailed()
RETURNS TRIGGER AS $$
DECLARE
    actor_username TEXT;
    target_username TEXT;
    event_name_text TEXT;
    details_jsonb JSONB;
BEGIN
    SELECT username INTO actor_username FROM public.profiles WHERE id = auth.uid();
    SELECT username INTO target_username FROM public.profiles WHERE id = NEW.player_id;
    SELECT name INTO event_name_text FROM public.events WHERE id = NEW.event_id;

    -- Log when attendance status is updated
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        details_jsonb := jsonb_build_object(
            'actor_username', actor_username,
            'target_username', target_username,
            'event_name', event_name_text,
            'old_value', OLD.status,
            'new_value', NEW.status
        );
        INSERT INTO public.activities (category, action_type, performed_by, target_user_id, details)
        VALUES ('Attendance', 'set_attendance', auth.uid(), NEW.player_id, details_jsonb);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create a trigger for the new detailed attendance logging function
CREATE TRIGGER detailed_attendance_activity_trigger
AFTER UPDATE ON public.attendance
FOR EACH ROW EXECUTE FUNCTION log_attendance_changes_detailed();

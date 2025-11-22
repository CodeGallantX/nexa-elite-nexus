-- Update the log_profile_activity trigger to handle deletions gracefully
-- by not logging activities when the target user is being deleted

CREATE OR REPLACE FUNCTION log_profile_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        -- Only log if there are actual changes to log
        IF OLD IS DISTINCT FROM NEW THEN
            INSERT INTO activities (
                action_type,
                action_description,
                performed_by,
                target_user_id,
                old_value,
                new_value
            ) VALUES (
                'update_player',
                'Updated player profile',
                auth.uid(),
                NEW.id,
                row_to_json(OLD),
                row_to_json(NEW)
            );
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        -- For DELETE operations, we don't set target_user_id to avoid foreign key issues
        -- Instead, we store the user ID in the old_value JSON
        INSERT INTO activities (
            action_type,
            action_description,
            performed_by,
            target_user_id,
            old_value
        ) VALUES (
            'delete_player',
            'Deleted player profile',
            auth.uid(),
            NULL, -- Set to NULL to avoid foreign key constraint violation
            jsonb_build_object(
                'id', OLD.id,
                'ign', OLD.ign,
                'data', row_to_json(OLD)
            )
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger should already exist, but if not, create it
DROP TRIGGER IF EXISTS log_profile_changes ON profiles;
CREATE TRIGGER log_profile_changes
    AFTER UPDATE OR DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION log_profile_activity();

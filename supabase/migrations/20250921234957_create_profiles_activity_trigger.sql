CREATE OR REPLACE FUNCTION log_profile_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
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
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
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
            OLD.id,
            row_to_json(OLD)
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_profile_changes
    AFTER UPDATE OR DELETE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION log_profile_activity();
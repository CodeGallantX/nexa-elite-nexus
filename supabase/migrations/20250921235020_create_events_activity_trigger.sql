CREATE OR REPLACE FUNCTION log_event_activity()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO activities (
            action_type,
            action_description,
            performed_by,
            new_value
        ) VALUES (
            'create_event',
            'Created a new event',
            auth.uid(),
            row_to_json(NEW)
        );
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO activities (
            action_type,
            action_description,
            performed_by,
            old_value,
            new_value
        ) VALUES (
            'update_event',
            'Updated an event',
            auth.uid(),
            row_to_json(OLD),
            row_to_json(NEW)
        );
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO activities (
            action_type,
            action_description,
            performed_by,
            old_value
        ) VALUES (
            'delete_event',
            'Deleted an event',
            auth.uid(),
            row_to_json(OLD)
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_event_changes
    AFTER INSERT OR UPDATE OR DELETE ON events
    FOR EACH ROW
    EXECUTE FUNCTION log_event_activity();
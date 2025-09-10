-- Function to automatically update event status based on date/time
CREATE OR REPLACE FUNCTION update_event_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update events to 'completed' status when the event date/time has passed
  UPDATE events 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE 
    status = 'upcoming' 
    AND (date + time) < NOW();
END;
$$;

-- Create a trigger to automatically update event status when events are queried
CREATE OR REPLACE FUNCTION trigger_update_event_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Call the update function
  PERFORM update_event_status();
  RETURN NULL;
END;
$$;

-- Create a trigger that runs after any operation on events table
DROP TRIGGER IF EXISTS auto_update_event_status ON events;
CREATE TRIGGER auto_update_event_status
  AFTER INSERT OR UPDATE OR SELECT ON events
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_update_event_status();
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
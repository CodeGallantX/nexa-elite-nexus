-- Fix infinite recursion in event status trigger
-- The previous trigger caused a "stack depth limit exceeded" error because:
-- 1. auto_update_event_status trigger fires on INSERT/UPDATE
-- 2. It calls update_event_status() which does UPDATE on events
-- 3. This UPDATE triggers the same trigger again → infinite loop

-- Solution: 
-- 1. Change trigger to only fire on INSERT (not UPDATE) to break the recursion loop
-- 2. The frontend (EventsManagement.tsx) already handles status updates via 
--    updateEventStatuses() function, so server-side auto-update on every operation 
--    is not necessary
-- 3. Keep the standalone update_event_status() function for manual calls or cron jobs

-- Drop the existing problematic trigger
DROP TRIGGER IF EXISTS auto_update_event_status ON events;

-- The update_event_status() function remains unchanged for manual/cron use
-- CREATE OR REPLACE FUNCTION update_event_status() already exists

-- Create a simplified trigger function
-- No recursion guard needed since trigger only fires on INSERT, not UPDATE
CREATE OR REPLACE FUNCTION trigger_update_event_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update events to 'completed' status when the event date/time has passed
  -- Exclude the newly inserted row to prevent any potential issues
  UPDATE events 
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE 
    status = 'upcoming' 
    AND (date + time) < NOW()
    AND id != NEW.id;

  RETURN NEW;
END;
$$;

-- Recreate the trigger - ONLY on INSERT (not UPDATE) to prevent recursion
-- When this trigger's UPDATE runs, it won't re-trigger because the trigger
-- only fires on INSERT operations, not UPDATE operations
CREATE TRIGGER auto_update_event_status
  AFTER INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_event_status();

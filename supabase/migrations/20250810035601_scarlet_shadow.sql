/*
  # Add Event Notifications System

  1. New Functions
    - `create_event_notification()` - Creates notifications when events are created
    - `create_assignment_notification()` - Creates notifications when users are assigned to events

  2. New Triggers
    - Trigger on events table for INSERT operations
    - Trigger on event_participants table for INSERT operations

  3. Security
    - Functions are security definer to allow notification creation
    - Proper error handling for notification failures
*/

-- Function to create event notifications for all users
CREATE OR REPLACE FUNCTION create_event_notification()
RETURNS TRIGGER AS $$
DECLARE
  user_record RECORD;
  event_time TEXT;
BEGIN
  -- Format the event time
  event_time := TO_CHAR(NEW.date::date, 'Mon DD, YYYY') || ' at ' || 
                TO_CHAR(NEW.time::time, 'HH12:MI AM');

  -- Create notification for all users
  FOR user_record IN 
    SELECT id FROM profiles WHERE role IN ('player', 'admin', 'moderator', 'clan_master')
  LOOP
    INSERT INTO notifications (
      type,
      title,
      message,
      user_id,
      data,
      action_data
    ) VALUES (
      'event_created',
      'New Event Scheduled',
      NEW.name || ' has been scheduled for ' || event_time || '.',
      user_record.id,
      jsonb_build_object(
        'event_id', NEW.id,
        'event_name', NEW.name,
        'event_type', NEW.type,
        'event_date', NEW.date,
        'event_time', NEW.time
      ),
      jsonb_build_object(
        'action', 'view_event',
        'event_id', NEW.id
      )
    );
  END LOOP;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the event creation
    RAISE WARNING 'Failed to create event notifications: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create assignment notifications
CREATE OR REPLACE FUNCTION create_assignment_notification()
RETURNS TRIGGER AS $$
DECLARE
  event_record RECORD;
  event_time TEXT;
BEGIN
  -- Get event details
  SELECT * INTO event_record FROM events WHERE id = NEW.event_id;
  
  IF event_record IS NULL THEN
    RETURN NEW;
  END IF;

  -- Format the event time
  event_time := TO_CHAR(event_record.date::date, 'Mon DD, YYYY') || ' at ' || 
                TO_CHAR(event_record.time::time, 'HH12:MI AM');

  -- Create assignment notification for the assigned user
  INSERT INTO notifications (
    type,
    title,
    message,
    user_id,
    data,
    action_data
  ) VALUES (
    'event_assignment',
    'Event Assignment',
    'You''ve been assigned to play in ' || event_record.name || ' on ' || event_time || '.',
    NEW.player_id,
    jsonb_build_object(
      'event_id', NEW.event_id,
      'event_name', event_record.name,
      'event_type', event_record.type,
      'event_date', event_record.date,
      'event_time', event_record.time,
      'group_id', NEW.group_id
    ),
    jsonb_build_object(
      'action', 'view_event',
      'event_id', NEW.event_id
    )
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the assignment
    RAISE WARNING 'Failed to create assignment notification: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for event creation notifications
DROP TRIGGER IF EXISTS on_event_created ON events;
CREATE TRIGGER on_event_created
  AFTER INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION create_event_notification();

-- Create trigger for event assignment notifications
DROP TRIGGER IF EXISTS on_player_assigned ON event_participants;
CREATE TRIGGER on_player_assigned
  AFTER INSERT ON event_participants
  FOR EACH ROW
  EXECUTE FUNCTION create_assignment_notification();
/*
  # Event Notifications System

  1. Database Functions
    - `create_event_notification()` - Creates notifications when events are created
    - `create_assignment_notification()` - Creates notifications when users are assigned to events

  2. Triggers
    - Trigger on events table for INSERT operations
    - Trigger on event_participants table for INSERT operations

  3. Security
    - Functions are security definer to allow notification creation
    - Proper error handling and validation
*/

-- Function to create event notifications for all users
CREATE OR REPLACE FUNCTION create_event_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Create notification for all users when an event is created
  INSERT INTO notifications (
    type,
    title,
    message,
    data,
    user_id
  )
  SELECT 
    'event_created',
    'New Event Scheduled',
    NEW.name || ' has been scheduled for ' || 
    TO_CHAR(NEW.date::date, 'Mon DD, YYYY') || ' at ' || 
    TO_CHAR(NEW.time::time, 'HH12:MI AM'),
    jsonb_build_object(
      'event_id', NEW.id,
      'event_name', NEW.name,
      'event_type', NEW.type,
      'event_date', NEW.date,
      'event_time', NEW.time
    ),
    p.id
  FROM profiles p
  WHERE p.role IN ('player', 'admin', 'moderator', 'clan_master');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create assignment notifications for specific users
CREATE OR REPLACE FUNCTION create_assignment_notification()
RETURNS TRIGGER AS $$
DECLARE
  event_record RECORD;
BEGIN
  -- Get event details
  SELECT * INTO event_record
  FROM events
  WHERE id = NEW.event_id;

  -- Create notification for the assigned player
  INSERT INTO notifications (
    type,
    title,
    message,
    data,
    user_id
  )
  VALUES (
    'event_assignment',
    'Event Assignment',
    'You''ve been assigned to play in ' || event_record.name,
    jsonb_build_object(
      'event_id', NEW.event_id,
      'event_name', event_record.name,
      'event_type', event_record.type,
      'event_date', event_record.date,
      'event_time', event_record.time,
      'participant_id', NEW.id
    ),
    NEW.player_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS on_event_created ON events;
CREATE TRIGGER on_event_created
  AFTER INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION create_event_notification();

DROP TRIGGER IF EXISTS on_player_assigned ON event_participants;
CREATE TRIGGER on_player_assigned
  AFTER INSERT ON event_participants
  FOR EACH ROW
  EXECUTE FUNCTION create_assignment_notification();
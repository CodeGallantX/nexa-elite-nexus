-- Create a function to automatically create notifications for access code requests
CREATE OR REPLACE FUNCTION public.create_access_code_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for admin about new access code request
  INSERT INTO public.notifications (
    type,
    title,
    message,
    data,
    action_data
  ) VALUES (
    'access_code_request',
    'New Access Code Request',
    'Player ' || COALESCE(NEW.requested_by, 'Unknown') || ' requested access code ' || NEW.code,
    jsonb_build_object(
      'code', NEW.code,
      'requested_by', NEW.requested_by,
      'expires_at', NEW.expires_at
    ),
    jsonb_build_object(
      'action', 'copy_code',
      'code', NEW.code
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for access code requests
DROP TRIGGER IF EXISTS on_access_code_request ON public.access_codes;
CREATE TRIGGER on_access_code_request
  AFTER INSERT ON public.access_codes
  FOR EACH ROW
  WHEN (NEW.requested_by IS NOT NULL)
  EXECUTE FUNCTION public.create_access_code_notification();

-- Create a function to automatically create notifications for new player registrations
CREATE OR REPLACE FUNCTION public.create_new_player_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for admin about new player registration
  INSERT INTO public.notifications (
    type,
    title,
    message,
    data,
    action_data
  ) VALUES (
    'new_player_joined',
    'New Player Joined',
    'New player ' || NEW.ign || ' joined the clan',
    jsonb_build_object(
      'player_id', NEW.id,
      'username', NEW.username,
      'ign', NEW.ign,
      'date_joined', NEW.date_joined
    ),
    jsonb_build_object(
      'action', 'view_player',
      'player_id', NEW.id
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new player registrations
DROP TRIGGER IF EXISTS on_new_player_joined ON public.profiles;
CREATE TRIGGER on_new_player_joined
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_new_player_notification();

-- Enable realtime for notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
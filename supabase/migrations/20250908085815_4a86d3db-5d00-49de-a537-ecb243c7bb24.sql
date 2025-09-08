-- Function to send push notifications when notifications are created
CREATE OR REPLACE FUNCTION public.send_push_notification_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the edge function to send push notifications
  PERFORM net.http_post(
    url := 'https://kxnbnuazpzzuttdunkta.supabase.co/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true)
    ),
    body := jsonb_build_object(
      'userIds', ARRAY[NEW.user_id::text],
      'notification', jsonb_build_object(
        'title', NEW.title,
        'message', NEW.message,
        'data', NEW.data
      )
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically send push notifications for user-specific notifications
DROP TRIGGER IF EXISTS send_push_notification_on_insert ON public.notifications;
CREATE TRIGGER send_push_notification_on_insert
  AFTER INSERT ON public.notifications
  FOR EACH ROW
  WHEN (NEW.user_id IS NOT NULL)
  EXECUTE FUNCTION public.send_push_notification_trigger();

-- Function to send broadcast push notifications for announcements
CREATE OR REPLACE FUNCTION public.send_broadcast_push_notification_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the edge function to send broadcast push notifications
  PERFORM net.http_post(
    url := 'https://kxnbnuazpzzuttdunkta.supabase.co/functions/v1/send-push-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true)
    ),
    body := jsonb_build_object(
      'userIds', NULL, -- This will trigger broadcast to all subscribed users
      'notification', jsonb_build_object(
        'title', 'New Announcement: ' || NEW.title,
        'message', LEFT(NEW.content, 100) || CASE WHEN LENGTH(NEW.content) > 100 THEN '...' ELSE '' END,
        'data', jsonb_build_object(
          'type', 'announcement',
          'announcement_id', NEW.id,
          'url', '/announcements'
        )
      )
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to send push notifications for new announcements
DROP TRIGGER IF EXISTS send_announcement_push_notification ON public.announcements;
CREATE TRIGGER send_announcement_push_notification
  AFTER INSERT ON public.announcements
  FOR EACH ROW
  WHEN (NEW.is_published = true)
  EXECUTE FUNCTION public.send_broadcast_push_notification_trigger();
import { supabase } from '@/integrations/supabase/client';

export interface PushNotificationPayload {
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

/**
 * Send push notification to specific users
 * Uses VAPID-based Web Push API through Supabase Edge Function
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
 */
export const sendPushNotification = async (
  userIds: string[],
  notification: PushNotificationPayload
): Promise<boolean> => {
  try {
    console.log('[Push] Sending notification to users:', userIds.length);
    
    const { data, error } = await supabase.functions.invoke('send-push-notification', {
      body: {
        userIds,
        notification
      }
    });

    if (error) {
      console.error('[Push] Error sending push notification:', error);
      return false;
    }

    console.log('[Push] Notification sent successfully:', data);
    return true;
  } catch (error) {
    console.error('[Push] Failed to send push notification:', error);
    return false;
  }
};

/**
 * Broadcast push notification to all users with push subscriptions
 * The Edge Function handles fetching all subscribed users when userIds is empty
 * Reference: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
 */
export const sendBroadcastPushNotification = async (
  notification: PushNotificationPayload
): Promise<boolean> => {
  try {
    console.log('[Push] Broadcasting notification to all subscribed users');
    
    // The Edge Function handles broadcasting when userIds is empty/null
    // This avoids redundant database queries on the client side
    const { data, error } = await supabase.functions.invoke('send-push-notification', {
      body: {
        userIds: null, // null triggers broadcast mode in Edge Function
        notification
      }
    });

    if (error) {
      console.error('[Push] Error broadcasting push notification:', error);
      return false;
    }

    console.log('[Push] Broadcast notification sent successfully:', data);
    return true;
  } catch (error) {
    console.error('[Push] Failed to broadcast push notification:', error);
    return false;
  }
};
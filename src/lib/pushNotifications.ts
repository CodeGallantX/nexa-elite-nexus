import { supabase } from '@/integrations/supabase/client';

export const sendPushNotification = async (
  userIds: string[],
  notification: {
    title: string;
    message: string;
    data?: any;
  }
) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-push-notification', {
      body: {
        userIds,
        notification
      }
    });

    if (error) {
      console.error('Error sending push notification:', error);
      return false;
    }

    console.log('Push notification sent:', data);
    return true;
  } catch (error) {
    console.error('Failed to send push notification:', error);
    return false;
  }
};

// Helper function to send notifications to all users with push subscriptions
export const sendBroadcastPushNotification = async (
  notification: {
    title: string;
    message: string;
    data?: any;
  }
) => {
  try {
    // Get all users with push subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions' as any)
      .select('user_id');

    if (error) {
      console.error('Error getting push subscriptions:', error);
      return false;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No users with push subscriptions found');
      return true;
    }

    const userIds = subscriptions.map((sub: any) => sub.user_id);
    return await sendPushNotification(userIds, notification);
  } catch (error) {
    console.error('Failed to send broadcast push notification:', error);
    return false;
  }
};
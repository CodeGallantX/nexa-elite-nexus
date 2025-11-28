import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// Use the npm 'web-push' package via esm.sh for Deno compatibility
// Reference: https://github.com/web-push-libs/web-push
import * as webpush from 'https://esm.sh/web-push@3.6.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// VAPID (Voluntary Application Server Identification) keys for Web Push
// Reference: https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices
const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY');
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY');
const VAPID_EMAIL = Deno.env.get('VAPID_EMAIL') || 'mailto:nexaesportsmail@gmail.com';

// Validate VAPID configuration
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error('VAPID keys not configured. Push notifications will fail.');
}

// Set VAPID details for web-push library
if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Validate VAPID configuration
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      console.error('VAPID keys not configured');
      return new Response(
        JSON.stringify({ error: 'Push notification service not properly configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { notification, userIds } = await req.json()
    console.log('Push notification request:', { notification, userIds })

    // Validate notification payload
    if (!notification || !notification.title) {
      return new Response(
        JSON.stringify({ error: 'Invalid notification payload - title is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let targetUserIds = userIds

    // If no userIds provided, get all users with push subscriptions (broadcast)
    if (!userIds || userIds.length === 0) {
      console.log('Broadcasting to all subscribed users')
      const { data: subscriptions, error: subError } = await supabaseClient
        .from('push_subscriptions')
        .select('user_id')

      if (subError) {
        console.error('Error getting broadcast subscriptions:', subError)
        throw subError
      }

      targetUserIds = subscriptions?.map(sub => sub.user_id) || []
      console.log(`Found ${targetUserIds.length} subscribed users for broadcast`)
    }

    if (!targetUserIds || targetUserIds.length === 0) {
      console.log('No target users for push notification')
      return new Response(
        JSON.stringify({ message: 'No users to notify', results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get push subscriptions for target users
    const { data: subscriptions, error } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .in('user_id', targetUserIds)

    if (error) {
      console.error('Error getting push subscriptions:', error)
      throw error
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscriptions found for target users')
      return new Response(
        JSON.stringify({ message: 'No push subscriptions found', results: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Sending push notifications to ${subscriptions.length} subscribers`)

    // Track subscriptions to clean up (expired or invalid)
    const subscriptionsToDelete: string[] = [];

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          // Validate subscription data
          if (!sub.endpoint || !sub.p256dh_key || !sub.auth_key) {
            console.warn(`Invalid subscription for user ${sub.user_id}: missing required fields`);
            subscriptionsToDelete.push(sub.user_id);
            return { success: false, userId: sub.user_id, error: 'Invalid subscription data' };
          }

          // Build push subscription object for web-push library
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh_key,
              auth: sub.auth_key,
            },
          };

          // Build notification payload following Web Push API spec
          // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Push_API
          const payload = JSON.stringify({
            title: notification.title,
            body: notification.message || notification.body || '',
            icon: notification.icon || '/nexa-logo.jpg',
            badge: '/pwa-192x192.png', // Small monochrome icon for notification tray
            tag: notification.tag || `nexa-${Date.now()}`,
            data: {
              ...notification.data,
              url: notification.data?.url || '/dashboard',
              timestamp: Date.now(),
              appName: 'Nexa Esports'
            },
            // Notification actions
            // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Notification/actions
            actions: notification.actions || [
              { action: 'open', title: 'Open' },
              { action: 'dismiss', title: 'Dismiss' }
            ],
            // Vibration pattern for mobile devices
            // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
            vibrate: notification.vibrate || [100, 50, 100],
            requireInteraction: notification.requireInteraction ?? false,
            silent: notification.silent ?? false,
            renotify: notification.renotify ?? true,
            timestamp: Date.now()
          });

          // Send push notification
          await webpush.sendNotification(pushSubscription, payload);

          console.log(`Push notification sent to user ${sub.user_id}`);
          return { success: true, userId: sub.user_id };
        } catch (pushError: unknown) {
          console.error(`Failed to send push notification to user ${sub.user_id}:`, pushError);
          
          const errorMessage = pushError instanceof Error ? pushError.message : 'Unknown error';
          const statusCode = (pushError as any)?.statusCode;
          
          // Handle expired/invalid subscriptions (410 Gone or 404 Not Found)
          // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Push_API/Best_Practices#handling_expired_subscriptions
          if (statusCode === 410 || statusCode === 404) {
            console.log(`Subscription expired for user ${sub.user_id}, marking for deletion`);
            subscriptionsToDelete.push(sub.user_id);
          }
          
          return { success: false, userId: sub.user_id, error: errorMessage, statusCode };
        }
      })
    );

    // Clean up expired subscriptions
    if (subscriptionsToDelete.length > 0) {
      console.log(`Cleaning up ${subscriptionsToDelete.length} expired subscriptions`);
      const { error: deleteError } = await supabaseClient
        .from('push_subscriptions')
        .delete()
        .in('user_id', subscriptionsToDelete);
      
      if (deleteError) {
        console.error('Error deleting expired subscriptions:', deleteError);
      }
    }

    const successCount = results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;
    const failedCount = results.length - successCount;

    console.log(`Push notifications: ${successCount} succeeded, ${failedCount} failed out of ${subscriptions.length} subscribers`);

    return new Response(
      JSON.stringify({
        message: `Push notifications processed for ${subscriptions.length} subscribers`,
        successCount,
        failedCount,
        totalSubscriptions: subscriptions.length,
        expiredSubscriptionsRemoved: subscriptionsToDelete.length,
        results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false, error: 'Promise rejected' })
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Push notification error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

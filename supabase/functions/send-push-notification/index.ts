import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://deno.land/x/webpush@0.2.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;
const VAPID_EMAIL = 'mailto:ajibodegbolahan275@gmail.com';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { notification, userIds } = await req.json()
    console.log('Push notification request:', { notification, userIds })

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

    webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh_key,
              auth: sub.auth_key,
            },
          };

          const payload = JSON.stringify({
            title: notification.title,
            body: notification.message,
            icon: '/nexa-logo.jpg',
            badge: '/nexa-logo.jpg',
            tag: 'nexa-notification',
            data: {
              ...notification.data,
              url: notification.data?.url || '/dashboard',
              timestamp: Date.now(),
              appName: 'Nexa Esports'
            },
            actions: [
              {
                action: 'open',
                title: 'Open App',
                icon: '/nexa-logo.jpg'
              }
            ],
            requireInteraction: false,
            silent: false
          });

          await webpush.sendNotification(pushSubscription, payload);

          console.log(`Push notification sent to user ${sub.user_id}`);
          return { success: true, userId: sub.user_id };
        } catch (pushError) {
          console.error(`Failed to send push notification to user ${sub.user_id}:`, pushError)
          return { success: false, userId: sub.user_id, error: pushError.message };
        }
      })
    );

    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    console.log(`Push notifications sent successfully to ${successCount} out of ${subscriptions.length} subscribers`)

    return new Response(
      JSON.stringify({
        message: `Push notifications processed for ${subscriptions.length} subscribers`,
        successCount,
        totalSubscriptions: subscriptions.length,
        results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false })
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Push notification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})

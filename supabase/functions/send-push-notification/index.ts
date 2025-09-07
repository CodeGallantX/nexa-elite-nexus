import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Get push subscriptions for target users
    const { data: subscriptions, error } = await supabaseClient
      .from('push_subscriptions')
      .select('*')
      .in('user_id', userIds || [])

    if (error) {
      throw error
    }

    // Send push notifications
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh_key,
            auth: sub.auth_key
          }
        }

        const payload = JSON.stringify({
          title: notification.title,
          body: notification.message,
          icon: '/nexa-logo.jpg',
          badge: '/nexa-logo.jpg',
          data: notification.data
        })

        // Use web-push library to send notification
        const response = await fetch('https://fcm.googleapis.com/fcm/send', {
          method: 'POST',
          headers: {
            'Authorization': `key=${Deno.env.get('FCM_SERVER_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: pushSubscription.endpoint.split('/').pop(),
            notification: {
              title: notification.title,
              body: notification.message,
              icon: '/nexa-logo.jpg'
            },
            data: notification.data
          })
        })

        return { success: response.ok, userId: sub.user_id }
      })
    )

    return new Response(
      JSON.stringify({ 
        message: 'Push notifications sent',
        results: results.map(r => r.status === 'fulfilled' ? r.value : { success: false })
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
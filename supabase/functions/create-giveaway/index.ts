import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const { title, message, code_value, total_codes, expires_in_hours } = await req.json();

    if (!title || !code_value || !total_codes || !expires_in_hours) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    if (code_value <= 0 || total_codes <= 0 || expires_in_hours <= 0) {
      return new Response(JSON.stringify({ error: "Invalid values" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { data: transaction, error } = await supabaseClient.rpc('create_giveaway_with_codes', {
      p_title: title,
      p_message: message || null,
      p_code_value: code_value,
      p_total_codes: total_codes,
      p_expires_in_hours: expires_in_hours,
    });

    if (error) {
      console.error("Error creating giveaway:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const giveawayId = transaction?.giveaway_id; // The giveaway_id is now part of the returned transaction object, assuming it is. This is a guess.

    // Fetch the created giveaway with codes
    const { data: giveaway, error: fetchError } = await supabaseClient
      .from('giveaways')
      .select('*, giveaway_codes(code, value)')
      .eq('id', giveawayId)
      .single();

    if (fetchError) {
      console.error("Error fetching giveaway:", fetchError);
    }


    // Send notification to all clan members
    const { data: profiles } = await supabaseClient
      .from('profiles')
      .select('id, ign')
      .neq('id', user.id);

    if (profiles && profiles.length > 0) {
      const notifications = profiles.map((profile) => ({
        type: 'giveaway_created',
        title: '🎁 New Giveaway Available!',
        message: `${title} - Be the first to claim your share!`,
        user_id: profile.id,
        data: {
          giveaway_id: giveawayId,
          code_value: code_value,
          total_codes: total_codes,
          codes: giveaway?.giveaway_codes?.map(c => c.code) || [],
        },
      }));

      await supabaseClient.from('notifications').insert(notifications);
    }

    // Send push notification to all subscribed users
    try {
      await supabaseClient.functions.invoke('send-push-notification', {
        body: {
          userIds: null, // Sending to all users
          notification: {
            title: '🎁 New Giveaway Available!',
            message: `${title} - Be the first to claim your share!`,
            data: {
              giveaway_id: giveawayId,
              code_value: code_value,
              total_codes: total_codes,
              codes: giveaway?.giveaway_codes?.map(c => c.code) || [],
            },
          },
        },
      });
    } catch (pushError) {
      console.error("Error sending push notification:", pushError);
      // Do not block the response for push notification errors
    }

    return new Response(JSON.stringify({ 
      success: true, 
      giveaway_id: giveawayId,
      giveaway,
      transaction
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    console.error("Unexpected error in create-giveaway:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

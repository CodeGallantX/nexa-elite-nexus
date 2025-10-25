
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Create a Supabase client with the user's auth token
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

  const { endpoint, name, account_number, bank_code, amount, recipient_code } = await req.json();

  if (endpoint === "create-transfer-recipient") {
    // ... (rest of the endpoint remains the same)
  }

  if (endpoint === "initiate-transfer") {
    console.log(`Initiating transfer for user ${user.id} of amount ${amount}`);

    // 1. Verify user's wallet balance
    const { data: wallet, error: walletError } = await supabaseAdmin
      .from("wallets")
      .select("balance")
      .eq("user_id", user.id)
      .single();

    if (walletError || !wallet) {
      console.error(`Wallet not found for user ${user.id}:`, walletError);
      return new Response(JSON.stringify({ error: "Wallet not found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      });
    }

    if (wallet.balance < amount) {
      console.warn(`User ${user.id} has insufficient funds for withdrawal. Balance: ${wallet.balance}, Amount: ${amount}`);
      return new Response(JSON.stringify({ error: "Insufficient funds" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // 2. Proceed with Paystack transfer
    const paystackUrl = "https://api.paystack.co/transfer";
    // ... (rest of the transfer logic remains the same)
  }
  
  // ... (rest of the file remains the same)
});

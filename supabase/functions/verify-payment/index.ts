import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { reference } = await req.json();

    const paystackUrl = `https://api.paystack.co/transaction/verify/${reference}`;
    const paystackResponse = await fetch(paystackUrl, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    if (!paystackResponse.ok) {
      return new Response(JSON.stringify({ error: "Payment verification failed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const paystackData = await paystackResponse.json();

    if (paystackData.data.status !== 'success') {
        return new Response(JSON.stringify({ error: "Payment not successful", data: paystackData }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const { data: existingTransaction, error: existingTransactionError } = await supabaseAdmin
        .from('transactions')
        .select('id')
        .eq('reference', reference)
        .maybeSingle();

    if (existingTransactionError) {
        console.error('Error checking for existing transaction:', existingTransactionError);
        return new Response(JSON.stringify({ error: 'Error checking for existing transaction' }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (existingTransaction) {
      return new Response(JSON.stringify({ message: "Transaction already processed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = paystackData.data.metadata.userId;
    const amount = paystackData.data.amount / 100;

    const { data: newBalance, error: creditWalletError } = await supabaseAdmin.rpc('credit_wallet', {
      p_user_id: userId,
      p_amount: amount,
      p_reference: reference,
    });

    if (creditWalletError) {
      console.error('Error crediting wallet:', creditWalletError);
      return new Response(JSON.stringify({ error: 'Error crediting wallet' }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('New balance:', newBalance);

    return new Response(JSON.stringify(paystackData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Unexpected error in verify-payment:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});


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
    try {
      const paystackUrl = "https://api.paystack.co/transferrecipient";
      const response = await fetch(paystackUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "nuban",
          name,
          account_number,
          bank_code,
          currency: "NGN",
        }),
      });

      const result = await response.json();
      console.log("Paystack create recipient response:", result);

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: response.ok ? 200 : 400,
      });
    } catch (error) {
      console.error("Error creating transfer recipient:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
  }

  if (endpoint === "initiate-transfer") {
    console.log(`Initiating transfer for user ${user.id} of amount ${amount}`);

    try {
      const fee = 50;
      const totalDeduction = amount + fee;

      // 1. Verify user's wallet balance
      const { data: wallet, error: walletError } = await supabaseAdmin
        .from("wallets")
        .select("id, balance")
        .eq("user_id", user.id)
        .single();

      if (walletError || !wallet) {
        console.error(`Wallet not found for user ${user.id}:`, walletError);
        return new Response(JSON.stringify({ error: "Wallet not found" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        });
      }

      if (wallet.balance < totalDeduction) {
        console.warn(`User ${user.id} has insufficient funds. Balance: ${wallet.balance}, Required: ${totalDeduction}`);
        return new Response(JSON.stringify({ error: "Insufficient funds for withdrawal and fee" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }

      // 2. Proceed with Paystack transfer (convert amount to kobo)
      const amountInKobo = amount * 100;
      const paystackUrl = "https://api.paystack.co/transfer";
      
      const response = await fetch(paystackUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: "balance",
          amount: amountInKobo,
          recipient: recipient_code,
          reason: "Wallet withdrawal",
        }),
      });

      const result = await response.json();
      console.log("Paystack transfer response:", result);

      if (!response.ok || !result.status) {
        // ... (error handling remains the same)
      }

      // 3. Deduct from wallet and create transaction record
      const { data: transactionData, error: updateError } = await supabaseAdmin.rpc(
        'update_wallet_and_create_transaction',
        {
          p_wallet_id: wallet.id,
          p_new_balance: wallet.balance - totalDeduction,
          p_transaction_amount: amount,
          p_transaction_type: 'withdrawal',
          p_transaction_status: 'success',
          p_transaction_reference: result.data.reference,
        }
      );

      if (updateError) {
        console.error("Error updating wallet:", updateError);
        // Potentially reverse Paystack transfer here if possible, or flag for manual review
        return new Response(JSON.stringify({ error: "Failed to update wallet" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
      
      // 4. Log the fee in the earnings table
      const transactionId = transactionData; // The RPC should return the new transaction's ID
      if (transactionId) {
        const { error: feeError } = await supabaseAdmin
          .from('earnings')
          .insert({ transaction_id: transactionId, amount: fee });

        if (feeError) {
          console.error("Error logging transaction fee:", feeError);
          // This is not a critical failure, but should be logged for monitoring
        }
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      console.error("Error initiating transfer:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
  }

  return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 400,
  });
});

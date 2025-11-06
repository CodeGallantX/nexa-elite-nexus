import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // This function should only be callable by a service role or a scheduled job
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const token = authHeader.split(' ')[1];
    if (token !== Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')) {
      return new Response(JSON.stringify({ error: "Forbidden: Invalid service role key" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    // Fetch the current tax amount
    const { data: taxData, error: taxError } = await supabaseAdmin
      .from('taxes')
      .select('amount')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (taxError && taxError.code !== 'PGRST116') {
      console.error('Error fetching tax amount:', taxError);
      throw taxError;
    }

    const taxAmount = taxData ? taxData.amount : 0;

    if (taxAmount <= 0) {
      return new Response(JSON.stringify({ message: "No tax to deduct (amount is 0 or less)" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Fetch all user wallets
    const { data: wallets, error: walletsError } = await supabaseAdmin
      .from('wallets')
      .select('id, user_id, balance');

    if (walletsError) {
      console.error('Error fetching wallets:', walletsError);
      throw walletsError;
    }

    const deductionPromises = wallets.map(async (wallet) => {
      if (wallet.balance >= taxAmount) {
        const newBalance = wallet.balance - taxAmount;
        const { error: updateError } = await supabaseAdmin.rpc('update_wallet_and_create_transaction', {
          p_wallet_id: wallet.id,
          p_new_balance: newBalance,
          p_transaction_amount: taxAmount,
          p_transaction_type: 'tax_deduction',
          p_transaction_status: 'success',
          p_transaction_reference: `monthly_tax_${new Date().toISOString().slice(0, 7)}`,
        });

        if (updateError) {
          console.error(`Error deducting tax from wallet ${wallet.id}:`, updateError);
          return { walletId: wallet.id, success: false, error: updateError.message };
        }

        // Log the tax amount as earnings
        const { error: earningsError } = await supabaseAdmin
          .from('earnings')
          .insert({ transaction_id: null, amount: taxAmount }); // transaction_id will be null for tax earnings

        if (earningsError) {
          console.error(`Error logging tax earnings for wallet ${wallet.id}:`, earningsError);
        }

        return { walletId: wallet.id, success: true };
      } else {
        console.log(`Wallet ${wallet.id} has insufficient funds for tax deduction. Balance: ${wallet.balance}, Tax: ${taxAmount}`);
        return { walletId: wallet.id, success: false, error: "Insufficient funds" };
      }
    });

    const results = await Promise.all(deductionPromises);
    const successfulDeductions = results.filter(r => r.success).length;

    return new Response(JSON.stringify({
      message: `Monthly tax deduction processed. Successful deductions: ${successfulDeductions}/${wallets.length}`,
      results,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    console.error("Unexpected error in deduct-monthly-tax:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

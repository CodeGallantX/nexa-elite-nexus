import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the latest tax amount
    const { data: taxData, error: taxError } = await supabaseAdmin
      .from('taxes')
      .select('amount')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (taxError || !taxData) {
      return new Response(
        JSON.stringify({ error: 'No tax amount configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const taxAmount = taxData.amount;

    // Get all wallets (deduct from all, allow negative balances)
    const { data: wallets, error: walletsError } = await supabaseAdmin
      .from('wallets')
      .select('id, balance, user_id');

    if (walletsError) {
      throw walletsError;
    }

    if (!wallets || wallets.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No wallets found', deducted: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    let deductedCount = 0;
    const errors = [];

    // Deduct tax from each wallet
    for (const wallet of wallets) {
      try {
        // Deduct from wallet
        const { error: updateError } = await supabaseAdmin
          .from('wallets')
          .update({ balance: wallet.balance - taxAmount })
          .eq('id', wallet.id);

        if (updateError) {
          errors.push({ wallet_id: wallet.id, error: updateError.message });
          continue;
        }

        // Record transaction
        const { data: transactionData, error: transactionError } = await supabaseAdmin
          .from('transactions')
          .insert({
            wallet_id: wallet.id,
            amount: taxAmount,
            type: 'tax_deduction',
            status: 'success',
            reference: `monthly_tax_${new Date().toISOString().slice(0, 7)}_${wallet.id}`
          })
          .select('id')
          .single();

        if (transactionError) {
          errors.push({ wallet_id: wallet.id, error: transactionError.message });
          continue;
        }

        // Log as earnings with source
        await supabaseAdmin
          .from('earnings')
          .insert({
            transaction_id: transactionData.id,
            amount: taxAmount,
            source: 'tax_fee'
          });

        deductedCount++;
      } catch (err) {
        console.error(`Failed to deduct tax for wallet ${wallet.id}:`, err);
        errors.push({ wallet_id: wallet.id, error: err instanceof Error ? err.message : String(err) });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Monthly tax of ₦${taxAmount} deducted from ${deductedCount} wallets`,
        deducted: deductedCount,
        total_wallets: wallets.length,
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in deduct-monthly-tax:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

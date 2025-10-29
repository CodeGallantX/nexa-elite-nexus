import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import * as crypto from "https://deno.land/std@0.168.0/node/crypto.ts";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");

serve(async (req) => {
  const signature = req.headers.get("x-paystack-signature");
  const body = await req.text();

  if (!PAYSTACK_SECRET_KEY) {
    console.error("Paystack secret key not set");
    return new Response("Paystack secret key not set", { status: 500 });
  }

  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET_KEY)
    .update(body)
    .digest("hex");

  if (hash !== signature) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    const { amount, reference, customer, currency } = event.data;
    const { email } = customer;

    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      console.error("User not found:", userError);
      return new Response("User not found", { status: 404 });
    }

    const { data: existingTransaction, error: existingTransactionError } =
      await supabaseAdmin
        .from("transactions")
        .select("id")
        .eq("reference", reference)
        .single();

    if (existingTransaction) {
      return new Response("Transaction already processed", { status: 200 });
    }

    let { data: wallet, error: walletError } = await supabaseAdmin
      .from("wallets")
      .select("id, balance")
      .eq("user_id", user.id)
      .single();

    if (walletError && walletError.code !== "PGRST116") {
      console.error("Error getting wallet:", walletError);
      return new Response("Error getting wallet", { status: 500 });
    }

    if (!wallet) {
      const { data: newWallet, error: newWalletError } = await supabaseAdmin
        .from("wallets")
        .insert({ user_id: user.id, balance: 0 })
        .select("id, balance")
        .single();

      if (newWalletError) {
        console.error("Error creating wallet:", newWalletError);
        return new Response("Error creating wallet", { status: 500 });
      }
      wallet = newWallet;
    }

    const newBalance = wallet.balance + amount / 100;

    const { error: transactionError } = await supabaseAdmin.rpc(
      "update_wallet_and_create_transaction",
      {
        wallet_id: wallet.id,
        new_balance: newBalance,
        transaction_amount: amount / 100,
        transaction_type: "deposit",
        transaction_status: "success",
        transaction_reference: reference,
        transaction_currency: currency,
      }
    );

    if (transactionError) {
      console.error("Error processing transaction:", transactionError);
      return new Response("Error processing transaction", { status: 500 });
    }

    return new Response("Wallet updated successfully", { status: 200 });
  }

  return new Response("Event not handled", { status: 200 });
});

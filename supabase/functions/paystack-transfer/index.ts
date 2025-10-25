
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { endpoint, name, account_number, bank_code, amount, recipient_code } = await req.json();

  if (endpoint === "create-transfer-recipient") {
    const paystackUrl = "https://api.paystack.co/transferrecipient";
    const paystackResponse = await fetch(paystackUrl, {
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

    const paystackData = await paystackResponse.json();

    return new Response(JSON.stringify(paystackData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (endpoint === "initiate-transfer") {
    const paystackUrl = "https://api.paystack.co/transfer";
    const paystackResponse = await fetch(paystackUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source: "balance",
        amount: amount * 100, // Paystack expects amount in kobo
        recipient: recipient_code,
        reason: "Wallet withdrawal",
      }),
    });

    const paystackData = await paystackResponse.json();

    return new Response(JSON.stringify(paystackData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 400,
  });
});

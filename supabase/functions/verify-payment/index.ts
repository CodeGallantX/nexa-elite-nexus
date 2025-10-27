import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");

serve(async (req) => {
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const { reference } = await req.json();

  const paystackUrl = `https://api.paystack.co/transaction/verify/${reference}`;
  const paystackResponse = await fetch(paystackUrl, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  const paystackData = await paystackResponse.json();

  return new Response(JSON.stringify(paystackData), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});

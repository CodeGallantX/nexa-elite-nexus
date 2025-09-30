import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8081',
  'https://nexa-esports.vercel.app',
];

const getCorsHeaders = (request: Request) => {
  const origin = request.headers.get('Origin') || '';
  const isAllowed = allowedOrigins.includes(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'https://nexa-esports.vercel.app',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  { global: { headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` } } }
);

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, reason } = await req.json();
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError) {
      throw userError;
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_banned: true, ban_reason: reason, banned_at: new Date().toISOString(), banned_by: user.id })
      .eq('id', userId);

    if (profileError) {
      throw profileError;
    }

    return new Response(JSON.stringify({ message: `User ${userId} has been banned.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
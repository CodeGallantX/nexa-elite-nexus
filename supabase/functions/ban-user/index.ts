
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  { global: { headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` } } }
)

Deno.serve(async (req) => {
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

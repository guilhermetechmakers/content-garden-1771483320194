// Supabase Edge Function: POST triage action (Keep / Merge / Ignore)
// Records action and updates seed status for Ignore.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

type TriageActionType = 'keep' | 'merge' | 'ignore'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ message: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (userError || !user) {
      return new Response(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = (await req.json()) as { seed_id: string; action: TriageActionType }
    const { seed_id, action } = body

    if (!seed_id || !['keep', 'merge', 'ignore'].includes(action)) {
      return new Response(
        JSON.stringify({ message: 'seed_id and action (keep|merge|ignore) required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: seed, error: seedError } = await supabase
      .from('seeds')
      .select('id, user_id')
      .eq('id', seed_id)
      .eq('user_id', user.id)
      .single()

    if (seedError || !seed) {
      return new Response(
        JSON.stringify({ message: 'Seed not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    await supabase.from('seed_triage_actions').insert({
      user_id: user.id,
      seed_id,
      action,
    })

    if (action === 'ignore') {
      await supabase
        .from('seeds')
        .update({ status: 'ignored' })
        .eq('id', seed_id)
        .eq('user_id', user.id)
    }

    return new Response(
      JSON.stringify({ ok: true, seed_id, action }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ message: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

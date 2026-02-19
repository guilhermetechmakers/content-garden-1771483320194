// Supabase Edge Function: POST merge seeds with provenance
// Creates a new seed from selected seeds and records provenance for undo/audit.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    const body = (await req.json()) as { seed_ids: string[]; title?: string }
    const { seed_ids, title: customTitle } = body

    if (!Array.isArray(seed_ids) || seed_ids.length < 2) {
      return new Response(
        JSON.stringify({ message: 'seed_ids array with at least 2 ids required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: sources, error: sourcesError } = await supabase
      .from('seeds')
      .select('*')
      .in('id', seed_ids)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (sourcesError || !sources?.length || sources.length !== seed_ids.length) {
      return new Response(
        JSON.stringify({ message: 'One or more seeds not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const allTags = [...new Set(sources.flatMap((s: { tags: string[] }) => s.tags ?? []))]
    const allBullets = sources.flatMap((s: { extracted_bullets: string[] }) => s.extracted_bullets ?? [])
    const mergedTitle = customTitle?.trim() || sources.map((s: { title: string }) => s.title).filter(Boolean)[0] || 'Merged seed'
    const mergedContent = sources.map((s: { title: string; content: string }) => `${s.title}\n${s.content}`).join('\n\n')

    const { data: newSeed, error: insertError } = await supabase
      .from('seeds')
      .insert({
        user_id: user.id,
        type: 'thought',
        title: mergedTitle,
        content: mergedContent,
        tags: allTags,
        extracted_bullets: allBullets,
        status: 'active',
      })
      .select()
      .single()

    if (insertError || !newSeed) {
      return new Response(
        JSON.stringify({ message: insertError?.message ?? 'Failed to create merged seed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    await supabase.from('seed_merge_provenance').insert({
      merged_seed_id: newSeed.id,
      source_seed_ids: seed_ids,
    })

    await supabase
      .from('seeds')
      .update({ status: 'merged' })
      .in('id', seed_ids)
      .eq('user_id', user.id)

    for (const sid of seed_ids) {
      await supabase.from('seed_triage_actions').insert({
        user_id: user.id,
        seed_id: sid,
        action: 'merge',
      })
    }

    return new Response(
      JSON.stringify({
        seed: newSeed,
        provenance: { merged_seed_id: newSeed.id, source_seed_ids: seed_ids, created_at: new Date().toISOString() },
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ message: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

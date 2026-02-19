// Supabase Edge Function: Asset Manager CRUD
// All request handling, validation, and data access run here.
// Client can call via supabase.functions.invoke('asset-manager', { body: { method, path, body } })
// or proxy REST /asset-manager/* to this function.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AssetManagerRow {
  id: string
  user_id: string
  title: string
  description: string | null
  status: string
  created_at: string
  updated_at: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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

    const url = new URL(req.url)
    const path = url.pathname.replace(/^.*\/asset-manager\/?/, '') || ''
    const segments = path.split('/').filter(Boolean)
    const id = segments[0] && segments[0] !== 'new' ? segments[0] : null

    if (req.method === 'GET') {
      if (id) {
        const { data, error } = await supabase
          .from('asset_manager')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single()
        if (error || !data) {
          return new Response(
            JSON.stringify({ message: 'Not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10))
      const perPage = Math.min(50, Math.max(1, parseInt(url.searchParams.get('per_page') ?? '10', 10)))
      const status = url.searchParams.get('status') ?? ''
      const search = url.searchParams.get('search') ?? ''
      const from = (page - 1) * perPage

      let query = supabase
        .from('asset_manager')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .range(from, from + perPage - 1)

      if (status) query = query.eq('status', status)
      if (search) query = query.ilike('title', `%${search}%`)

      const { data, error, count } = await query
      if (error) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(
        JSON.stringify({ data: data ?? [], total: count ?? 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST' && !id) {
      const body = (await req.json()) as { title: string; description?: string; status?: string }
      if (!body?.title?.trim()) {
        return new Response(
          JSON.stringify({ message: 'Title is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const { data, error } = await supabase
        .from('asset_manager')
        .insert({
          user_id: user.id,
          title: body.title.trim(),
          description: body.description?.trim() ?? null,
          status: body.status?.trim() ?? 'active',
        })
        .select()
        .single()
      if (error) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if ((req.method === 'PATCH' || req.method === 'PUT') && id) {
      const body = (await req.json()) as { title?: string; description?: string; status?: string }
      const updates: Partial<AssetManagerRow> = {}
      if (body?.title !== undefined) updates.title = body.title.trim()
      if (body?.description !== undefined) updates.description = body.description?.trim() || null
      if (body?.status !== undefined) updates.status = body.status?.trim() ?? 'active'

      const { data, error } = await supabase
        .from('asset_manager')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()
      if (error) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (!data) {
        return new Response(
          JSON.stringify({ message: 'Not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (req.method === 'DELETE' && id) {
      const { error } = await supabase
        .from('asset_manager')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)
      if (error) {
        return new Response(
          JSON.stringify({ message: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      return new Response(undefined, { status: 204, headers: corsHeaders })
    }

    return new Response(
      JSON.stringify({ message: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ message: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Supabase Edge Function: GET clustered seeds for Garden feed
// Returns seeds grouped by soft cluster with labels and confidence.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'GET') {
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

    const url = new URL(req.url)
    const search = url.searchParams.get('search') ?? ''
    const statusFilter = url.searchParams.get('status') ?? 'active'

    // Fetch user's active seeds (or all for triage view)
    let seedsQuery = supabase
      .from('seeds')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (statusFilter) {
      seedsQuery = seedsQuery.eq('status', statusFilter)
    }
    if (search.trim()) {
      seedsQuery = seedsQuery.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
    }

    const { data: seeds, error: seedsError } = await seedsQuery
    if (seedsError) {
      return new Response(
        JSON.stringify({ message: seedsError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const seedList = seeds ?? []
    if (seedList.length === 0) {
      return new Response(
        JSON.stringify({ clusters: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const seedIds = seedList.map((s: { id: string }) => s.id)

    // Fetch cluster assignments and cluster labels
    const { data: assignments } = await supabase
      .from('seed_cluster_assignments')
      .select('seed_id, cluster_id, confidence')
      .in('seed_id', seedIds)

    const clusterIds = [...new Set((assignments ?? []).map((a: { cluster_id: string }) => a.cluster_id))]
    const assignmentMap = new Map<string, { cluster_id: string; confidence: number }>()
    for (const a of assignments ?? []) {
      assignmentMap.set(a.seed_id, { cluster_id: a.cluster_id, confidence: Number(a.confidence) })
    }

    let clustersList: Array<{ id: string; label: string; confidence: number }> = []
    if (clusterIds.length > 0) {
      const { data: clusters } = await supabase
        .from('seed_clusters')
        .select('id, label, confidence')
        .in('id', clusterIds)
        .eq('user_id', user.id)
      clustersList = clusters ?? []
    }

    const clusterById = new Map(clustersList.map((c) => [c.id, c]))

    // Build default "Unclustered" for seeds with no assignment
    const unclusteredLabel = 'Unclustered'
    const unclusteredId = 'unclustered'

    const clustersOut: Array<{
      id: string
      label: string
      confidence: number
      seeds: Array<Record<string, unknown>>
    }> = []

    const seedsByCluster = new Map<string, Array<Record<string, unknown>>>()

    for (const seed of seedList) {
      const a = assignmentMap.get(seed.id)
      const clusterId = a?.cluster_id ?? unclusteredId
      const conf = a?.confidence ?? 0.5
      const cluster = clusterById.get(clusterId)
      const label = cluster?.label ?? unclusteredLabel
      const clusterConf = cluster?.confidence ?? 0.5

      if (!seedsByCluster.has(clusterId)) {
        seedsByCluster.set(clusterId, [])
        clustersOut.push({
          id: clusterId,
          label,
          confidence: clusterId === unclusteredId ? 0.5 : clusterConf,
          seeds: seedsByCluster.get(clusterId)!,
        })
      }
      seedsByCluster.get(clusterId)!.push({
        ...seed,
        cluster_id: clusterId,
        cluster_label: label,
        cluster_confidence: clusterId === unclusteredId ? 0.5 : conf,
      })
    }

    // Sort clusters: Unclustered last, else by label
    clustersOut.sort((a, b) => {
      if (a.id === unclusteredId) return 1
      if (b.id === unclusteredId) return -1
      return a.label.localeCompare(b.label)
    })

    return new Response(
      JSON.stringify({ clusters: clustersOut }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (e) {
    return new Response(
      JSON.stringify({ message: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

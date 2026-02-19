import { api } from '@/lib/api'
import type {
  Seed,
  SeedCreateInput,
  SeedListParams,
  SeedListResponse,
  SeedMergeInput,
  SeedMergeResult,
  ClusteredSeedsResponse,
  ClusteredSeed,
  TriageActionType,
} from '@/types/seed'

const BASE = '/seeds'

/** Normalize API seed to full Seed shape. */
function normalizeSeed(raw: Record<string, unknown>): Seed {
  return {
    id: String(raw.id),
    user_id: raw.user_id != null ? String(raw.user_id) : undefined,
    type: (raw.type as Seed['type']) ?? 'thought',
    title: raw.title != null ? String(raw.title) : String(raw.content ?? '').slice(0, 80),
    content: String(raw.content ?? ''),
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    extracted_bullets: Array.isArray(raw.extracted_bullets) ? (raw.extracted_bullets as string[]) : [],
    source_url: raw.source_url != null ? String(raw.source_url) : undefined,
    attachments: Array.isArray(raw.attachments) ? (raw.attachments as string[]) : undefined,
    created_at: String(raw.created_at),
    updated_at: raw.updated_at != null ? String(raw.updated_at) : undefined,
    cluster_label: raw.cluster_label != null ? String(raw.cluster_label) : undefined,
    status: (raw.status as Seed['status']) ?? 'active',
  }
}

function normalizeListResponse(raw: SeedListResponse): SeedListResponse {
  return {
    ...raw,
    data: (raw.data ?? []).map((s) => normalizeSeed(s as unknown as Record<string, unknown>)),
  }
}

function normalizeClusteredSeed(raw: Record<string, unknown>): ClusteredSeed {
  const seed = normalizeSeed(raw) as ClusteredSeed
  seed.cluster_id = String(raw.cluster_id ?? 'unclustered')
  seed.cluster_label = String(raw.cluster_label ?? 'Unclustered')
  seed.cluster_confidence = Number(raw.cluster_confidence ?? 0.5)
  return seed
}

function normalizeClusteredResponse(raw: ClusteredSeedsResponse): ClusteredSeedsResponse {
  return {
    clusters: (raw.clusters ?? []).map((c) => ({
      ...c,
      seeds: (c.seeds ?? []).map((s) => normalizeClusteredSeed(s as unknown as Record<string, unknown>)),
    })),
  }
}

export const seedService = {
  async create(input: SeedCreateInput): Promise<Seed> {
    const res = await api.post<Record<string, unknown>>(BASE, input)
    return normalizeSeed(res)
  },

  async list(params?: SeedListParams): Promise<SeedListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page != null) searchParams.set('page', String(params.page))
    if (params?.perPage != null) searchParams.set('per_page', String(params.perPage))
    if (params?.sort) searchParams.set('sort', params.sort)
    if (params?.order) searchParams.set('order', params.order)
    if (params?.search) searchParams.set('search', params.search)
    if (params?.type) searchParams.set('type', params.type)
    if (params?.status) searchParams.set('status', params.status)
    if (params?.cluster) searchParams.set('cluster', params.cluster)
    const q = searchParams.toString()
    const res = await api.get<SeedListResponse>(q ? `${BASE}?${q}` : BASE)
    return normalizeListResponse(res)
  },

  async getById(id: string): Promise<Seed> {
    const res = await api.get<Record<string, unknown>>(`${BASE}/${id}`)
    return normalizeSeed(res)
  },

  async getClustered(params?: { search?: string; status?: string }): Promise<ClusteredSeedsResponse> {
    const searchParams = new URLSearchParams()
    searchParams.set('clustered', '1')
    if (params?.search) searchParams.set('search', params.search)
    if (params?.status) searchParams.set('status', params.status)
    const res = await api.get<ClusteredSeedsResponse>(`${BASE}?${searchParams.toString()}`)
    return normalizeClusteredResponse(res)
  },

  async triage(seedId: string, action: TriageActionType): Promise<{ ok: boolean; seed_id: string; action: string }> {
    return api.post<{ ok: boolean; seed_id: string; action: string }>(`${BASE}/triage`, {
      seed_id: seedId,
      action,
    })
  },

  async merge(input: SeedMergeInput): Promise<SeedMergeResult> {
    const res = await api.post<{ seed: Record<string, unknown>; provenance: { merged_seed_id: string; source_seed_ids: string[] } }>(
      `${BASE}/merge`,
      input
    )
    return {
      id: res.seed.id as string,
      title: res.seed.title as string,
      content: res.seed.content as string,
      merged_from: res.provenance?.source_seed_ids ?? [],
    }
  },

  async keep(id: string): Promise<Seed> {
    const res = await api.patch<Record<string, unknown>>(`${BASE}/${id}`, { status: 'kept' })
    return normalizeSeed(res)
  },

  async ignore(id: string): Promise<Seed> {
    const res = await api.patch<Record<string, unknown>>(`${BASE}/${id}`, { status: 'ignored' })
    return normalizeSeed(res)
  },

  async archive(id: string): Promise<Seed> {
    const res = await api.patch<Record<string, unknown>>(`${BASE}/${id}`, { status: 'archived' })
    return normalizeSeed(res)
  },

  async delete(id: string): Promise<void> {
    await api.delete<void>(`${BASE}/${id}`)
  },

  async bulkDelete(ids: string[]): Promise<void> {
    await api.post<void>(`${BASE}/bulk-delete`, { ids })
  },

  async bulkArchive(ids: string[]): Promise<void> {
    await api.post<void>(`${BASE}/bulk-archive`, { ids })
  },
}

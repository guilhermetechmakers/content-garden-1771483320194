/** Seed model: capture & storage with metadata and extraction. */
export interface Seed {
  id: string
  user_id?: string
  type: 'link' | 'voice' | 'screenshot' | 'thought'
  title: string
  content: string
  tags: string[]
  extracted_bullets: string[]
  source_url?: string
  attachments?: string[]
  created_at: string
  updated_at?: string
  /** Soft-cluster label from clustering service (optional). */
  cluster_label?: string
  /** Triage state: kept, ignored, merged, or active. */
  status?: 'active' | 'kept' | 'ignored' | 'archived' | 'merged'
  /** Cluster id when from clustered feed. */
  cluster_id?: string
  /** Cluster confidence 0–1 when from clustered feed. */
  cluster_confidence?: number
}

/** Seed with cluster info for Garden clustered feed. */
export interface ClusteredSeed extends Seed {
  cluster_id: string
  cluster_label: string
  cluster_confidence: number
}

/** Response for GET clustered seeds (Garden feed). */
export interface ClusteredSeedsResponse {
  clusters: Array<{
    id: string
    label: string
    confidence: number
    seeds: ClusteredSeed[]
  }>
}

/** Triage action: keep | merge | ignore */
export type TriageActionType = 'keep' | 'merge' | 'ignore'

/** Backward-compatible minimal seed from API. */
export interface SeedMinimal {
  id: string
  content: string
  type: string
  source_url?: string
  created_at: string
  title?: string
  tags?: string[]
  extracted_bullets?: string[]
  cluster_label?: string
  status?: string
}

export interface SeedCreateInput {
  content: string
  type?: 'link' | 'voice' | 'screenshot' | 'thought'
  source_url?: string
  title?: string
  tags?: string[]
}

export interface SeedListParams {
  page?: number
  perPage?: number
  sort?: 'created_at' | 'updated_at' | 'title'
  order?: 'asc' | 'desc'
  search?: string
  type?: string
  status?: string
  cluster?: string
}

export interface SeedListResponse {
  data: Seed[]
  total: number
  clusters?: { id: string; label: string; seed_ids: string[] }[]
}

export interface SeedMergeInput {
  seed_ids: string[]
  title?: string
  content?: string
}

export interface SeedMergeResult {
  id: string
  title: string
  content: string
  merged_from: string[]
}

/** Merge API response (seed + provenance). */
export interface MergeSeedsResponse {
  seed: Seed
  provenance: { merged_seed_id: string; source_seed_ids: string[]; created_at: string }
}

export interface AssetManager {
  id: string
  user_id: string
  title: string
  description?: string
  status: string
  created_at: string
  updated_at: string
}

export interface AssetManagerCreateInput {
  title: string
  description?: string
  status?: string
}

export interface AssetManagerUpdateInput {
  title?: string
  description?: string
  status?: string
}

export interface AssetManagerListResponse {
  data: AssetManager[]
  total: number
}

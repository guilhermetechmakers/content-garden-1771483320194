import { api } from '@/lib/api'
import type {
  AssetManager,
  AssetManagerCreateInput,
  AssetManagerUpdateInput,
  AssetManagerListResponse,
} from '@/types/asset-manager'

const BASE = '/asset-manager'

export const assetManagerService = {
  async list(params?: {
    page?: number
    perPage?: number
    status?: string
    search?: string
  }): Promise<AssetManagerListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page != null) searchParams.set('page', String(params.page))
    if (params?.perPage != null) searchParams.set('per_page', String(params.perPage))
    if (params?.status) searchParams.set('status', params.status)
    if (params?.search) searchParams.set('search', params.search)
    const q = searchParams.toString()
    return api.get<AssetManagerListResponse>(q ? `${BASE}?${q}` : BASE)
  },

  async getById(id: string): Promise<AssetManager> {
    return api.get<AssetManager>(`${BASE}/${id}`)
  },

  async create(input: AssetManagerCreateInput): Promise<AssetManager> {
    return api.post<AssetManager>(BASE, input)
  },

  async update(id: string, input: AssetManagerUpdateInput): Promise<AssetManager> {
    return api.patch<AssetManager>(`${BASE}/${id}`, input)
  },

  async delete(id: string): Promise<void> {
    return api.delete<void>(`${BASE}/${id}`)
  },
}

import { api } from '@/lib/api'

export interface SeedCreateInput {
  content: string
  type?: 'link' | 'voice' | 'screenshot' | 'thought'
  source_url?: string
}

export interface Seed {
  id: string
  content: string
  type: string
  source_url?: string
  created_at: string
}

export const seedService = {
  async create(input: SeedCreateInput): Promise<Seed> {
    return api.post<Seed>('/seeds', input)
  },
}

/**
 * Seed Capture & Storage feature service.
 * Business logic and API for seeds: create, list, triage (keep/ignore), merge, delete.
 * Server-side logic lives in Supabase Edge Functions; this layer calls them via api.
 */

import { seedService } from '@/services/seedService'
import type {
  Seed,
  SeedCreateInput,
  SeedListParams,
  SeedListResponse,
  SeedMergeInput,
  SeedMergeResult,
} from '@/types/seed'

export const seedCaptureStorageService = {
  create: (input: SeedCreateInput): Promise<Seed> => seedService.create(input),
  list: (params?: SeedListParams): Promise<SeedListResponse> =>
    seedService.list(params),
  getById: (id: string): Promise<Seed> => seedService.getById(id),
  merge: (input: SeedMergeInput): Promise<SeedMergeResult> =>
    seedService.merge(input),
  keep: (id: string): Promise<Seed> => seedService.keep(id),
  ignore: (id: string): Promise<Seed> => seedService.ignore(id),
  archive: (id: string): Promise<Seed> => seedService.archive(id),
  delete: (id: string): Promise<void> => seedService.delete(id),
  bulkDelete: (ids: string[]): Promise<void> => seedService.bulkDelete(ids),
  bulkArchive: (ids: string[]): Promise<void> => seedService.bulkArchive(ids),
}

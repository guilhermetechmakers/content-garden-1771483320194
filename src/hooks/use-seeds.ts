import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { seedService } from '@/services/seedService'
import type { Seed, SeedListParams, SeedMergeInput, ClusteredSeedsResponse, TriageActionType } from '@/types/seed'

const QUERY_KEY = ['seeds'] as const

export function useSeedList(params?: SeedListParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'list', params],
    queryFn: () => seedService.list(params),
  })
}

export interface ClusteredSeedsParams {
  search?: string
  status?: string
}

export function useClusteredSeeds(params?: ClusteredSeedsParams) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'clustered', params],
    queryFn: () => seedService.getClustered(params),
  })
}

export function useTriageSeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ seedId, action }: { seedId: string; action: TriageActionType }) =>
      seedService.triage(seedId, action),
    onMutate: async ({ seedId, action }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previousList = queryClient.getQueriesData<{ data: Seed[]; total: number }>({ queryKey: QUERY_KEY })
      const previousClustered = queryClient.getQueriesData<ClusteredSeedsResponse>({
        queryKey: [...QUERY_KEY, 'clustered'],
      })
      if (action === 'ignore') {
        queryClient.setQueriesData<{ data: Seed[]; total: number }>(
          { queryKey: QUERY_KEY },
          (old) =>
            old
              ? {
                  ...old,
                  data: old.data.map((s) => (s.id === seedId ? { ...s, status: 'ignored' as const } : s)),
                }
              : old
        )
        queryClient.setQueriesData<ClusteredSeedsResponse>(
          { queryKey: QUERY_KEY },
          (old) => {
            if (!old?.clusters) return old
            return {
              clusters: old.clusters.map((c) => ({
                ...c,
                seeds: c.seeds.filter((s) => s.id !== seedId),
              })),
            }
          }
        )
      }
      return { previousList, previousClustered }
    },
    onSuccess: (_data, { action }) => {
      if (action === 'keep') toast.success('Seed kept')
      if (action === 'ignore') toast.success('Seed ignored')
    },
    onError: (err: { message?: string }, _vars, context) => {
      if (context?.previousList) {
        queryClient.setQueriesData({ queryKey: QUERY_KEY }, context.previousList)
      }
      if (context?.previousClustered) {
        queryClient.setQueriesData({ queryKey: QUERY_KEY }, context.previousClustered)
      }
      toast.error(err?.message ?? 'Triage failed')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useSeed(id: string | undefined | null) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => seedService.getById(id!),
    enabled: !!id,
  })
}

export function useMergeSeeds() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: SeedMergeInput) => seedService.merge(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Seeds merged')
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? 'Failed to merge seeds')
    },
  })
}

export function useKeepSeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => seedService.keep(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueriesData({ queryKey: QUERY_KEY })
      queryClient.setQueriesData<{ data: Seed[]; total: number }>(
        { queryKey: QUERY_KEY },
        (old) =>
          old
            ? {
                ...old,
                data: old.data.map((s) =>
                  s.id === id ? { ...s, status: 'kept' as const } : s
                ),
              }
            : old
      )
      return { previous }
    },
    onSuccess: () => {
      toast.success('Seed kept')
    },
    onError: (err: { message?: string }, _id, context) => {
      if (context?.previous) {
        queryClient.setQueriesData({ queryKey: QUERY_KEY }, context.previous)
      }
      toast.error(err?.message ?? 'Failed to keep seed')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useIgnoreSeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => seedService.ignore(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueriesData({ queryKey: QUERY_KEY })
      queryClient.setQueriesData<{ data: Seed[]; total: number }>(
        { queryKey: QUERY_KEY },
        (old) =>
          old
            ? {
                ...old,
                data: old.data.map((s) =>
                  s.id === id ? { ...s, status: 'ignored' as const } : s
                ),
              }
            : old
      )
      return { previous }
    },
    onSuccess: () => {
      toast.success('Seed ignored')
    },
    onError: (err: { message?: string }, _id, context) => {
      if (context?.previous) {
        queryClient.setQueriesData({ queryKey: QUERY_KEY }, context.previous)
      }
      toast.error(err?.message ?? 'Failed to ignore seed')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useArchiveSeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => seedService.archive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Seed archived')
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? 'Failed to archive seed')
    },
  })
}

export function useDeleteSeed() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => seedService.delete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueriesData({ queryKey: QUERY_KEY })
      queryClient.setQueriesData<{ data: Seed[]; total: number }>(
        { queryKey: QUERY_KEY },
        (old) =>
          old
            ? {
                data: old.data.filter((s) => s.id !== id),
                total: Math.max(0, old.total - 1),
              }
            : old
      )
      return { previous }
    },
    onError: (err: { message?: string }, _id, context) => {
      if (context?.previous) {
        queryClient.setQueriesData({ queryKey: QUERY_KEY }, context.previous)
      }
      toast.error(err?.message ?? 'Failed to delete seed')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useBulkDeleteSeeds() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => seedService.bulkDelete(ids),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY })
      const previous = queryClient.getQueriesData({ queryKey: QUERY_KEY })
      const set = new Set(ids)
      queryClient.setQueriesData<{ data: Seed[]; total: number }>(
        { queryKey: QUERY_KEY },
        (old) =>
          old
            ? {
                data: old.data.filter((s) => !set.has(s.id)),
                total: Math.max(0, old.total - ids.length),
              }
            : old
      )
      return { previous, ids }
    },
    onSuccess: (_data, ids) => {
      toast.success(`${ids.length} seed(s) deleted`)
    },
    onError: (err: { message?: string }, _ids, context) => {
      if (context?.previous) {
        queryClient.setQueriesData({ queryKey: QUERY_KEY }, context.previous)
      }
      toast.error(err?.message ?? 'Failed to delete seeds')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
    },
  })
}

export function useBulkArchiveSeeds() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => seedService.bulkArchive(ids),
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success(`${ids.length} seed(s) archived`)
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? 'Failed to archive seeds')
    },
  })
}

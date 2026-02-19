import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { assetManagerService } from '@/services/asset-managerService'
import type { AssetManagerCreateInput, AssetManagerUpdateInput } from '@/types/asset-manager'

const QUERY_KEY = ['asset-manager'] as const

export function useAssetManagerList(params?: {
  page?: number
  perPage?: number
  status?: string
  search?: string
}) {
  return useQuery({
    queryKey: [...QUERY_KEY, 'list', params],
    queryFn: () => assetManagerService.list(params),
  })
}

export function useAssetManager(id: string | undefined | null) {
  return useQuery({
    queryKey: [...QUERY_KEY, id],
    queryFn: () => assetManagerService.getById(id!),
    enabled: !!id,
  })
}

export function useCreateAssetManager() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: AssetManagerCreateInput) => assetManagerService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Asset created')
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? 'Failed to create asset')
    },
  })
}

export function useUpdateAssetManager() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: AssetManagerUpdateInput }) =>
      assetManagerService.update(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEY, id] })
      toast.success('Asset updated')
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? 'Failed to update asset')
    },
  })
}

export function useDeleteAssetManager() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => assetManagerService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success('Asset deleted')
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? 'Failed to delete asset')
    },
  })
}

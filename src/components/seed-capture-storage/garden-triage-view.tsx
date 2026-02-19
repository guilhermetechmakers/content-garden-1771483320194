import { useState, useCallback, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Flower2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SeedCard } from '@/components/garden/seed-card'
import { MergeModal } from '@/components/garden/merge-modal'
import { BulkToolbar } from '@/components/garden/bulk-toolbar'
import {
  FilterSortBar,
  type SortField,
  type SortOrder,
} from '@/components/garden/filter-sort-bar'
import {
  useClusteredSeeds,
  useSeedList,
  useTriageSeed,
  useMergeSeeds,
  useBulkDeleteSeeds,
  useBulkArchiveSeeds,
} from '@/hooks/use-seeds'
import { toast } from 'sonner'
import type { Seed, ClusteredSeed } from '@/types/seed'

const PER_PAGE = 50
const DEFAULT_SORT: SortField = 'created_at'
const DEFAULT_ORDER: SortOrder = 'desc'

/** Fallback: group flat list by cluster_label when server doesn't return clusters. */
function clusterSeedsFallback(seeds: Seed[]): Array<{ id: string; label: string; confidence: number; seeds: ClusteredSeed[] }> {
  const byLabel = new Map<string, ClusteredSeed[]>()
  for (const s of seeds) {
    const label = s.cluster_label ?? 'Uncategorized'
    if (!byLabel.has(label)) byLabel.set(label, [])
    byLabel.get(label)!.push({
      ...s,
      cluster_id: `fallback-${label}`,
      cluster_label: label,
      cluster_confidence: 0.5,
    })
  }
  const entries = Array.from(byLabel.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  return entries.map(([label, clusterSeeds]) => ({
    id: `fallback-${label}`,
    label,
    confidence: 0.5,
    seeds: clusterSeeds,
  }))
}

export function GardenTriageView() {
  const [search, setSearch] = useState('')
  const [sortField, setSortField] = useState<SortField>(DEFAULT_SORT)
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_ORDER)
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [triageMode, setTriageMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [mergeModalOpen, setMergeModalOpen] = useState(false)
  const [mergeFromCardId, setMergeFromCardId] = useState<string | null>(null)
  const [, setUndoDeleteIds] = useState<string[] | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([])

  const listParams = useMemo(
    () => ({
      perPage: PER_PAGE,
      sort: sortField,
      order: sortOrder,
      search: search || undefined,
      type: typeFilter || undefined,
      status: statusFilter || undefined,
    }),
    [search, sortField, sortOrder, typeFilter, statusFilter]
  )

  const clusteredParams = useMemo(
    () => ({ search: search || undefined, status: statusFilter || undefined }),
    [search, statusFilter]
  )

  const { data: clusteredData, isLoading: clusteredLoading, isError: clusteredError, error: clusteredErr } = useClusteredSeeds(clusteredParams)
  const { data: listData, isLoading: listLoading } = useSeedList(listParams)
  const triageMutation = useTriageSeed()
  const mergeMutation = useMergeSeeds()
  const bulkDeleteMutation = useBulkDeleteSeeds()
  const bulkArchiveMutation = useBulkArchiveSeeds()

  const clusters = useMemo(() => {
    const fromClustered = clusteredData?.clusters ?? []
    if (fromClustered.length > 0) return fromClustered
    const listSeeds = listData?.data ?? []
    if (listSeeds.length > 0) return clusterSeedsFallback(listSeeds)
    return []
  }, [clusteredData?.clusters, listData?.data])

  const seeds = useMemo(() => clusters.flatMap((c) => c.seeds), [clusters])
  const isLoading = clusteredLoading || listLoading
  const isError = clusteredError
  const error = clusteredErr
  const selectedSeeds = useMemo(
    () => seeds.filter((s) => selectedIds.has(s.id)),
    [seeds, selectedIds]
  )

  const handleSortChange = useCallback((field: SortField, order: SortOrder) => {
    setSortField(field)
    setSortOrder(order)
  }, [])

  const handleSelect = useCallback((id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (selected) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === seeds.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(seeds.map((s) => s.id)))
    }
  }, [seeds, selectedIds.size])

  const handleMergeFromToolbar = useCallback(() => {
    setMergeFromCardId(null)
    setMergeModalOpen(true)
  }, [])

  const handleMergeFromCard = useCallback((id: string) => {
    setMergeFromCardId(id)
    setSelectedIds((prev) => (prev.has(id) ? prev : new Set([...prev, id])))
    setMergeModalOpen(true)
  }, [])

  const handleMergeConfirm = useCallback(
    (seedIds: string[]) => {
      if (seedIds.length < 2) return
      mergeMutation.mutate(
        { seed_ids: seedIds },
        {
          onSuccess: (result) => {
            setMergeModalOpen(false)
            setSelectedIds(new Set())
            setMergeFromCardId(null)
            if (result?.merged_from?.length) {
              toast.success('Seeds merged', {
                description: `Provenance: ${result.merged_from.length} seed(s) merged.`,
              })
            }
          },
        }
      )
    },
    [mergeMutation]
  )

  const handleBulkArchive = useCallback(() => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    bulkArchiveMutation.mutate(ids, {
      onSuccess: () => setSelectedIds(new Set()),
    })
  }, [selectedIds, bulkArchiveMutation])

  const handleBulkDeleteClick = useCallback(() => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    setPendingDeleteIds(ids)
    setDeleteConfirmOpen(true)
  }, [selectedIds])

  const handleBulkDeleteConfirm = useCallback(() => {
    if (pendingDeleteIds.length === 0) return
    bulkDeleteMutation.mutate(pendingDeleteIds, {
      onSuccess: () => {
        setSelectedIds(new Set())
        setUndoDeleteIds(pendingDeleteIds)
        setDeleteConfirmOpen(false)
        setPendingDeleteIds([])
        toast.success(`${pendingDeleteIds.length} seed(s) deleted`, {
          action: {
            label: 'Undo',
            onClick: () => {
              setUndoDeleteIds(null)
              toast.info(
                'Undo not implemented for bulk delete; refresh to restore from server if supported.'
              )
            },
          },
        })
      },
    })
  }, [pendingDeleteIds, bulkDeleteMutation])

  const handleExport = useCallback(() => {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    const toExport = seeds.filter((s) => ids.includes(s.id))
    const blob = new Blob([JSON.stringify(toExport, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `seeds-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Export downloaded')
  }, [selectedIds, seeds])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedIds(new Set())
        setMergeModalOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const mergeModalSeeds =
    mergeFromCardId
      ? selectedSeeds.length > 0
        ? selectedSeeds
        : seeds.filter((s) => s.id === mergeFromCardId)
      : selectedSeeds

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Garden
          </h1>
          <p className="text-muted-foreground">
            Curate and triage seeds. Keep, merge, or ignore; use bulk actions
            when multiple are selected.
          </p>
        </div>
        <Button
          variant={triageMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTriageMode((v) => !v)}
          className="transition-transform hover:scale-[1.02]"
          aria-pressed={triageMode}
        >
          Triage mode
        </Button>
      </div>

      <FilterSortBar
        search={search}
        onSearchChange={setSearch}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        placeholder="Search seeds…"
      />

      <BulkToolbar
        selectedCount={selectedIds.size}
        onMerge={handleMergeFromToolbar}
        onArchive={handleBulkArchive}
        onDelete={handleBulkDeleteClick}
        onExport={handleExport}
        onClearSelection={() => setSelectedIds(new Set())}
        isMergePending={mergeMutation.isPending}
        isArchivePending={bulkArchiveMutation.isPending}
        isDeletePending={bulkDeleteMutation.isPending}
      />

      {seeds.length > 0 && (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="text-muted-foreground"
          >
            {selectedIds.size === seeds.length
              ? 'Deselect all'
              : 'Select all'}
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
                <div className="mt-2 flex gap-1">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Skeleton className="h-9 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="border-dashed border-destructive/50">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">
              {(error as { message?: string })?.message ??
                'Failed to load seeds.'}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : clusters.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Flower2
              className="h-12 w-12 text-muted-foreground"
              aria-hidden
            />
            <p className="mt-4 font-medium text-foreground">No seeds yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use Quick Capture on Home to add your first seed, then triage them
              here.
            </p>
            <Button className="mt-6" asChild>
              <Link to="/">Go to Home</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {clusters.map(({ id, label, confidence, seeds: clusterSeeds }) => (
            <section
              key={id}
              aria-labelledby={`cluster-${id}`}
              className="animate-fade-in-up"
            >
              <div className="mb-3 flex items-center gap-2">
                <h2
                  id={`cluster-${id}`}
                  className="text-sm font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {label}
                </h2>
                {confidence !== undefined && confidence > 0 && (
                  <span
                    className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                    title="Cluster confidence"
                  >
                    {Math.round(confidence * 100)}%
                  </span>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {clusterSeeds.map((seed, index) => (
                  <SeedCard
                    key={seed.id}
                    seed={seed}
                    triageMode={triageMode}
                    selected={selectedIds.has(seed.id)}
                    onKeep={(id) => triageMutation.mutate({ seedId: id, action: 'keep' })}
                    onIgnore={(id) => triageMutation.mutate({ seedId: id, action: 'ignore' })}
                    onMerge={(id) => handleMergeFromCard(id)}
                    onSelect={handleSelect}
                    isKeepPending={triageMutation.isPending}
                    isIgnorePending={triageMutation.isPending}
                    data-index={index}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <MergeModal
        open={mergeModalOpen}
        onOpenChange={setMergeModalOpen}
        seeds={mergeModalSeeds}
        onConfirm={handleMergeConfirm}
        isPending={mergeMutation.isPending}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete seeds?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {pendingDeleteIds.length} seed
              {pendingDeleteIds.length !== 1 ? 's' : ''}. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Image,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  useAssetManagerList,
  useCreateAssetManager,
  useUpdateAssetManager,
  useDeleteAssetManager,
} from '@/hooks/use-asset-manager'
import {
  AssetManagerForm,
  getFormValuesFromAsset,
  type AssetManagerFormValues,
} from '@/components/asset-manager/asset-manager-form'
import type { AssetManager } from '@/types/asset-manager'

const PER_PAGE = 10

export function AssetManagerList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [createOpen, setCreateOpen] = useState(false)
  const [editAsset, setEditAsset] = useState<AssetManager | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading, isError, error } = useAssetManagerList({
    page,
    perPage: PER_PAGE,
    search: search || undefined,
    status: statusFilter || undefined,
  })

  const createMutation = useCreateAssetManager()
  const updateMutation = useUpdateAssetManager()
  const deleteMutation = useDeleteAssetManager()

  const handleCreate = (values: AssetManagerFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => setCreateOpen(false),
    })
  }

  const handleUpdate = (values: AssetManagerFormValues) => {
    if (!editAsset) return
    updateMutation.mutate(
      { id: editAsset.id, input: values },
      { onSuccess: () => setEditAsset(null) }
    )
  }

  const handleDeleteConfirm = () => {
    if (!deleteId) return
    deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) })
  }

  const total = data?.total ?? 0
  const items = data?.data ?? []
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Asset Manager
          </h1>
          <p className="text-muted-foreground">
            Manage images, videos, and attachments linked to Seeds and Canvases.
          </p>
        </div>
        <Button
          className="glow-primary transition-transform hover:scale-[1.02]"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Asset
        </Button>
      </div>

      <Card className="border-[rgb(var(--border))]">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search assets…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9"
                aria-label="Search assets"
              />
            </div>
            <Input
              placeholder="Status filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="sm:w-40"
              aria-label="Filter by status"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-[rgb(var(--border))] bg-muted/30 p-12">
              <p className="text-center text-muted-foreground">
                {(error as { message?: string })?.message ?? 'Failed to load assets.'}
              </p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-[rgb(var(--border))] py-16">
              <Image className="h-12 w-12 text-muted-foreground" aria-hidden />
              <div className="text-center">
                <p className="font-medium text-foreground">No assets yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Upload images, videos, or attachments to link to Seeds and Canvases.
                </p>
              </div>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add first asset
              </Button>
            </div>
          ) : (
            <>
              <ScrollArea className="w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((asset) => (
                      <TableRow
                        key={asset.id}
                        className="transition-colors hover:bg-muted/50"
                      >
                        <TableCell>
                          <Link
                            to={`/asset-manager/${asset.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {asset.title}
                          </Link>
                        </TableCell>
                        <TableCell className="hidden max-w-[200px] truncate md:table-cell">
                          {asset.description ?? '—'}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              'inline-block rounded-full px-2 py-0.5 text-xs',
                              asset.status === 'active'
                                ? 'bg-primary/20 text-primary'
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {asset.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                aria-label="Open menu"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/asset-manager/${asset.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setEditAsset(asset)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteId(asset.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-[rgb(var(--border))] px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages} · {total} total
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AssetManagerForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
        title="New asset"
        description="Add an asset to link to Seeds or Canvases."
      />

      {editAsset && (
        <AssetManagerForm
          open={!!editAsset}
          onOpenChange={(open) => !open && setEditAsset(null)}
          defaultValues={getFormValuesFromAsset(editAsset)}
          onSubmit={handleUpdate}
          isLoading={updateMutation.isPending}
          title="Edit asset"
          description="Update asset details."
        />
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete asset?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The asset will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

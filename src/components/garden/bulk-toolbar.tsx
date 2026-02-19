import { Merge, Archive, Trash2, Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface BulkToolbarProps {
  selectedCount: number
  onMerge: () => void
  onArchive: () => void
  onDelete: () => void
  onExport: () => void
  onClearSelection: () => void
  isMergePending?: boolean
  isArchivePending?: boolean
  isDeletePending?: boolean
  className?: string
}

export function BulkToolbar({
  selectedCount,
  onMerge,
  onArchive,
  onDelete,
  onExport,
  onClearSelection,
  isMergePending = false,
  isArchivePending = false,
  isDeletePending = false,
  className,
}: BulkToolbarProps) {
  if (selectedCount === 0) return null

  const busy = isMergePending || isArchivePending || isDeletePending

  return (
    <div
      role="toolbar"
      aria-label="Bulk actions"
      className={cn(
        'sticky top-0 z-10 flex flex-wrap items-center gap-2 rounded-xl border border-[rgb(var(--border))] bg-card px-4 py-3 shadow-card animate-fade-in',
        className
      )}
    >
      <span className="text-sm font-medium text-foreground">
        {selectedCount} selected
      </span>
      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onMerge}
          disabled={selectedCount < 2 || busy}
          className="transition-transform hover:scale-[1.02]"
          aria-label="Merge selected seeds"
        >
          <Merge className="mr-1.5 h-4 w-4" />
          Merge
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onArchive}
          disabled={busy}
          className="transition-transform hover:scale-[1.02]"
          aria-label="Archive selected seeds"
        >
          <Archive className="mr-1.5 h-4 w-4" />
          Archive
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          disabled={busy}
          className="transition-transform hover:scale-[1.02]"
          aria-label="Export selected seeds"
        >
          <Download className="mr-1.5 h-4 w-4" />
          Export
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onDelete}
          disabled={busy}
          className="text-destructive transition-transform hover:scale-[1.02] hover:bg-destructive/10 hover:text-destructive"
          aria-label="Delete selected seeds"
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Delete
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        disabled={busy}
        className="ml-auto"
        aria-label="Clear selection"
      >
        <X className="mr-1 h-4 w-4" />
        Clear
      </Button>
    </div>
  )
}

import { Search, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export type SortField = 'created_at' | 'updated_at' | 'title'
export type SortOrder = 'asc' | 'desc'

export interface FilterSortBarProps {
  search: string
  onSearchChange: (value: string) => void
  sortField: SortField
  sortOrder: SortOrder
  onSortChange: (field: SortField, order: SortOrder) => void
  typeFilter?: string
  onTypeFilterChange?: (value: string) => void
  statusFilter?: string
  onStatusFilterChange?: (value: string) => void
  placeholder?: string
  className?: string
}

const sortLabels: Record<SortField, string> = {
  created_at: 'Date created',
  updated_at: 'Last updated',
  title: 'Title',
}

export function FilterSortBar({
  search,
  onSearchChange,
  sortField,
  sortOrder,
  onSortChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
  placeholder = "Describe what you're looking for…",
  className,
}: FilterSortBarProps) {
  const hasFilters = typeFilter || statusFilter

  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row', className)}>
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          type="search"
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search seeds"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label="Filter and sort"
            className={cn(hasFilters && 'border-primary/50')}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <span className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Sort by
          </span>
          {(['created_at', 'updated_at', 'title'] as const).map((field) => (
            <DropdownMenuItem
              key={field}
              onClick={() =>
                onSortChange(
                  field,
                  sortField === field && sortOrder === 'asc' ? 'desc' : 'asc'
                )
              }
            >
              {sortLabels[field]}
              {sortField === field ? (
                sortOrder === 'asc' ? (
                  <ArrowUp className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowDown className="ml-2 h-4 w-4" />
                )
              ) : (
                <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
              )}
            </DropdownMenuItem>
          ))}
          {onTypeFilterChange && (
            <>
              <span className="mt-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Type
              </span>
              {['', 'thought', 'link', 'voice', 'screenshot'].map((t) => (
                <DropdownMenuItem
                  key={t || 'all'}
                  onClick={() => onTypeFilterChange(t)}
                >
                  {t || 'All types'}
                  {typeFilter === t && ' ✓'}
                </DropdownMenuItem>
              ))}
            </>
          )}
          {onStatusFilterChange && (
            <>
              <span className="mt-2 px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Status
              </span>
              {['', 'active', 'kept', 'ignored', 'archived'].map((s) => (
                <DropdownMenuItem
                  key={s || 'all'}
                  onClick={() => onStatusFilterChange(s)}
                >
                  {s || 'All statuses'}
                  {statusFilter === s && ' ✓'}
                </DropdownMenuItem>
              ))}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

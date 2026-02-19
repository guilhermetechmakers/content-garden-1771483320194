import { Link } from 'react-router-dom'
import {
  ThumbsUp,
  ThumbsDown,
  Merge,
  ExternalLink,
  Link as LinkIcon,
  Mic,
  Image,
  MessageSquare,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Seed } from '@/types/seed'

const typeIcons = {
  link: LinkIcon,
  voice: Mic,
  screenshot: Image,
  thought: MessageSquare,
}

function formatRelativeTime(created_at: string): string {
  try {
    const d = new Date(created_at)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffM = Math.floor(diffMs / 60000)
    const diffH = Math.floor(diffMs / 3600000)
    const diffD = Math.floor(diffMs / 86400000)
    if (diffM < 60) return `${diffM}m ago`
    if (diffH < 24) return `${diffH}h ago`
    if (diffD < 7) return `${diffD}d ago`
    return d.toLocaleDateString()
  } catch {
    return ''
  }
}

export interface SeedCardProps {
  seed: Seed
  triageMode?: boolean
  selected?: boolean
  onKeep?: (id: string) => void
  onIgnore?: (id: string) => void
  onMerge?: (id: string) => void
  onSelect?: (id: string, selected: boolean) => void
  onOpen?: (id: string) => void
  isKeepPending?: boolean
  isIgnorePending?: boolean
  'data-index'?: number
}

export function SeedCard({
  seed,
  triageMode = false,
  selected = false,
  onKeep,
  onIgnore,
  onMerge,
  onSelect,
  onOpen,
  isKeepPending = false,
  isIgnorePending = false,
  'data-index': dataIndex,
}: SeedCardProps) {
  const TypeIcon = typeIcons[seed.type] ?? MessageSquare
  const snippet =
    seed.extracted_bullets?.length > 0
      ? seed.extracted_bullets[0]
      : seed.content.slice(0, 120)
  const tags = seed.tags?.length ? seed.tags : [seed.type]

  return (
    <Card
      role="article"
      aria-label={seed.title}
      data-index={dataIndex}
      className={cn(
        'group transition-all duration-200 hover:shadow-card-hover',
        selected && 'ring-2 ring-primary shadow-card-hover'
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-2">
            {onSelect && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  onSelect(seed.id, !selected)
                }}
                className={cn(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors',
                  selected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-[rgb(var(--border))] bg-card hover:bg-muted'
                )}
                aria-label={selected ? 'Deselect seed' : 'Select seed'}
                aria-pressed={selected}
              >
                {selected && (
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            )}
            <div className="min-w-0 flex-1">
              <CardTitle className="line-clamp-1 text-base">{seed.title}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2 text-xs">
                {snippet}
              </CardDescription>
            </div>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(seed.created_at)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <TypeIcon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2 pt-0">
        {triageMode ? (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              title="Keep"
              aria-label="Keep seed"
              onClick={() => onKeep?.(seed.id)}
              disabled={isKeepPending}
              className="transition-transform hover:scale-105"
            >
              <ThumbsUp className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              title="Merge"
              aria-label="Merge seed"
              onClick={() => onMerge?.(seed.id)}
              className="transition-transform hover:scale-105"
            >
              <Merge className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              title="Ignore"
              aria-label="Ignore seed"
              onClick={() => onIgnore?.(seed.id)}
              disabled={isIgnorePending}
              className="transition-transform hover:scale-105"
            >
              <ThumbsDown className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="transition-transform hover:scale-[1.02]"
            >
              <Link to={`/garden?seed=${seed.id}`} onClick={() => onOpen?.(seed.id)}>
                Open
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

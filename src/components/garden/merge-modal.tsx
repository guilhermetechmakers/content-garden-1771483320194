import { useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Seed } from '@/types/seed'

export interface MergeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  seeds: Seed[]
  onConfirm: (seedIds: string[]) => void
  isPending?: boolean
}

export function MergeModal({
  open,
  onOpenChange,
  seeds,
  onConfirm,
  isPending = false,
}: MergeModalProps) {
  const ids = useMemo(() => seeds.map((s) => s.id), [seeds])
  const combined = useMemo(() => {
    const titles = seeds.map((s) => s.title).filter(Boolean)
    const contents = seeds.map((s) => s.content).filter(Boolean)
    const tags = Array.from(
      new Set(seeds.flatMap((s) => s.tags ?? []))
    )
    const bullets = Array.from(
      new Set(seeds.flatMap((s) => s.extracted_bullets ?? []))
    )
    const sources = seeds
      .map((s) => s.source_url)
      .filter((u): u is string => !!u)
    return {
      title: titles[0] ?? 'Merged seed',
      contentPreview: contents.join('\n\n').slice(0, 300) + (contents.join('').length > 300 ? '…' : ''),
      tags,
      bullets,
      sources,
      count: seeds.length,
    }
  }, [seeds])

  const handleConfirm = () => {
    onConfirm(ids)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] max-w-lg"
        showClose={true}
        aria-describedby="merge-preview"
      >
        <DialogHeader>
          <DialogTitle>Merge seeds</DialogTitle>
          <DialogDescription id="merge-preview">
            Preview combined metadata and provenance. The new seed will keep references to the {seeds.length} original seeds.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[50vh] rounded-lg border border-[rgb(var(--border))] p-4">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Title</p>
              <p className="mt-1 text-sm font-medium">{combined.title}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Content preview</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                {combined.contentPreview}
              </p>
            </div>
            {combined.tags.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Tags</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {combined.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-muted px-1.5 py-0.5 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {combined.bullets.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Extracted bullets</p>
                <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                  {combined.bullets.slice(0, 8).map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                  {combined.bullets.length > 8 && (
                    <li className="text-xs">+{combined.bullets.length - 8} more</li>
                  )}
                </ul>
              </div>
            )}
            {combined.sources.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">Provenance (sources)</p>
                <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                  {combined.sources.map((url, i) => (
                    <li key={i} className="truncate">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="border-t border-[rgb(var(--border))] pt-2 text-xs text-muted-foreground">
              Merging {combined.count} seed{combined.count !== 1 ? 's' : ''}.
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending || ids.length < 2}
            className="transition-transform hover:scale-[1.02]"
          >
            {isPending ? 'Merging…' : 'Merge'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

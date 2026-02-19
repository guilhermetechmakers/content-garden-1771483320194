import { useParams } from 'react-router-dom'
import { PanelLeft, PanelRight, Sparkles, Save, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function CanvasWorkspace() {
  const { canvasId } = useParams<{ canvasId: string }>()
  const leftOpen = true
  const rightOpen = true

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 animate-fade-in">
      {/* Left: Seeds panel */}
      {leftOpen && (
        <aside
          className={cn(
            'w-64 shrink-0 overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-card transition-all'
          )}
        >
          <div className="flex h-10 items-center border-b border-[rgb(var(--border))] px-3">
            <PanelLeft className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search seeds…"
              className="h-8 border-0 bg-transparent text-sm focus-visible:ring-0"
            />
          </div>
          <ScrollArea className="h-[calc(100%-2.5rem)]">
            <div className="space-y-2 p-2">
              {['Seed A', 'Seed B', 'Seed C'].map((label, i) => (
                <Card
                  key={i}
                  className="cursor-grab rounded-lg p-3 text-sm transition-all hover:border-primary/50"
                >
                  {label}
                </Card>
              ))}
            </div>
            <p className="p-2 text-xs text-muted-foreground">Propose related</p>
          </ScrollArea>
        </aside>
      )}

      {/* Center: Canvas */}
      <section className="relative flex-1 overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--panel))]">
        <div className="absolute right-4 top-4 flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="mr-1 h-4 w-4" />
            Autosaved
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        </div>
        <div
          className="h-full w-full"
          style={{
            backgroundImage: 'radial-gradient(rgb(var(--border)) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          <div className="p-8">
            <Card className="inline-block max-w-md cursor-move rounded-xl p-4 shadow-card">
              <p className="text-sm font-medium">Canvas: {canvasId}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Drag seeds from the left. Use AI panel for Draft angles, Hooks, Summarize.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Right: AI panel */}
      {rightOpen && (
        <aside className="w-72 shrink-0 space-y-2 overflow-hidden rounded-xl border border-[rgb(var(--border))] bg-card">
          <div className="flex h-10 items-center border-b border-[rgb(var(--border))] px-3">
            <PanelRight className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">AI</span>
          </div>
          <div className="space-y-2 p-3">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Draft 5 angles
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Generate hooks
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Turn selection into thread
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Summarize selected Seeds
            </Button>
          </div>
          <p className="px-3 text-xs text-muted-foreground">
            Tone & length controls for AI outputs. Provenance shown on all results.
          </p>
        </aside>
      )}
    </div>
  )
}

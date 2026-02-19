import { useState } from 'react'
import { Search, Filter, Merge, ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const mockClusters: Array<{
  id: string
  label: string
  seeds: Array<{ id: string; title: string; snippet: string; type: string; tags: string[]; bullets: string[]; createdAt: string }>
}> = [
  { id: '1', label: 'Product & launch', seeds: [
    { id: 's1', title: 'Launch angles', snippet: 'Five angles…', type: 'thought', tags: ['launch'], bullets: ['Angle 1', 'Angle 2'], createdAt: '2h ago' },
    { id: 's2', title: 'Competitor review', snippet: 'Key takeaways…', type: 'link', tags: ['competitors'], bullets: [], createdAt: '5h ago' },
  ]},
  { id: '2', label: 'Building in public', seeds: [
    { id: 's3', title: 'Weekly update idea', snippet: 'Progress notes…', type: 'thought', tags: ['update'], bullets: [], createdAt: '1d ago' },
  ]},
]

export function Garden() {
  const [search, setSearch] = useState('')
  const [triageMode, setTriageMode] = useState(false)
  const [, setMergeOpen] = useState(false)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Garden</h1>
          <p className="text-muted-foreground">Seeds with soft-clustered view and triage.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={triageMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTriageMode((v) => !v)}
          >
            Triage mode
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Describe what you're looking for…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {mockClusters.map((cluster) => (
        <section key={cluster.id}>
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            {cluster.label}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cluster.seeds.map((seed) => (
              <Card
                key={seed.id}
                className="group transition-all hover:shadow-card-hover"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-1 text-base">{seed.title}</CardTitle>
                    <span className="text-xs text-muted-foreground">{seed.createdAt}</span>
                  </div>
                  <CardDescription className="line-clamp-2 text-xs">
                    {seed.snippet}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1">
                    {seed.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-muted px-1.5 py-0.5 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-2 pt-0">
                  {triageMode ? (
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon-sm" title="Keep">
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon-sm" title="Merge" onClick={() => setMergeOpen(true)}>
                        <Merge className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon-sm" title="Ignore">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm">
                      Open
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      ))}

      {mockClusters.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">No seeds yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Use Quick Capture on Home to add your first seed.
            </p>
            <Button className="mt-4" asChild>
              <a href="/">Go to Home</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

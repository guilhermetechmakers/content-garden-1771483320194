import { Link } from 'react-router-dom'
import { Plus, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const mockDrops = [
  { id: '1', title: 'Q1 Launch bundle', canvasSource: 'Q1 Launch narrative', postCount: 5, status: 'draft' as const },
  { id: '2', title: 'Weekly thoughts', canvasSource: 'Building in public thread', postCount: 3, status: 'ready' as const },
] as const

export function DropsList() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Drops</h1>
          <p className="text-muted-foreground">
            Create and manage 3–10 post bundles from a Canvas.
          </p>
        </div>
        <Button className="glow-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Drop
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockDrops.map((drop) => (
          <Link to={`/drops/${drop.id}`}>
            <Card
              key={drop.id}
              className="cursor-pointer transition-all hover:shadow-card-hover"
            >
              <CardHeader className="flex flex-row items-center gap-2">
                <Package className="h-8 w-8 shrink-0 text-accent" />
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{drop.title}</CardTitle>
                  <CardDescription>
                    {drop.postCount} posts · {drop.canvasSource}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                    drop.status === 'ready'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {drop.status}
                </span>
              </CardContent>
            </Card>
            </Link>
        ))}
      </div>
    </div>
  )
}

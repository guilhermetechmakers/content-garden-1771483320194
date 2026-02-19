import { Link } from 'react-router-dom'
import { Plus, Layout } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const mockCanvases: Array<{ id: string; title: string; updatedAt: string; nodeCount: number }> = [
  { id: '1', title: 'Q1 Launch narrative', updatedAt: '2h ago', nodeCount: 8 },
  { id: '2', title: 'Building in public thread', updatedAt: '1d ago', nodeCount: 5 },
]

export function CanvasesList() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Canvases</h1>
          <p className="text-muted-foreground">
            Visual workspace to compose narratives with Seeds and AI.
          </p>
        </div>
        <Button className="glow-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Canvas
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockCanvases.map((canvas) => (
          <Link to={`/canvases/${canvas.id}`}>
            <Card
              key={canvas.id}
              className="cursor-pointer transition-all hover:shadow-card-hover"
            >
              <CardHeader className="flex flex-row items-center gap-2">
                <Layout className="h-8 w-8 shrink-0 text-primary" />
                <div className="min-w-0">
                  <CardTitle className="truncate text-base">{canvas.title}</CardTitle>
                  <CardDescription>
                    {canvas.nodeCount} nodes · {canvas.updatedAt}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="text-sm text-primary">Open →</span>
              </CardContent>
            </Card>
            </Link>
        ))}
      </div>

      {mockCanvases.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Layout className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No canvases yet.</p>
            <Button className="mt-4">Create your first Canvas</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

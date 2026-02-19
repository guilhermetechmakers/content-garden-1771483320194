import { Plus, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const mockSnippets: Array<{ id: string; title: string; tags: string[]; usageCount: number }> = [
  { id: '1', title: 'CTA - Book a call', tags: ['cta'], usageCount: 12 },
  { id: '2', title: 'Hook - Question opener', tags: ['hook'], usageCount: 8 },
]

export function Snippets() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Snippets</h1>
          <p className="text-muted-foreground">
            Reusable hooks, CTAs, prompts, and frameworks.
          </p>
        </div>
        <Button className="glow-primary">
          <Plus className="mr-2 h-4 w-4" />
          Create Snippet
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search snippets…"
          className="max-w-sm border-[rgb(var(--border))]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockSnippets.map((snippet) => (
          <Card key={snippet.id} className="transition-all hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center gap-2">
              <FileText className="h-6 w-6 shrink-0 text-primary" />
              <div className="min-w-0">
                <CardTitle className="truncate text-base">{snippet.title}</CardTitle>
                <CardDescription>
                  Used {snippet.usageCount} times · {snippet.tags.join(', ')}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="outline" size="sm">
                Insert into Canvas / Drop
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockSnippets.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No snippets yet.</p>
            <Button className="mt-4">Create your first snippet</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

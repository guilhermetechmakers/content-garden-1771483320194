import { Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const examplePrompts = [
  'Find seeds about product launch',
  'Where did I mention building in public?',
  'Drops that use the hook framework',
]

export function DescribeToFind() {
  const [query, setQuery] = useState('')

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Describe-to-Find
        </h1>
        <p className="text-muted-foreground">
          Natural-language search across Seeds, Canvases, Drops, and media.
        </p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Describe what you're looking for…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 pl-12 text-base"
        />
      </div>

      <div>
        <p className="mb-2 text-sm text-muted-foreground">Example prompts</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((prompt) => (
            <Button
              key={prompt}
              variant="outline"
              size="sm"
              onClick={() => setQuery(prompt)}
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          Results (exact → contextual → related Drops)
        </h2>
        <div className="space-y-2">
          <Card className="transition-all hover:shadow-card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Result card with provenance</CardTitle>
              <CardDescription>Timecode / source link · Open in context</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}

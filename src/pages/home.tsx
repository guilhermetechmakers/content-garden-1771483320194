import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Link as LinkIcon,
  Mic,
  Image,
  MessageSquare,
  Layout,
  Package,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const quickActions = [
  { icon: LinkIcon, label: 'Paste link', to: '/garden' },
  { icon: Mic, label: 'Voice note', to: '/garden' },
  { icon: Image, label: 'Screenshot', to: '/garden' },
  { icon: MessageSquare, label: 'Quick thought', to: '/garden' },
] as const

const recentSeeds = [
  { id: '1', title: 'Product launch angles', snippet: 'Five angles for the launch post…', type: 'thought', tags: ['launch'] },
  { id: '2', title: 'Article: Building in public', snippet: 'Key takeaways from the piece…', type: 'link', tags: ['building'] },
] as const

export function Home() {
  const [captureValue, setCaptureValue] = useState('')

  return (
    <div className="space-y-8 animate-fade-in">
      <section>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Quick capture
        </h1>
        <p className="mt-1 text-muted-foreground">
          Capture seeds into your garden in one place.
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Input
              placeholder="Paste a link, type a thought, or describe what you're capturing…"
              value={captureValue}
              onChange={(e) => setCaptureValue(e.target.value)}
              className="h-12 rounded-xl border-[rgb(var(--border))] pr-24 focus-visible:ring-primary"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
              {quickActions.map(({ icon: Icon, label }) => (
                <Button
                  key={label}
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
          <Button size="lg" className="shrink-0">
            Capture
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {quickActions.map(({ icon: Icon, label, to }) => (
            <Button key={label} variant="outline" size="sm" asChild>
              <Link to={to}>
                <Icon className="mr-2 h-4 w-4" />
                {label}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Recent seeds</h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-4 pt-2">
            {recentSeeds.map((seed) => (
              <Card
                key={seed.id}
                className="w-72 shrink-0 cursor-pointer transition-all hover:shadow-card-hover"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 text-base">{seed.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">
                    {seed.snippet}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between pt-0">
                  <span className="text-xs text-muted-foreground">
                    {seed.tags.join(', ')}
                  </span>
                  <Button variant="ghost" size="icon-sm" asChild>
                    <Link to={`/garden?seed=${seed.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link to="/canvases">
          <Card className="transition-all hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" />
                  Continue Canvas
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
          </Card>
        </Link>
        <Link to="/drops">
          <Card className="transition-all hover:shadow-card-hover">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-accent" />
                  Prepare Drop
                </CardTitle>
                <CardDescription>Create a 3–10 post bundle</CardDescription>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
          </Card>
        </Link>
      </section>

      <Card className={cn('border-primary/20 bg-primary/5')}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-5 w-5 text-primary" />
            Ritual tip
          </CardTitle>
          <CardDescription>
            Try capturing one link and one quick thought today. Triage them in Garden, then open a Canvas and drag both in to draft angles.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}

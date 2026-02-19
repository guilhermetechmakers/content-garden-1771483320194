import { Link } from 'react-router-dom'
import { ArrowRight, Flower2, Layout, Package, Plane } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 animate-pulse" />
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Your content,{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              growing
            </span>
            .
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Capture seeds, curate in your garden, compose on canvases, and ship
            weekly drops. A creator-first workspace for your ritual flow.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="glow-primary" asChild>
              <Link to="/signup">
                Get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How it works - Bento-style */}
      <section className="border-t border-[rgb(var(--border))] px-6 py-24">
        <h2 className="text-center text-2xl font-bold md:text-3xl">
          Capture → Curate → Compose → Package → Runway
        </h2>
        <div className="mx-auto mt-12 grid max-w-5xl gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Flower2, title: 'Garden', desc: 'Soft-clustered seeds, triage & merge' },
            { icon: Layout, title: 'Canvases', desc: 'Visual narratives with AI' },
            { icon: Package, title: 'Drops', desc: '3–10 post bundles, ready to ship' },
            { icon: Plane, title: 'Runway', desc: 'Slot-based scheduling' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="rounded-xl border border-[rgb(var(--border))] bg-card p-6 shadow-card transition-all hover:shadow-card-hover"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <Icon className="h-10 w-10 text-primary" />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[rgb(var(--border))] px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <Button size="lg" className="glow-primary" asChild>
            <Link to="/signup">Start your Content Garden</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-[rgb(var(--border))] px-6 py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">Content Garden</span>
          <nav className="flex gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

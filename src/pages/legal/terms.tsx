import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function TermsOfService() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-16">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>
      <div className="prose prose-invert max-w-none space-y-4 text-foreground">
        <p>
          By using Content Garden you agree to these terms. You retain
          ownership of your content; we require a license to operate the
          service.
        </p>
        <p>
          We may update these terms; continued use constitutes acceptance.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link to="/">Back to app</Link>
      </Button>
    </div>
  )
}

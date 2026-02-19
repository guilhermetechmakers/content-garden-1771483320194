import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-16">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="text-muted-foreground">
        Last updated: {new Date().toLocaleDateString()}
      </p>
      <div className="prose prose-invert max-w-none space-y-4 text-foreground">
        <p>
          Content Garden (&quot;we&quot;) collects and uses your data to provide
          the service. We encrypt data at rest, use RBAC and workspace
          isolation, and support GDPR/CCPA export and deletion.
        </p>
        <p>
          We do not sell your personal information. For questions, contact
          support.
        </p>
      </div>
      <Button variant="outline" asChild>
        <Link to="/">Back to app</Link>
      </Button>
    </div>
  )
}

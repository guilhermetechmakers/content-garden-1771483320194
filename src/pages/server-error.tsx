import { Link } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ServerError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6">
      <AlertCircle className="h-16 w-16 text-destructive" />
      <h1 className="text-2xl font-bold">500</h1>
      <p className="text-center text-muted-foreground">
        Something went wrong. We&apos;ve been notified.
      </p>
      <Button asChild>
        <Link to="/">Go home</Link>
      </Button>
    </div>
  )
}

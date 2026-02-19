import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAssetManager } from '@/hooks/use-asset-manager'
import { cn } from '@/lib/utils'

export function AssetManagerDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: asset, isLoading, isError, error } = useAssetManager(id)

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError || !asset) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-[rgb(var(--border))] py-16">
        <p className="text-muted-foreground">
          {(error as { message?: string })?.message ?? 'Asset not found.'}
        </p>
        <Button variant="outline" asChild>
          <Link to="/asset-manager">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to list
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/asset-manager" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to assets
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link to={`/asset-manager/${asset.id}/edit`} className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-[rgb(var(--border))] transition-shadow hover:shadow-card-hover">
        <CardHeader className="border-b border-[rgb(var(--border))]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Image className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-xl">{asset.title}</CardTitle>
              <CardDescription>
                Created {new Date(asset.created_at).toLocaleDateString()} · Updated{' '}
                {new Date(asset.updated_at).toLocaleDateString()}
              </CardDescription>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-3 py-1 text-xs font-medium',
                asset.status === 'active'
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {asset.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {asset.description ? (
            <p className="text-muted-foreground whitespace-pre-wrap">{asset.description}</p>
          ) : (
            <p className="text-muted-foreground">No description.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

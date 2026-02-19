import { useParams, useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAssetManager, useUpdateAssetManager } from '@/hooks/use-asset-manager'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function AssetManagerEdit() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: asset, isLoading, isError } = useAssetManager(id)
  const updateMutation = useUpdateAssetManager()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: asset
      ? {
          title: asset.title,
          description: asset.description ?? '',
          status: asset.status,
        }
      : undefined,
  })

  const onSubmit = (values: FormValues) => {
    if (!id) return
    updateMutation.mutate(
      { id, input: values },
      { onSuccess: () => navigate(`/asset-manager/${id}`) }
    )
  }

  if (isLoading || !asset) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <p className="text-muted-foreground">Asset not found.</p>
        <Button variant="outline" asChild>
          <Link to="/asset-manager">Back to list</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" size="sm" asChild>
        <Link to={`/asset-manager/${id}`} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to asset
        </Link>
      </Button>

      <Card className="border-[rgb(var(--border))]">
        <CardHeader>
          <CardTitle>Edit asset</CardTitle>
          <CardDescription>
            Update asset details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Asset title"
                {...register('title')}
                className={errors.title ? 'border-destructive' : ''}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                placeholder="Brief description"
                {...register('description')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                placeholder="active"
                {...register('status')}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Saving…' : 'Save changes'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to={`/asset-manager/${id}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

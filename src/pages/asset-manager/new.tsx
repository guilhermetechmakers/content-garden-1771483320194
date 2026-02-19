import { useNavigate, Link } from 'react-router-dom'
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
import { useCreateAssetManager } from '@/hooks/use-asset-manager'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function AssetManagerNew() {
  const navigate = useNavigate()
  const createMutation = useCreateAssetManager()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', description: '', status: 'active' },
  })

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: (data) => navigate(`/asset-manager/${data.id}`),
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/asset-manager" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to assets
        </Link>
      </Button>

      <Card className="border-[rgb(var(--border))]">
        <CardHeader>
          <CardTitle>New asset</CardTitle>
          <CardDescription>
            Add an asset to link to Seeds or Canvases.
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
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating…' : 'Create asset'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/asset-manager">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

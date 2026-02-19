import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { AssetManager } from '@/types/asset-manager'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.string().optional(),
})

export type AssetManagerFormValues = z.infer<typeof schema>

interface AssetManagerFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<AssetManagerFormValues>
  onSubmit: (values: AssetManagerFormValues) => void
  isLoading?: boolean
  title: string
  description?: string
}

export function AssetManagerForm({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  isLoading = false,
  title: dialogTitle,
  description: dialogDescription,
}: AssetManagerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AssetManagerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? { title: '', description: '', status: 'active' },
  })

  useEffect(() => {
    if (open) {
      reset(defaultValues ?? { title: '', description: '', status: 'active' })
    }
  }, [open, defaultValues, reset])

  const handleOpenChange = (next: boolean) => {
    if (!next) reset()
    onOpenChange(next)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {dialogDescription && (
            <DialogDescription>{dialogDescription}</DialogDescription>
          )}
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="asset-title">Title</Label>
            <Input
              id="asset-title"
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
            <Label htmlFor="asset-description">Description (optional)</Label>
            <Input
              id="asset-description"
              placeholder="Brief description"
              {...register('description')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="asset-status">Status</Label>
            <Input
              id="asset-status"
              placeholder="active"
              {...register('status')}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function getFormValuesFromAsset(asset: AssetManager): AssetManagerFormValues {
  return {
    title: asset.title,
    description: asset.description ?? '',
    status: asset.status,
  }
}

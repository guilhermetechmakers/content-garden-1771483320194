import { Calendar, CheckCircle, Circle, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const mockSlots = [
  { id: '1', date: 'Today', time: '10:00', status: 'filled' as const, title: 'Launch post hook' },
  { id: '2', date: 'Tomorrow', time: '09:00', status: 'empty' as const, title: null },
  { id: '3', date: 'Feb 21', time: '14:00', status: 'posted' as const, title: 'Weekly update' },
] as const

export function Runway() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Runway</h1>
          <p className="text-muted-foreground">
            Slot-based timeline for the next 7 posts. Drag from Drops or Library.
          </p>
        </div>
        <Button variant="outline">Undo</Button>
      </div>

      <div className="flex gap-4">
        <section className="flex-1 space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">Next 7 posts</h2>
          <div className="space-y-2">
            {mockSlots.map((slot) => (
              <Card
                key={slot.id}
                className={cn(
                  'cursor-grab transition-all hover:shadow-card-hover',
                  slot.status === 'empty' && 'border-dashed'
                )}
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex flex-1 items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{slot.date}</span>
                      <span className="text-muted-foreground">{slot.time}</span>
                    </div>
                    {slot.status === 'empty' ? (
                      <span className="text-muted-foreground">Empty slot — drag a post here</span>
                    ) : (
                      <span className="font-medium">{slot.title}</span>
                    )}
                  </div>
                  {slot.status === 'posted' ? (
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                  ) : slot.status === 'filled' ? (
                    <Button size="sm">Mark Posted</Button>
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <aside className="w-80 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Slot detail</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Select a slot to preview copy, assets, and checklist.
            </CardContent>
          </Card>
          <Card className="mt-4 border-dashed">
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Empty slot suggest: drag a post from Drops or Library.
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

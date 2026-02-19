import { useParams } from 'react-router-dom'
import { Quote, ListOrdered, List, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const postFields = [
  { key: 'hook', label: 'Hook', icon: Quote },
  { key: 'value', label: 'Value', icon: ListOrdered },
  { key: 'example', label: 'Example', icon: List },
  { key: 'cta', label: 'CTA', icon: Megaphone },
] as const

export function DropEditor() {
  const { dropId } = useParams<{ dropId: string }>()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Drop editor
          </h1>
          <p className="text-muted-foreground">Drop ID: {dropId}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Auto-suggest mix</Button>
          <Button variant="outline">AI re-run</Button>
          <Button className="glow-primary">Export to Runway</Button>
        </div>
      </div>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="variants">Variants (LinkedIn, X, Video, Carousel)</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="mt-4">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base">Post {i}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {postFields.map(({ key, label, icon: Icon }) => (
                    <div key={key} className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {label}
                      </Label>
                      <Input
                        placeholder={`${label}…`}
                        className="border-[rgb(var(--border))]"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="variants" className="mt-4">
          <p className="text-muted-foreground">
            Platform variants: LinkedIn, X, Short Video Script, Carousel.
          </p>
        </TabsContent>
        <TabsContent value="assets" className="mt-4">
          <p className="text-muted-foreground">
            Attach images/videos with provenance.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

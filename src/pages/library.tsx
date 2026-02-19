import { Image, FileText, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const mockPublished = [
  { id: '1', title: 'Launch announcement', platform: 'LinkedIn', date: 'Feb 18', performance: '124 likes' },
] as const

export function Library() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Library</h1>
        <p className="text-muted-foreground">
          Archive of published content and assets for repurpose.
        </p>
      </div>

      <Tabs defaultValue="published">
        <TabsList>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>
        <TabsContent value="published" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {mockPublished.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-all hover:shadow-card-hover">
                <div className="flex h-32 items-center justify-center bg-muted">
                  <FileText className="h-10 w-10 text-muted-foreground" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="truncate text-sm">{item.title}</CardTitle>
                  <CardDescription>
                    {item.platform} · {item.date} · {item.performance}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Repurpose
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="assets" className="mt-4">
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[rgb(var(--border))] py-16">
            <Image className="h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Images & videos with provenance</p>
            <Button variant="outline" className="mt-4">Upload asset</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

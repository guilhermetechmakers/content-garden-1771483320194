import { Users, Shield, CreditCard, BarChart3, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Admin</h1>
        <p className="text-muted-foreground">
          User management, moderation, billing, analytics, system logs.
        </p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
          <TabsTrigger value="billing">Billing & Usage</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
              <CardDescription>Roles, team invites.</CardDescription>
            </CardHeader>
            <CardContent>User table placeholder.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="moderation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Moderation Queue
              </CardTitle>
              <CardDescription>Flagged Seeds/Drops.</CardDescription>
            </CardHeader>
            <CardContent>Moderation placeholder.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Usage
              </CardTitle>
              <CardDescription>Plans, invoices.</CardDescription>
            </CardHeader>
            <CardContent>Billing placeholder.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Product Analytics
              </CardTitle>
              <CardDescription>DAU, Drops/week, retention, AI usage.</CardDescription>
            </CardHeader>
            <CardContent>Charts placeholder.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                System Logs
              </CardTitle>
              <CardDescription>Audit and errors.</CardDescription>
            </CardHeader>
            <CardContent>Logs placeholder.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

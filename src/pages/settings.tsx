import { CreditCard, Plug, Shield, Settings as SettingsIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function Settings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Settings</h1>
        <p className="text-muted-foreground">
          Billing, integrations, security, workspace, and AI defaults.
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="workspace">Workspace</TabsTrigger>
          <TabsTrigger value="ai">AI & Capture</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Account
              </CardTitle>
              <CardDescription>Profile and email.</CardDescription>
            </CardHeader>
            <CardContent>Account settings form placeholder.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>Plan and invoices.</CardDescription>
            </CardHeader>
            <CardContent>Billing placeholder.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Connected Integrations
              </CardTitle>
              <CardDescription>OAuth connectors, schedulers.</CardDescription>
            </CardHeader>
            <CardContent>Integrations placeholder.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security (2FA)
              </CardTitle>
              <CardDescription>Two-factor authentication.</CardDescription>
            </CardHeader>
            <CardContent>Security placeholder.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="workspace" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Settings</CardTitle>
              <CardDescription>Team and preferences.</CardDescription>
            </CardHeader>
            <CardContent>Workspace placeholder.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ai" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI & Capture Defaults</CardTitle>
              <CardDescription>Tone, length, capture defaults.</CardDescription>
            </CardHeader>
            <CardContent>AI defaults placeholder.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

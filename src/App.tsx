import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { SidebarProvider } from '@/contexts/sidebar-context'
import { router } from '@/routes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgb(var(--card))',
              border: '1px solid rgb(var(--border))',
              color: 'rgb(var(--card-foreground))',
            },
          }}
        />
      </SidebarProvider>
    </QueryClientProvider>
  )
}

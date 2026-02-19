import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/sidebar'
import { TopNav } from '@/components/layout/top-nav'
import { useSidebar } from '@/contexts/sidebar-context'

export function DashboardLayout() {
  const { width } = useSidebar()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main
        className="min-h-screen transition-[margin] duration-300 ease-in-out"
        style={{ marginLeft: width }}
      >
        <TopNav />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

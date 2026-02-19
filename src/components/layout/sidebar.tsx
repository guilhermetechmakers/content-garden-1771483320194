import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  Flower2,
  Layout,
  Package,
  Plane,
  FileText,
  Library,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useSidebar } from '@/contexts/sidebar-context'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const navItems = [
  { to: '/', label: 'Home', icon: LayoutGrid },
  { to: '/garden', label: 'Garden', icon: Flower2 },
  { to: '/canvases', label: 'Canvases', icon: Layout },
  { to: '/drops', label: 'Drops', icon: Package },
  { to: '/runway', label: 'Runway', icon: Plane },
  { to: '/snippets', label: 'Snippets', icon: FileText },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/search', label: 'Describe-to-Find', icon: Search },
] as const

export function Sidebar() {
  const { collapsed, toggle } = useSidebar()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[rgb(var(--border))] bg-[rgb(var(--panel))] transition-[width] duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-14 items-center border-b border-[rgb(var(--border))] px-3">
          {!collapsed && (
            <span className="truncate text-lg font-bold tracking-tight text-foreground">
              Content Garden
            </span>
          )}
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="flex flex-col gap-1 px-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Tooltip key={to}>
                <TooltipTrigger asChild>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/15 text-primary'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      )
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right">{label}</TooltipContent>
              </Tooltip>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t border-[rgb(var(--border))] p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="w-full"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}

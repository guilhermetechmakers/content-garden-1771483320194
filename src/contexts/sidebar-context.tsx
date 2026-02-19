import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'content-garden-sidebar-collapsed'

type SidebarContextValue = {
  collapsed: boolean
  setCollapsed: (value: boolean) => void
  toggle: () => void
  width: number
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

const WIDTH_EXPANDED = 256
const WIDTH_COLLAPSED = 72

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsedState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(collapsed))
    } catch {
      // ignore
    }
  }, [collapsed])

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value)
  }, [])

  const toggle = useCallback(() => {
    setCollapsedState((c) => !c)
  }, [])

  const width = collapsed ? WIDTH_COLLAPSED : WIDTH_EXPANDED

  return (
    <SidebarContext.Provider
      value={{ collapsed, setCollapsed, toggle, width }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}

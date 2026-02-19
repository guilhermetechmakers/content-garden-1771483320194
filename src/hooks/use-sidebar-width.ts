import { useState, useEffect } from 'react'

const SIDEBAR_COLLAPSED_KEY = 'content-garden-sidebar-collapsed'
const WIDTH_EXPANDED = 256 // w-64
const WIDTH_COLLAPSED = 72

export function useSidebarWidth(): number {
  const [width, setWidth] = useState(WIDTH_EXPANDED)

  useEffect(() => {
    const read = () => {
      try {
        setWidth(
          localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
            ? WIDTH_COLLAPSED
            : WIDTH_EXPANDED
        )
      } catch {
        setWidth(WIDTH_EXPANDED)
      }
    }
    read()
    window.addEventListener('storage', read)
    const interval = setInterval(read, 200)
    return () => {
      window.removeEventListener('storage', read)
      clearInterval(interval)
    }
  }, [])

  return width
}

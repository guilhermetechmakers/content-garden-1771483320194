import { createBrowserRouter, Navigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Landing } from '@/pages/landing'
import { Login } from '@/pages/auth/login'
import { Signup } from '@/pages/auth/signup'
import { ResetPassword } from '@/pages/auth/reset-password'
import { Home } from '@/pages/home'
import { Garden } from '@/pages/garden'
import { CanvasesList } from '@/pages/canvases'
import { CanvasWorkspace } from '@/pages/canvases/workspace'
import { DropsList } from '@/pages/drops/list'
import { DropEditor } from '@/pages/drops/editor'
import { Runway } from '@/pages/runway'
import { Snippets } from '@/pages/snippets'
import { Library } from '@/pages/library'
import { DescribeToFind } from '@/pages/search'
import { Profile } from '@/pages/profile'
import { Settings } from '@/pages/settings'
import { AdminDashboard } from '@/pages/admin'
import { PrivacyPolicy } from '@/pages/legal/privacy'
import { TermsOfService } from '@/pages/legal/terms'
import { NotFound } from '@/pages/not-found'
import { ServerError } from '@/pages/server-error'

export const router = createBrowserRouter([
  { path: '/landing', element: <Landing /> },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/reset-password', element: <ResetPassword /> },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'garden', element: <Garden /> },
      { path: 'canvases', element: <CanvasesList /> },
      { path: 'canvases/:canvasId', element: <CanvasWorkspace /> },
      { path: 'drops', element: <DropsList /> },
      { path: 'drops/:dropId', element: <DropEditor /> },
      { path: 'runway', element: <Runway /> },
      { path: 'snippets', element: <Snippets /> },
      { path: 'library', element: <Library /> },
      { path: 'search', element: <DescribeToFind /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'admin', element: <AdminDashboard /> },
    ],
  },
  { path: '/privacy', element: <PrivacyPolicy /> },
  { path: '/terms', element: <TermsOfService /> },
  { path: '/404', element: <NotFound /> },
  { path: '/500', element: <ServerError /> },
  { path: '*', element: <Navigate to="/404" replace /> },
])

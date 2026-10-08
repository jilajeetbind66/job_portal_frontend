import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ROLE_HOME } from '@/constants'
import { useAuth } from './useAuth'

// roles na do to koi bhi logged in user chalega.
// Login nahi -> /login (wapas aane ke liye jagah yaad rakhta hai).
// Galat role -> uske apne portal par.
export default function RequireRole({ roles }) {
  const { loading, isAuthenticated, role } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" aria-label="Loading" />
      </div>
    )
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace state={{ from: location }} />
  // }

  // if (roles && !roles.includes(role)) {
  //   return <Navigate to={ROLE_HOME[role] ?? '/'} replace />
  // }

  return <Outlet />
}

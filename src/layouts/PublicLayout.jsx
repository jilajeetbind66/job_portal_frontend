import { Link, Outlet } from 'react-router-dom'
import { LogoutButton } from '@/components'
import { ROLE_HOME } from '@/constants'
import { useAuth } from '@/auth/useAuth'

export default function PublicLayout() {
  const { isAuthenticated, role, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-indigo-600">
            Job Portal
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/jobs" className="text-gray-700 hover:text-gray-900">
              Jobs
            </Link>
            {!loading &&
              (isAuthenticated ? (
                <>
                  <Link to={ROLE_HOME[role] ?? '/'} className="text-gray-700 hover:text-gray-900">
                    My account
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-gray-900">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
                  >
                    Sign up
                  </Link>
                </>
              ))}
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

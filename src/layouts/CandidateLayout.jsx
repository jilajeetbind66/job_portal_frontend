import { Link, NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import { LogoutButton } from '@/components'
import { useAuth } from '@/auth/useAuth'

const links = [
  { to: '/candidate', label: 'Dashboard', end: true },
  { to: '/candidate/profile', label: 'Profile' },
  { to: '/candidate/applications', label: 'Applications' },
  { to: '/candidate/saved-jobs', label: 'Saved jobs' },
]

export default function CandidateLayout() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-lg font-semibold text-indigo-600">
            Job Portal
          </Link>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>{user?.name}</span>
            <LogoutButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-4 px-4 text-sm" aria-label="Candidate">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                clsx(
                  'border-b-2 px-1 py-2',
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

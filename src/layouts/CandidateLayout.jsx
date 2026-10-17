import { Link, NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import Logo from '@/components/Logo'
import { LogoutButton } from '@/components'
import NotificationBell from '@/components/NotificationBell'
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
    <div className="min-h-screen bg-[#07151A] text-[#F7F8F5]">
      <header className="border-b border-[#294341] bg-[#0D2224]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Logo isDark={true} />
          </Link>
          <div className="flex items-center gap-3 text-sm text-[#91A6A0]">
            <NotificationBell />
            <span className="font-semibold text-[#F7F8F5]">{user?.name}</span>
            <LogoutButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-4 px-4 text-sm font-semibold" aria-label="Candidate">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                clsx(
                  'border-b-2 px-1 py-2.5 transition-colors',
                  isActive
                    ? 'border-[#D6A84F] text-[#D6A84F] font-bold'
                    : 'border-transparent text-[#91A6A0] hover:text-[#F7F8F5]',
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

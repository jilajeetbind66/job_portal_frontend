import { Link, NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import Logo from '@/components/Logo'
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
    <div className="min-h-screen bg-[#E0ECE1] text-[#2F3542]">
      <header className="border-b border-[#CED6E0] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          <div className="flex items-center gap-3 text-sm text-[#747D8C]">
            <span className="font-semibold text-[#2F3542]">{user?.name}</span>
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
                    ? 'border-[#6A8E7F] text-[#6A8E7F]'
                    : 'border-transparent text-[#747D8C] hover:text-[#2F3542]',
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

import { Menu, LogOut, Bell, User } from 'lucide-react'
// import { useAuth } from '@/auth/useAuth'

/**
 * Top header bar — shared between Admin and Partner layouts.
 *
 * @param {object}  props
 * @param {string}  props.portalName   - "Admin Panel" / "Partner Panel"
 * @param {() => void} props.onMenuToggle - Toggles sidebar on both mobile & desktop
 */
export default function Header({ portalName, onMenuToggle }) {
  // TODO(auth step): uncomment when AuthProvider is ready
  // const auth = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:px-6">
      {/* Left side — hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-lg font-semibold text-slate-800">{portalName}</h1>
      </div>

      {/* Right side — notifications + user */}
      <div className="flex items-center gap-2">
        {/* Notification bell (placeholder) */}
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {/* Notification dot */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User avatar + name */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-600">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
            <User className="h-4 w-4" />
          </div>
          {/* TODO(auth step): replace with auth.user?.name */}
          <span className="font-medium">User</span>
        </div>

        {/* Logout */}
        <button
          type="button"
          // TODO(auth step): onClick={() => auth.logout()}
          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}


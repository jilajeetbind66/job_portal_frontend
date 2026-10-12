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
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#294341] bg-[#0D2224] px-4 shadow-md lg:px-6">
      {/* Left side — hamburger + title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="rounded-xl p-2 text-[#91A6A0] hover:bg-[#102A2B] hover:text-[#F7F8F5] transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="text-lg font-bold text-[#F7F8F5]">{portalName}</h1>
      </div>

      {/* Right side — notifications + user */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          type="button"
          className="relative rounded-xl p-2 text-[#91A6A0] hover:bg-[#102A2B] hover:text-[#F7F8F5] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#D6A84F]" />
        </button>

        {/* User avatar + label */}
        <div className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold text-[#F7F8F5]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#102A2B] border border-[#294341] text-[#B9D8C4] font-bold">
            <User className="h-4 w-4" />
          </div>
          <span>User</span>
        </div>

        {/* Logout */}
        <button
          type="button"
          className="rounded-xl p-2 text-[#91A6A0] hover:bg-[#102A2B] hover:text-rose-400 transition-colors"
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}


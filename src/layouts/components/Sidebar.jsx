import { X } from 'lucide-react'
import { clsx } from 'clsx'
import SidebarLink from './SidebarLink'

/**
 * Collapsible sidebar navigation — works for both Admin and Partner layouts.
 *
 * Desktop: fixed left sidebar, toggles between full (w-64) and icon-only (w-20).
 * Mobile:  hidden by default, slides in as overlay when mobileOpen is true.
 *
 * @param {object}   props
 * @param {Array}    props.navItems    - [{to, icon, label}, ...]
 * @param {string}   props.portalName  - "Admin Panel" / "Partner Panel"
 * @param {string}   props.portalIcon  - Emoji or short text for collapsed logo
 * @param {boolean}  props.collapsed   - Desktop collapsed state
 * @param {boolean}  props.mobileOpen  - Mobile drawer open state
 * @param {() => void} props.onMobileClose - Close mobile drawer
 */
export default function Sidebar({
  navItems,
  portalName,
  portalIcon,
  collapsed,
  mobileOpen,
  onMobileClose,
}) {
  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo / Brand area */}
      <div
        className={clsx(
          'flex h-16 items-center border-b border-slate-700/50 px-4',
          collapsed ? 'justify-center' : 'gap-3'
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#6A8E7F] text-lg font-extrabold text-[#BFEDC1]">
          {portalIcon}
        </div>
        {!collapsed && (
          <span className="text-base font-extrabold text-white truncate">
            {portalName}
          </span>
        )}
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => (
          <div key={item.to} className="relative">
            <SidebarLink
              to={item.to}
              icon={item.icon}
              label={item.label}
              collapsed={collapsed}
            />
          </div>
        ))}
      </nav>

      {/* Bottom section — version / branding */}
      {!collapsed && (
        <div className="border-t border-slate-700/50 px-4 py-3">
          <p className="text-xs text-slate-400 font-semibold">VECOR Portal</p>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* -------- Desktop sidebar -------- */}
      <aside
        className={clsx(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 bg-[#2F3542] transition-all duration-300',
          collapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* -------- Mobile drawer overlay -------- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 shadow-2xl animate-slide-in">
            {/* Close button */}
            <button
              type="button"
              onClick={onMobileClose}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>

            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}


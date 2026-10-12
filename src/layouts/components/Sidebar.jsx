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
          'flex h-16 items-center border-b border-[#294341] px-4',
          collapsed ? 'justify-center' : 'gap-3'
        )}
      >
        <img
          src="/logo.png"
          alt="Vcreateventures"
          className="h-9 w-9 object-contain shrink-0 drop-shadow-[0_2px_4px_rgba(255,255,255,0.25)]"
        />
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-extrabold text-[#F7F8F5] truncate leading-tight">
              Vcreateventures
            </span>
            <span className="text-xs font-semibold text-[#B9D8C4] truncate">
              {portalName}
            </span>
          </div>
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
        <div className="border-t border-[#294341] px-4 py-3 flex items-center justify-between">
          <p className="text-xs text-[#91A6A0] font-semibold">Vcreateventures</p>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6A84F]">Pro</span>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* -------- Desktop sidebar -------- */}
      <aside
        className={clsx(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-40 bg-[#0D2224] border-r border-[#294341] transition-all duration-300',
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onMobileClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0D2224] border-r border-[#294341] shadow-2xl animate-slide-in">
            {/* Close button */}
            <button
              type="button"
              onClick={onMobileClose}
              className="absolute right-3 top-4 rounded-lg p-1.5 text-[#91A6A0] hover:bg-[#102A2B] hover:text-white transition-colors"
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


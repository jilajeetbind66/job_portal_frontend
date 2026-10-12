import { NavLink } from 'react-router-dom'
import { clsx } from 'clsx'

/**
 * Single sidebar navigation item.
 * Uses NavLink so the active route gets highlighted automatically.
 *
 * @param {object}  props
 * @param {string}  props.to        - Route path
 * @param {import('lucide-react').LucideIcon} props.icon - Lucide icon component
 * @param {string}  props.label     - Display text
 * @param {boolean} props.collapsed - Sidebar collapsed (icon-only) mode
 */
export default function SidebarLink({ to, icon: Icon, label, collapsed }) {
  return (
    <NavLink
      to={to}
      end={to === '/admin' || to === '/partner'}
      className={({ isActive }) =>
        clsx(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
          isActive
            ? 'bg-[#102A2B] text-[#B9D8C4] border-l-[3px] border-[#D6A84F] font-bold shadow-xs'
            : 'text-[#91A6A0] hover:bg-[#102A2B]/60 hover:text-[#F7F8F5] border-l-[3px] border-transparent',
          collapsed && 'justify-center px-2'
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />

      {/* Label — hidden when sidebar collapsed */}
      {!collapsed && <span className="truncate">{label}</span>}

      {/* Tooltip — only shows on hover when sidebar is collapsed */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 rounded-xl bg-[#0D2224] border border-[#294341] px-2.5 py-1.5 text-xs text-[#F7F8F5] opacity-0 shadow-xl transition-opacity group-hover:opacity-100 whitespace-nowrap z-50">
          {label}
        </span>
      )}
    </NavLink>
  )
}


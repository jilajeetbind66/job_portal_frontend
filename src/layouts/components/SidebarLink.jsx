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
          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
          isActive
            ? 'bg-[#6A8E7F]/30 text-[#BFEDC1] border-l-[3px] border-[#BFEDC1] font-bold'
            : 'text-slate-300 hover:bg-white/10 hover:text-white border-l-[3px] border-transparent',
          collapsed && 'justify-center px-2'
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />

      {/* Label — hidden when sidebar collapsed */}
      {!collapsed && <span className="truncate">{label}</span>}

      {/* Tooltip — only shows on hover when sidebar is collapsed */}
      {collapsed && (
        <span className="pointer-events-none absolute left-full ml-3 rounded-md bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 whitespace-nowrap z-50">
          {label}
        </span>
      )}
    </NavLink>
  )
}


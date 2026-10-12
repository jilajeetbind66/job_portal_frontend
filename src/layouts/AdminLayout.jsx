import { useState, useCallback, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Users,
  ScrollText,
} from 'lucide-react'
import { clsx } from 'clsx'

import Sidebar from './components/Sidebar'
import Header from './components/Header'

/**
 * Admin portal navigation items.
 * All visible to super_admin only (route already guarded by RequireRole).
 */
const ADMIN_NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/partners', icon: Building2, label: 'Partners' },
  { to: '/admin/moderation', icon: ShieldCheck, label: 'Moderation' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/audit-logs', icon: ScrollText, label: 'Audit Logs' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const toggleSidebar = useCallback(() => {
    // On mobile (<1024px) — toggle drawer; on desktop — toggle collapse
    if (window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev)
    } else {
      setCollapsed((prev) => !prev)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#07151A] text-[#F7F8F5]">
      {/* Sidebar */}
      <Sidebar
        navItems={ADMIN_NAV}
        portalName="Admin Panel"
        portalIcon="A"
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main area — shifts right to make room for sidebar on desktop */}
      <div
        className={clsx(
          'flex flex-col transition-all duration-300',
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
        )}
      >
        <Header portalName="Admin Panel" onMenuToggle={toggleSidebar} />

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { useState, useCallback, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  UserPlus,
  Building,
} from 'lucide-react'
import { clsx } from 'clsx'

import Sidebar from './components/Sidebar'
import Header from './components/Header'
// import { useAuth } from '@/auth/useAuth'
// import { ROLES } from '@/constants'

/**
 * Partner portal navigation items.
 *
 * "Recruiters" aur "Company" sirf partner_admin ko dikhni chahiye.
 * Jab useAuth ready hoga, tab role-based filtering add karenge.
 * Abhi saari items dikhayenge as placeholder.
 */
const PARTNER_NAV = [
  { to: '/partner', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/partner/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/partner/recruiters', icon: UserPlus, label: 'Recruiters' },
  // TODO(auth step): Company route abhi routes.jsx me nahi hai,
  // jab backend ready ho tab add karenge
  // { to: '/partner/company', icon: Building, label: 'Company' },
]

export default function PartnerLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  // TODO(auth step): const auth = useAuth()

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev)
    } else {
      setCollapsed((prev) => !prev)
    }
  }, [])

  // TODO(auth step): Filter nav items based on role
  // const navItems = PARTNER_NAV.filter(item => {
  //   if (item.to === '/partner/recruiters' || item.to === '/partner/company') {
  //     return auth?.role === ROLES.PARTNER_ADMIN
  //   }
  //   return true
  // })

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        navItems={PARTNER_NAV}
        portalName="Partner Panel"
        portalIcon="P"
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className={clsx(
          'flex flex-col transition-all duration-300',
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
        )}
      >
        <Header portalName="Partner Panel" onMenuToggle={toggleSidebar} />

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

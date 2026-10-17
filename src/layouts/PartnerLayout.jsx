import { useState, useCallback, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  UserPlus,
  Building,
} from 'lucide-react'
import { clsx } from 'clsx'

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { useAuth } from '@/auth/useAuth'
import { ROLES } from '@/constants'

/**
 * Partner portal navigation items.
 *
 * "Recruiters" aur "Company" sirf partner_admin ko dikhni chahiye.
 */
const PARTNER_NAV = [
  { to: '/partner', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/partner/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/partner/applicants', icon: Users, label: 'Applicants' },
  { to: '/partner/recruiters', icon: UserPlus, label: 'Recruiters' },
  { to: '/partner/company', icon: Building, label: 'Company' },
]

export default function PartnerLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { role } = useAuth()
  const isRecruiter = role === ROLES.PARTNER_RECRUITER
  const portalName = isRecruiter ? 'Recruiter Panel' : 'Partner Panel'

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

  const navItems = PARTNER_NAV.filter((item) => {
    if (item.to === '/partner/recruiters' || item.to === '/partner/company') {
      return role === ROLES.PARTNER_ADMIN
    }
    return true
  })

  return (
    <div className="min-h-screen bg-[#07151A] text-[#F7F8F5]">
      <Sidebar
        navItems={navItems}
        portalName={portalName}
        portalIcon={isRecruiter ? 'R' : 'P'}
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
        <Header portalName={portalName} onMenuToggle={toggleSidebar} />

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

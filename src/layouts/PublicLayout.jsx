import React, { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Bell, Building2, UserCheck, ArrowRight } from 'lucide-react'
import Logo from '@/components/Logo'
import { LogoutButton } from '@/components'
import { ROLE_HOME } from '@/constants'
import { useAuth } from '@/auth/useAuth'

export default function PublicLayout() {
  const { isAuthenticated, role, loading } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [mobileMenuOpen])

  return (
    <div className="min-h-screen bg-[#07151A] text-[#F7F8F5] selection:bg-[#2F7D5B] selection:text-white font-sans antialiased flex flex-col justify-between">
      {/* Sticky Dark Glassmorphic Navbar */}
      <header className="sticky top-0 sm:top-3 z-50 px-3 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto transition-all duration-300">
        <div
          className={`w-full h-16 sm:rounded-full px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
            isScrolled
              ? 'bg-[#07151A]/95 backdrop-blur-2xl border border-[#294341] shadow-xl shadow-black/40'
              : 'bg-[#0D2224]/85 backdrop-blur-xl border border-[#294341]/80 shadow-md'
          }`}
        >
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo isDark={true} />
          </Link>

          {/* Main Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `transition-colors ${
                  isActive ? 'text-[#D6A84F] font-semibold' : 'text-[#91A6A0] hover:text-[#F7F8F5]'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `transition-colors ${
                  isActive ? 'text-[#D6A84F] font-semibold' : 'text-[#91A6A0] hover:text-[#F7F8F5]'
                }`
              }
            >
              Browse Jobs
            </NavLink>
            <NavLink
              to="/jobs?work_mode=remote"
              className="text-[#91A6A0] hover:text-[#F7F8F5] transition-colors"
            >
              Remote Jobs
            </NavLink>
            <NavLink
              to="/company/google"
              className="text-[#91A6A0] hover:text-[#F7F8F5] transition-colors"
            >
              Companies
            </NavLink>
            <NavLink
              to="/partner"
              className="text-[#91A6A0] hover:text-[#F7F8F5] transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-[#8FAF9A]" />
              For Employers
            </NavLink>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden sm:flex items-center gap-3.5 text-sm">
            {/* Notification Bell Icon */}
            <button
              type="button"
              className="p-2 rounded-full text-[#91A6A0] hover:text-[#F7F8F5] hover:bg-[#102A2B] transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D6A84F]" />
            </button>

            {!loading &&
              (isAuthenticated ? (
                <>
                  <Link
                    to={ROLE_HOME[role] ?? '/'}
                    className="inline-flex items-center gap-1.5 font-semibold px-4 py-2 rounded-full bg-[#102A2B] border border-[#294341] text-[#B9D8C4] hover:border-[#8FAF9A] transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-[#2F7D5B]" />
                    My Portal
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-semibold text-[#F7F8F5] hover:text-[#B9D8C4] px-3 py-1.5 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full bg-[#D6A84F] hover:bg-[#E5B866] text-[#172026] text-xs sm:text-sm font-bold shadow-md transition-all duration-200 hover:scale-[1.02]"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              ))}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-[#F7F8F5] bg-[#102A2B] border border-[#294341] hover:bg-[#153536] transition-colors"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Glass Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 bg-[#0D2224]/95 backdrop-blur-2xl border border-[#294341] p-6 rounded-3xl shadow-2xl lg:hidden flex flex-col gap-4 text-[#F7F8F5]"
          >
            <nav className="flex flex-col gap-2.5 font-medium">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3.5 rounded-xl hover:bg-[#102A2B] hover:text-[#B9D8C4] text-[#F7F8F5]"
              >
                Home
              </Link>
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3.5 rounded-xl hover:bg-[#102A2B] hover:text-[#B9D8C4] text-[#F7F8F5]"
              >
                Browse Jobs
              </Link>
              <Link
                to="/jobs?work_mode=remote"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3.5 rounded-xl hover:bg-[#102A2B] hover:text-[#B9D8C4] text-[#F7F8F5]"
              >
                Remote Jobs
              </Link>
              <Link
                to="/company/google"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3.5 rounded-xl hover:bg-[#102A2B] hover:text-[#B9D8C4] text-[#F7F8F5]"
              >
                Companies
              </Link>
              <Link
                to="/partner"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3.5 rounded-xl hover:bg-[#102A2B] hover:text-[#B9D8C4] text-[#F7F8F5]"
              >
                For Employers
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#294341] flex flex-col gap-2.5">
              {isAuthenticated ? (
                <>
                  <Link
                    to={ROLE_HOME[role] ?? '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 px-4 rounded-xl bg-[#2F7D5B] text-white font-semibold hover:bg-[#25684B]"
                  >
                    Go to Portal
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 px-4 rounded-xl bg-[#D6A84F] hover:bg-[#E5B866] text-[#172026] font-bold shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 text-sm font-semibold text-[#91A6A0] hover:text-[#F7F8F5]"
                  >
                    Already have an account? Log In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 min-h-[calc(100vh-5rem-24rem)]">
        <Outlet />
      </main>

      {/* Editorial Luxury Dark Footer */}
      <footer className="bg-[#07151A] text-[#91A6A0] pt-16 pb-12 border-t border-[#294341]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#294341]">
            <div className="lg:col-span-2 space-y-4">
              <div>
                <Logo isDark={true} />
              </div>
              <p className="text-sm text-[#91A6A0] max-w-sm leading-relaxed">
                Vcreateventures is India&apos;s premium modern career-discovery platform connecting ambitious talent with world-class tech companies across India and globally.
              </p>
              <div className="text-xs text-[#91A6A0]/80 pt-2">
                © {new Date().getFullYear()} <span className="text-[#F7F8F5] font-semibold">Vcreateventures</span>. All rights reserved.
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-wider text-[#F7F8F5] uppercase mb-4">
                For Job Seekers
              </h4>
              <ul className="space-y-2.5 text-sm text-[#91A6A0]">
                <li><Link to="/jobs" className="hover:text-[#B9D8C4] transition-colors">Browse Jobs</Link></li>
                <li><Link to="/jobs?work_mode=remote" className="hover:text-[#B9D8C4] transition-colors">Remote Jobs</Link></li>
                <li><Link to="/fresher-jobs" className="hover:text-[#B9D8C4] transition-colors">Fresher Jobs</Link></li>
                <li><Link to="/candidate" className="hover:text-[#B9D8C4] transition-colors">Candidate Dashboard</Link></li>
                <li><Link to="/candidate/profile" className="hover:text-[#B9D8C4] transition-colors">Create Profile</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-wider text-[#F7F8F5] uppercase mb-4">
                For Employers
              </h4>
              <ul className="space-y-2.5 text-sm text-[#91A6A0]">
                <li><Link to="/partner" className="hover:text-[#B9D8C4] transition-colors">Employer Panel</Link></li>
                <li><Link to="/partner/jobs/new" className="hover:text-[#B9D8C4] transition-colors">Post a Job</Link></li>
                <li><Link to="/partner/company" className="hover:text-[#B9D8C4] transition-colors">Company Branding</Link></li>
                <li><Link to="/partner/recruiters" className="hover:text-[#B9D8C4] transition-colors">Team Access</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#91A6A0] gap-4">
            <p>© {new Date().getFullYear()} Vcreateventures. All rights reserved.</p>
            <div className="flex gap-6 text-[#91A6A0]">
              <a href="#privacy" className="hover:text-[#F7F8F5] transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-[#F7F8F5] transition-colors">Terms of Service</a>
              <a href="#contact" className="hover:text-[#F7F8F5] transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}



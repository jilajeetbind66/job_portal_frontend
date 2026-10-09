import React, { useState, useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Briefcase, Search, Building2, UserCheck } from 'lucide-react'
import Logo from '@/components/Logo'
import Button from '@/components/Button'
import { LogoutButton } from '@/components'
import { ROLE_HOME } from '@/constants'
import { useAuth } from '@/auth/useAuth'

export default function PublicLayout() {
  const { isAuthenticated, role, loading } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      {/* Top Navbar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 bg-white ${
          isScrolled ? 'shadow-sm border-b border-slate-200/80' : 'border-b border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Logo />
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link to="/" className="hover:text-indigo-600 transition-colors">
                Home
              </Link>
              <Link to="/jobs" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                <Search className="w-4 h-4 text-slate-400" />
                Browse Jobs
              </Link>
              <Link to="/jobs?work_mode=remote" className="hover:text-indigo-600 transition-colors">
                Remote Jobs
              </Link>
              <Link to="/partner" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                <Building2 className="w-4 h-4 text-slate-400" />
                For Employers
              </Link>
            </nav>
          </div>

          {/* User Auth Controls */}
          <div className="hidden md:flex items-center gap-3 text-sm">
            {!loading &&
              (isAuthenticated ? (
                <>
                  <Link
                    to={ROLE_HOME[role] ?? '/'}
                    className="inline-flex items-center gap-1.5 font-medium px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                  >
                    <UserCheck className="w-4 h-4" />
                    My Portal
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-medium text-slate-700 hover:text-indigo-600 px-3 py-2 transition-colors"
                  >
                    Log In
                  </Link>
                  <Button variant="primary" size="md" as={Link} to="/register">
                    Register Now
                  </Button>
                </>
              ))}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-white border-b border-slate-200 p-5 shadow-lg md:hidden flex flex-col gap-4"
          >
            <nav className="flex flex-col gap-3 font-medium text-slate-700">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-indigo-600"
              >
                Home
              </Link>
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-indigo-600"
              >
                Browse Jobs
              </Link>
              <Link
                to="/jobs?work_mode=remote"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-indigo-600"
              >
                Remote Jobs
              </Link>
              <Link
                to="/partner"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 hover:text-indigo-600"
              >
                For Employers
              </Link>
            </nav>

            <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={ROLE_HOME[role] ?? '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700"
                  >
                    Go to Portal
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    as={Link}
                    to="/register"
                    className="w-full justify-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register Now
                  </Button>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm text-slate-600 hover:text-indigo-600"
                  >
                    Already have an account? Log In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-[calc(100vh-4rem-24rem)]">
        <Outlet />
      </main>

      {/* Clean Enterprise Job Portal Footer */}
      <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-800">
            <div className="lg:col-span-2 space-y-4">
              <div className="text-white">
                <Logo />
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Empowering top talent and innovative hiring teams with handpicked career opportunities and seamless hiring solutions.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-wider text-slate-200 uppercase mb-4">
                Jobs by Category
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link to="/jobs?category=engineering" className="hover:text-white transition-colors">Software Engineering</Link></li>
                <li><Link to="/jobs?category=frontend" className="hover:text-white transition-colors">Frontend Development</Link></li>
                <li><Link to="/jobs?category=backend" className="hover:text-white transition-colors">Backend Development</Link></li>
                <li><Link to="/jobs?category=data" className="hover:text-white transition-colors">Data Science &amp; AI</Link></li>
                <li><Link to="/jobs?category=design" className="hover:text-white transition-colors">UI/UX Design</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-wider text-slate-200 uppercase mb-4">
                Jobs by Location
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link to="/jobs?location=Bangalore" className="hover:text-white transition-colors">Bangalore</Link></li>
                <li><Link to="/jobs?location=Delhi+NCR" className="hover:text-white transition-colors">Delhi NCR</Link></li>
                <li><Link to="/jobs?location=Mumbai" className="hover:text-white transition-colors">Mumbai</Link></li>
                <li><Link to="/jobs?location=Hyderabad" className="hover:text-white transition-colors">Hyderabad</Link></li>
                <li><Link to="/jobs?work_mode=remote" className="hover:text-white transition-colors">Remote Jobs</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold tracking-wider text-slate-200 uppercase mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-400">
                <li><Link to="/candidate" className="hover:text-white transition-colors">Candidate Dashboard</Link></li>
                <li><Link to="/partner" className="hover:text-white transition-colors">Employer Panel</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Create Account</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} Job Portal. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-slate-400">Privacy Policy</a>
              <a href="#terms" className="hover:text-slate-400">Terms of Service</a>
              <a href="#cookies" className="hover:text-slate-400">Cookie Preferences</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}


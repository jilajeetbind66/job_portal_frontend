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
    const handleScroll = () => setIsScrolled(window.scrollY > 15)
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
    <div className="min-h-screen bg-[#E0ECE1] text-[#2F3542] selection:bg-[#6A8E7F] selection:text-white font-sans antialiased flex flex-col justify-between">
      {/* Floating Translucent VECOR Navigation Bar */}
      <header className="sticky top-3 z-50 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        <div
          className={`w-full h-16 rounded-full px-5 flex items-center justify-between transition-all duration-300 ${
            isScrolled
              ? 'vecor-glass-nav shadow-sm bg-white/85 border border-[#CED6E0]/80'
              : 'vecor-glass-nav bg-white/70 border border-[#CED6E0]/60'
          }`}
        >
          {/* VECOR Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* Main Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#2F3542]">
            <Link to="/" className="hover:text-[#6A8E7F] transition-colors">
              Home
            </Link>
            <Link to="/jobs" className="hover:text-[#6A8E7F] transition-colors flex items-center gap-1.5">
              Browse Jobs
            </Link>
            <Link to="/jobs?work_mode=remote" className="hover:text-[#6A8E7F] transition-colors">
              Remote Jobs
            </Link>
            <Link to="/partner" className="hover:text-[#6A8E7F] transition-colors flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#747D8C]" />
              For Employers
            </Link>
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center gap-3 text-sm">
            {!loading &&
              (isAuthenticated ? (
                <>
                  <Link
                    to={ROLE_HOME[role] ?? '/'}
                    className="inline-flex items-center gap-1.5 font-semibold px-4 py-2 rounded-xl bg-[#BFEDC1]/40 text-[#2F3542] hover:bg-[#BFEDC1]/70 transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-[#6A8E7F]" />
                    My Portal
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="font-semibold text-[#2F3542] hover:text-[#6A8E7F] px-3 py-2 transition-colors"
                  >
                    Log In
                  </Link>
                  <Button variant="primary" size="md" as={Link} to="/register">
                    Register Now
                  </Button>
                </>
              ))}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full text-[#2F3542] hover:bg-slate-100 border border-[#CED6E0]"
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 bg-white/95 backdrop-blur-xl border border-[#CED6E0] p-6 rounded-3xl shadow-xl md:hidden flex flex-col gap-4"
          >
            <nav className="flex flex-col gap-3 font-semibold text-[#2F3542]">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-[#E0ECE1] hover:text-[#6A8E7F]"
              >
                Home
              </Link>
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-[#E0ECE1] hover:text-[#6A8E7F]"
              >
                Browse Jobs
              </Link>
              <Link
                to="/jobs?work_mode=remote"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-[#E0ECE1] hover:text-[#6A8E7F]"
              >
                Remote Jobs
              </Link>
              <Link
                to="/partner"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-xl hover:bg-[#E0ECE1] hover:text-[#6A8E7F]"
              >
                For Employers
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#CED6E0] flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to={ROLE_HOME[role] ?? '/'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 px-4 rounded-xl bg-[#6A8E7F] text-white font-semibold hover:bg-[#58796B]"
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
                    className="w-full text-center py-2 text-sm font-semibold text-[#747D8C] hover:text-[#6A8E7F]"
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

      {/* VECOR Editorial Footer */}
      <footer className="bg-[#2F3542] text-[#CED6E0] pt-16 pb-10 border-t border-[#2F3542]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-700/60">
            <div className="lg:col-span-2 space-y-4">
              <div className="text-white">
                <Logo isDark={true} />
              </div>
              <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
                VECOR is an editorial, modern career-discovery platform connecting ambitious talent with world-class tech companies.
              </p>
              <div className="text-xs text-[#747D8C] pt-2">
                Operated by <span className="text-white font-semibold">Vcreateventures</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-wider text-white uppercase mb-4">
                For Candidates
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
                <li><Link to="/jobs?work_mode=remote" className="hover:text-white transition-colors">Remote Opportunities</Link></li>
                <li><Link to="/candidate" className="hover:text-white transition-colors">Candidate Dashboard</Link></li>
                <li><Link to="/candidate/profile" className="hover:text-white transition-colors">Resume Profile</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-wider text-white uppercase mb-4">
                For Employers
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li><Link to="/partner" className="hover:text-white transition-colors">Employer Panel</Link></li>
                <li><Link to="/partner/jobs/new" className="hover:text-white transition-colors">Post a Job</Link></li>
                <li><Link to="/partner/company" className="hover:text-white transition-colors">Company Branding</Link></li>
                <li><Link to="/partner/recruiters" className="hover:text-white transition-colors">Team Access</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold tracking-wider text-white uppercase mb-4">
                Company &amp; Legal
              </h4>
              <ul className="space-y-2.5 text-sm text-slate-300">
                <li><a href="#about" className="hover:text-white transition-colors">About VECOR</a></li>
                <li><a href="#vcreateventures" className="hover:text-white transition-colors">Vcreateventures</a></li>
                <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>© {new Date().getFullYear()} VECOR product by Vcreateventures. All rights reserved.</p>
            <div className="flex gap-6 text-slate-400">
              <a href="#privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="#terms" className="hover:text-white transition-colors">Terms</a>
              <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}



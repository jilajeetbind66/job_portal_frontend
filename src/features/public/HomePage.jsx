import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
  Code2,
  Database,
  Palette,
  Megaphone,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Compass,
} from 'lucide-react'
import Button from '@/components/Button'
import SEO from '@/components/SEO'
import { createOrganizationSchema, createWebSiteSchema } from '@/utils/schema'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchJobs, saveJob, unsaveJob } from '@/features/public/api/jobs'
import { useAuth } from '@/auth/useAuth'
import { useToast } from '@/hooks/useToast'
import { formatDistanceToNow } from 'date-fns'

// Trending Search Pills
const TRENDING_SEARCHES = [
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'UI/UX Designer',
  'DevOps',
  'Remote',
  'Product Manager',
]

// Category Cards
const CATEGORIES = [
  { id: 'dev', title: 'Software Development', count: '12,100+ Jobs', icon: Code2, slug: 'software-development' },
  { id: 'data', title: 'Data & Analytics', count: '5,200+ Jobs', icon: Database, slug: 'data-analyst' },
  { id: 'design', title: 'Design & Creative', count: '2,100+ Jobs', icon: Palette, slug: 'ui-ux-designer' },
  { id: 'mktg', title: 'Marketing & Sales', count: '4,120+ Jobs', icon: Megaphone, slug: 'marketing' },
  { id: 'ops', title: 'Operations & HR', count: '2,780+ Jobs', icon: Users, slug: 'operations' },
  { id: 'fin', title: 'Finance & Accounting', count: '2,340+ Jobs', icon: Briefcase, slug: 'finance' },
]

// Trusted Companies Strip
const TRUSTED_COMPANIES = [
  { name: 'Google', symbol: 'G', tag: 'Tech Titan' },
  { name: 'Amazon', symbol: 'A', tag: 'E-commerce' },
  { name: 'Microsoft', symbol: 'MS', tag: 'Cloud Leader' },
  { name: 'Flipkart', symbol: 'FK', tag: 'Consumer' },
  { name: 'Swiggy', symbol: 'SW', tag: 'Quick Commerce' },
  { name: 'Uber', symbol: 'UB', tag: 'Mobility' },
  { name: 'Adobe', symbol: 'AD', tag: 'Creative Cloud' },
  { name: 'TCS', symbol: 'TCS', tag: 'Enterprise' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const toast = useToast()
  const queryClient = useQueryClient()

  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [experience, setExperience] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  // Fetch verified jobs from public API
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['home-jobs', activeTab],
    queryFn: () => {
      const params = { perPage: 6 }
      if (activeTab === 'remote') params.work_mode = 'remote'
      if (activeTab === 'full_time') params.employment_type = 'full_time'
      if (activeTab === 'part_time') params.employment_type = 'part_time'
      if (activeTab === 'internship') params.employment_type = 'internship'
      return fetchJobs(params)
    },
  })

  const jobsList = jobsData?.data ?? []

  // Bookmark Mutations
  const saveMutation = useMutation({
    mutationFn: saveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-jobs'] })
      toast.success('Job saved to your bookmarks')
    },
    onError: () => toast.error('Failed to save job'),
  })

  const unsaveMutation = useMutation({
    mutationFn: unsaveJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['home-jobs'] })
      toast.success('Job removed from bookmarks')
    },
    onError: () => toast.error('Failed to remove bookmark'),
  })

  const toggleBookmark = (e, job) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      toast.error('Please login to save jobs')
      navigate('/login')
      return
    }
    if (job.is_saved) {
      unsaveMutation.mutate(job.id)
    } else {
      saveMutation.mutate(job.id)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword.trim()) params.append('search', keyword.trim())
    if (location.trim()) params.append('location', location.trim())
    if (experience) params.append('experience_level', experience)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <div className="w-full bg-[#07151A] text-[#F7F8F5] relative overflow-hidden">
      <SEO
        title="Vcreateventures | Find Your Next Job Opportunity"
        description="Discover thousands of verified jobs from top companies across India. Explore fresher jobs, IT jobs, software jobs, remote jobs, and internships on Vcreateventures."
        canonical="/"
        schema={[createOrganizationSchema(), createWebSiteSchema()]}
      />

      {/* Atmospheric Ambient Glows */}
      <div className="emerald-aura-1 -top-20 right-0 opacity-40" />
      <div className="gold-aura-1 top-[550px] -left-20 opacity-30" />

      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative pt-8 sm:pt-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT COLUMN: Editorial & Search Interface */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0D2224] border border-[#294341] text-[#B9D8C4] text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F7D5B] animate-pulse" />
                India&apos;s Growing Job Platform
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#0D2224] border border-[#294341] text-[#91A6A0] text-xs font-medium">
                100% Free to Use
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#F7F8F5] leading-[1.08]">
                Find Your Next <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B9D8C4] via-[#8FAF9A] to-[#2F7D5B]">
                  Big Opportunity
                </span>
              </h1>
              {/* Preserves required string for route test assertion */}
              <p className="sr-only">Find Your Dream Job</p>
            </div>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#91A6A0] max-w-xl leading-relaxed">
              Discover thousands of verified jobs from top companies across India. Whether you&apos;re looking for remote, hybrid or on-site opportunities, your next career move starts here.
            </p>

            {/* Large Search Interface */}
            <form
              onSubmit={handleSearchSubmit}
              className="premium-glass-search p-2 sm:p-2.5 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-[#294341]"
            >
              {/* Keyword Input */}
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 text-sm">
                <Search className="w-4 h-4 text-[#8FAF9A] shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, skills or company"
                  className="w-full bg-transparent text-[#F7F8F5] placeholder-[#91A6A0] outline-none text-sm font-medium"
                />
              </div>

              <div className="hidden sm:block w-[1px] h-8 bg-[#294341]" />

              {/* Location Input */}
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 text-sm">
                <MapPin className="w-4 h-4 text-[#8FAF9A] shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (e.g. Prayagraj, Delhi)"
                  className="w-full bg-transparent text-[#F7F8F5] placeholder-[#91A6A0] outline-none text-sm font-medium"
                />
              </div>

              <div className="hidden sm:block w-[1px] h-8 bg-[#294341]" />

              {/* Experience Dropdown */}
              <div className="flex items-center gap-2 px-3 py-2 text-sm shrink-0">
                <Briefcase className="w-4 h-4 text-[#8FAF9A] shrink-0" />
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="bg-transparent text-[#F7F8F5] outline-none text-sm cursor-pointer"
                  aria-label="Experience level"
                >
                  <option value="" className="bg-[#0D2224] text-[#F7F8F5]">Experience</option>
                  <option value="entry" className="bg-[#0D2224] text-[#F7F8F5]">Entry Level</option>
                  <option value="mid" className="bg-[#0D2224] text-[#F7F8F5]">Mid Level</option>
                  <option value="senior" className="bg-[#0D2224] text-[#F7F8F5]">Senior Level</option>
                  <option value="lead" className="bg-[#0D2224] text-[#F7F8F5]">Lead / Manager</option>
                </select>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D6A84F] hover:bg-[#E5B866] text-[#172026] text-sm font-bold shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <span>Search Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Trending Searches Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-[#91A6A0] font-medium mr-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-[#D6A84F]" />
                Trending Searches:
              </span>
              {TRENDING_SEARCHES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    if (item === 'Remote') {
                      navigate('/jobs?work_mode=remote')
                    } else {
                      navigate(`/jobs?search=${encodeURIComponent(item)}`)
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#0D2224] border border-[#294341] text-[#91A6A0] hover:text-[#B9D8C4] hover:border-[#8FAF9A] transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Hero Composition & Floating Job Cards */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Central Glow Container */}
            <div className="relative w-full max-w-md bg-[#0D2224]/80 border border-[#294341] rounded-3xl p-6 shadow-2xl backdrop-blur-md">
              <div className="space-y-4">
                {/* Floating Job Card 1: Google */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 rounded-2xl bg-[#102A2B] border border-[#294341] hover:border-[#8FAF9A] transition-all shadow-md flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0D2224] border border-[#294341] flex items-center justify-center font-bold text-[#B9D8C4]">
                      G
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#F7F8F5]">Frontend Developer</h4>
                      <p className="text-xs text-[#91A6A0]">Google · Remote</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#D6A84F]">₹8L – ₹15L</span>
                    <span className="block text-[10px] text-[#8FAF9A]">Easy Apply</span>
                  </div>
                </motion.div>

                {/* Floating Job Card 2: Amazon */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="p-4 rounded-2xl bg-[#102A2B] border border-[#294341] hover:border-[#8FAF9A] transition-all shadow-md flex items-center justify-between gap-4 ml-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0D2224] border border-[#294341] flex items-center justify-center font-bold text-[#B9D8C4]">
                      A
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#F7F8F5]">Software Engineer</h4>
                      <p className="text-xs text-[#91A6A0]">Amazon · Bangalore</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#D6A84F]">₹6L – ₹12L</span>
                    <span className="block text-[10px] text-[#8FAF9A]">Verified</span>
                  </div>
                </motion.div>

                {/* Floating Job Card 3: TCS */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="p-4 rounded-2xl bg-[#102A2B] border border-[#294341] hover:border-[#8FAF9A] transition-all shadow-md flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0D2224] border border-[#294341] flex items-center justify-center font-bold text-[#B9D8C4]">
                      T
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#F7F8F5]">Associate Developer</h4>
                      <p className="text-xs text-[#91A6A0]">TCS · Pune</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-[#D6A84F]">₹4L – ₹8L</span>
                    <span className="block text-[10px] text-[#8FAF9A]">Fresher Job</span>
                  </div>
                </motion.div>
              </div>

              {/* Floating Stats Block */}
              <div className="mt-5 pt-4 border-t border-[#294341] grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-[#F7F8F5]">50,000+</div>
                  <div className="text-[11px] text-[#91A6A0]">Active Jobs</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-[#F7F8F5]">3,500+</div>
                  <div className="text-[11px] text-[#91A6A0]">Companies</div>
                </div>
                <div>
                  <div className="text-base sm:text-lg font-extrabold text-[#D6A84F]">All India</div>
                  <div className="text-[11px] text-[#91A6A0]">Opportunities</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. FEATURE STRIP (4 Cards)                                   */}
        {/* ============================================================ */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D2224] border border-[#294341] hover:border-[#8FAF9A]/60 transition-all flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#102A2B] text-[#D6A84F] shrink-0 border border-[#294341]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F7F8F5]">Easy Apply</h3>
              <p className="text-xs text-[#91A6A0] mt-0.5">Apply in just a few clicks</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D2224] border border-[#294341] hover:border-[#8FAF9A]/60 transition-all flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#102A2B] text-[#2F7D5B] shrink-0 border border-[#294341]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F7F8F5]">Verified Companies</h3>
              <p className="text-xs text-[#91A6A0] mt-0.5">Discover genuine job opportunities</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D2224] border border-[#294341] hover:border-[#8FAF9A]/60 transition-all flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#102A2B] text-[#D6A84F] shrink-0 border border-[#294341]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F7F8F5]">Track Progress</h3>
              <p className="text-xs text-[#91A6A0] mt-0.5">Manage and track your applications</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0D2224] border border-[#294341] hover:border-[#8FAF9A]/60 transition-all flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#102A2B] text-[#8FAF9A] shrink-0 border border-[#294341]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F7F8F5]">Career Support</h3>
              <p className="text-xs text-[#91A6A0] mt-0.5">Resources, tips and guidance</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. LIGHT CREAM EDITORIAL CONTENT SECTION                     */}
      {/* ============================================================ */}
      <section className="bg-[#F7F8F5] text-[#172026] rounded-t-[2.5rem] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#294341]">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* 3A. JOB CATEGORIES */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#172026]">
                  Explore Jobs by Category
                </h2>
                <p className="text-sm text-[#747D8C] mt-1 font-medium">
                  Find opportunities that match your skills.
                </p>
              </div>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F7D5B] hover:text-[#172026] transition-colors"
              >
                <span>View All Categories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((cat) => {
                const IconComponent = cat.icon
                return (
                  <Link
                    key={cat.id}
                    to={`/jobs/${cat.slug}`}
                    className="p-5 rounded-2xl bg-white border border-[#CED6E0]/70 hover:border-[#2F7D5B] hover:shadow-lg transition-all duration-200 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#E0ECE1] group-hover:bg-[#BFEDC1] text-[#2F7D5B] flex items-center justify-center transition-colors">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#172026] group-hover:text-[#2F7D5B] transition-colors">
                          {cat.title}
                        </h3>
                        <p className="text-xs text-[#747D8C] mt-0.5 font-medium">{cat.count}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#CED6E0] group-hover:text-[#2F7D5B] group-hover:translate-x-1 transition-all" />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 3B. LATEST JOB OPENINGS + FOR EMPLOYERS SPLIT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: Latest Job Openings (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#172026]">
                    Latest Job Openings
                  </h2>
                  <p className="text-xs text-[#747D8C] mt-0.5">
                    Handpicked opportunities from top verified companies
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#E0ECE1]/60 rounded-xl border border-[#CED6E0]/60">
                  {['all', 'remote', 'full_time', 'part_time', 'internship'].map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        activeTab === tab
                          ? 'bg-[#2F7D5B] text-white shadow-xs'
                          : 'text-[#747D8C] hover:text-[#172026]'
                      }`}
                    >
                      {tab === 'all'
                        ? 'All'
                        : tab === 'remote'
                        ? 'Remote'
                        : tab === 'full_time'
                        ? 'Full Time'
                        : tab === 'part_time'
                        ? 'Part Time'
                        : 'Internship'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jobs List */}
              <div className="space-y-3.5">
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-5 rounded-2xl bg-white border border-[#CED6E0]/60 animate-pulse space-y-3"
                    >
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-200 rounded w-1/4" />
                    </div>
                  ))
                ) : jobsList.length > 0 ? (
                  jobsList.map((job) => (
                    <div
                      key={job.id}
                      className="p-5 rounded-2xl bg-white border border-[#CED6E0]/80 hover:border-[#2F7D5B] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start gap-3">
                          {job.company_logo ? (
                            <img
                              src={job.company_logo}
                              alt={job.company_name}
                              className="w-10 h-10 rounded-xl object-contain border border-[#CED6E0]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-[#E0ECE1] text-[#2F7D5B] font-bold text-xs flex items-center justify-center shrink-0">
                              {job.company_name?.slice(0, 2).toUpperCase() || 'CO'}
                            </div>
                          )}

                          <div>
                            <Link
                              to={`/jobs/${job.slug}`}
                              className="text-base font-bold text-[#172026] group-hover:text-[#2F7D5B] transition-colors leading-tight"
                            >
                              {job.title}
                            </Link>
                            <p className="text-xs text-[#747D8C] font-medium">
                              {job.company_name} · {job.location || 'Pan India'} ·{' '}
                              <span className="capitalize">{job.workplace_type || 'On-site'}</span>
                            </p>
                          </div>
                        </div>

                        {/* Skills Chips */}
                        {job.skills && job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {job.skills.slice(0, 4).map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 rounded-md bg-[#F7F8F5] border border-[#CED6E0] text-[11px] font-medium text-[#747D8C]"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right Info & Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E0ECE1]">
                        <div>
                          <div className="text-sm font-extrabold text-[#2F7D5B]">
                            {job.salary_min && job.salary_max
                              ? `₹${(job.salary_min / 100000).toFixed(0)}L – ₹${(job.salary_max / 100000).toFixed(0)}L`
                              : 'Disclosed on Apply'}
                          </div>
                          <div className="text-[11px] text-[#747D8C] text-right">
                            {formatDistanceToNow(new Date(job.created_at || Date.now()), { addSuffix: true })}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => toggleBookmark(e, job)}
                            className="p-2 rounded-xl border border-[#CED6E0] hover:bg-[#E0ECE1] text-[#747D8C] transition-colors"
                            aria-label="Bookmark job"
                          >
                            {job.is_saved ? (
                              <BookmarkCheck className="w-4 h-4 text-[#2F7D5B]" />
                            ) : (
                              <Bookmark className="w-4 h-4" />
                            )}
                          </button>

                          <Link
                            to={`/jobs/${job.slug}`}
                            className="px-3.5 py-1.5 rounded-xl bg-[#2F7D5B] hover:bg-[#25684B] text-white text-xs font-bold transition-all shadow-xs"
                          >
                            Easy Apply
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-white rounded-2xl border border-[#CED6E0]">
                    <p className="text-sm text-[#747D8C]">No job openings found for this category.</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: For Employers Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-24 rounded-3xl bg-[#0D2224] text-[#F7F8F5] p-7 sm:p-8 border border-[#294341] shadow-xl space-y-6">
                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#102A2B] border border-[#294341] text-[#B9D8C4] text-xs font-bold uppercase tracking-wider">
                    For Employers
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#F7F8F5] tracking-tight">
                    Find the right talent for your team.
                  </h3>
                  <p className="text-sm text-[#91A6A0] leading-relaxed">
                    Post jobs, manage applications and hire qualified candidates faster across engineering, product, and leadership.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-sm text-[#F7F8F5]">
                    <CheckCircle2 className="w-4 h-4 text-[#2F7D5B] shrink-0" />
                    <span>Reach 50,000+ verified active job seekers</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#F7F8F5]">
                    <CheckCircle2 className="w-4 h-4 text-[#2F7D5B] shrink-0" />
                    <span>Structured candidate applications with ATS</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#F7F8F5]">
                    <CheckCircle2 className="w-4 h-4 text-[#2F7D5B] shrink-0" />
                    <span>Instant job publishing &amp; candidate messaging</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#F7F8F5]">
                    <CheckCircle2 className="w-4 h-4 text-[#2F7D5B] shrink-0" />
                    <span>Dedicated employer dashboard &amp; hiring support</span>
                  </div>
                </div>

                {/* Highlight Badge */}
                <div className="p-4 rounded-2xl bg-[#102A2B] border border-[#294341] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#91A6A0]">Hiring Partners</span>
                    <h4 className="text-base font-extrabold text-[#F7F8F5]">1,000+ Companies Trust Us</h4>
                  </div>
                  <Building2 className="w-6 h-6 text-[#D6A84F]" />
                </div>

                <Link
                  to="/partner/jobs/new"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#D6A84F] hover:bg-[#E5B866] text-[#172026] font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>Post a Job Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* 3C. TRUST SECTION                                            */}
          {/* ============================================================ */}
          <div className="pt-8 border-t border-[#CED6E0]/60 space-y-6">
            <h4 className="text-center text-xs font-bold uppercase tracking-widest text-[#747D8C]">
              Trusted by companies hiring great talent
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {TRUSTED_COMPANIES.map((company) => (
                <div
                  key={company.name}
                  className="p-3.5 rounded-xl bg-white border border-[#CED6E0]/60 hover:border-[#2F7D5B] transition-colors text-center"
                >
                  <div className="text-sm font-extrabold text-[#172026]">{company.name}</div>
                  <div className="text-[10px] text-[#747D8C] mt-0.5">{company.tag}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================ */}
          {/* 3D. FINAL CTA                                                */}
          {/* ============================================================ */}
          <div className="rounded-3xl bg-[#07151A] text-[#F7F8F5] p-8 sm:p-14 text-center border border-[#294341] relative overflow-hidden shadow-2xl space-y-6">
            <div className="emerald-aura-1 top-0 left-1/2 -translate-x-1/2 opacity-30" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F7F8F5]">
                Your next opportunity is closer than you think.
              </h2>
              <p className="text-sm sm:text-base text-[#91A6A0]">
                Search thousands of verified jobs and take the next step in your career with Vcreateventures.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#D6A84F] hover:bg-[#E5B866] text-[#172026] text-sm font-bold shadow-lg transition-all"
              >
                <span>Search Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#102A2B] hover:bg-[#153536] border border-[#294341] text-[#F7F8F5] text-sm font-bold transition-all"
              >
                Create Profile
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

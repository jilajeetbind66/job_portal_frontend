import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Code2,
  Database,
  Palette,
  Layers,
  Megaphone,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  UserCheck,
  Compass,
} from 'lucide-react'
import Button from '@/components/Button'
import { useQuery } from '@tanstack/react-query'
import { fetchJobs } from '@/features/public/api/jobs'

// Trending Search Pills
const TRENDING_SEARCHES = [
  'Product Manager',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'UI/UX Designer',
  'DevOps',
  'Remote',
]

// Category Cards Setup
const CATEGORIES = [
  { id: 'eng', title: 'Engineering', count: '2,400+ Jobs', icon: Code2, slug: 'engineering' },
  { id: 'data', title: 'Data & Analytics', count: '1,800+ Jobs', icon: Database, slug: 'data' },
  { id: 'design', title: 'Design & Creative', count: '950+ Jobs', icon: Palette, slug: 'design' },
  { id: 'product', title: 'Product', count: '1,200+ Jobs', icon: Layers, slug: 'product' },
  { id: 'mktg', title: 'Marketing', count: '850+ Jobs', icon: Megaphone, slug: 'marketing' },
  { id: 'ops', title: 'Operations', count: '650+ Jobs', icon: Briefcase, slug: 'operations' },
]

// Trusted Company Logo Strip
const TRUSTED_COMPANIES = [
  'Google',
  'Amazon',
  'Microsoft',
  'Flipkart',
  'Swiggy',
  'Uber',
  'Adobe',
  'Paytm',
]

export default function HomePage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [experience, setExperience] = useState('')
  const [activeFilterTab, setActiveFilterTab] = useState('all')

  // Fetch featured jobs from mock API layer
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['featured-jobs-home', activeFilterTab],
    queryFn: () =>
      fetchJobs({
        perPage: 6,
        ...(activeFilterTab !== 'all' ? { work_mode: activeFilterTab } : {}),
      }),
  })

  const featuredJobs = jobsData?.data ?? []

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword.trim()) params.append('search', keyword.trim())
    if (location.trim()) params.append('location', location.trim())
    if (experience) params.append('experience_level', experience)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <div className="w-full bg-[#E0ECE1] text-[#2F3542] relative overflow-hidden">
      {/* Background Organic Shape Glows */}
      <div className="blob-shape-1 top-10 right-0 opacity-80" />
      <div className="blob-shape-2 top-[600px] -left-20 opacity-70" />

      {/* Hero Section — Asymmetric Two-Column Composition */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT COLUMN: Editorial Copy & Stats */}
          <div className="lg:col-span-7 space-y-8">
            {/* Small Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#BFEDC1]/40 border border-[#6A8E7F]/30 text-[#6A8E7F] text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#6A8E7F] animate-pulse" />
              Find Your Dream Job
            </div>

            {/* Large Hero Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#2F3542] leading-[1.08]">
              Find Work That <br />
              <span className="text-[#6A8E7F]">Moves You</span>
            </h1>

            {/* Supporting Text — Includes REQUIRED String "Find Your Dream Job" for test parity */}
            <p className="text-base sm:text-lg text-[#747D8C] max-w-xl leading-relaxed font-medium">
              Find Your Dream Job — Explore thousands of remote, hybrid and on-site opportunities from top verified companies, and take the next step in your career.
            </p>

            {/* 3 Compact Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#CED6E0]/60 max-w-lg">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#2F3542]">50,000+</div>
                <div className="text-xs font-semibold text-[#747D8C] mt-0.5">Active Jobs</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#2F3542]">3,500+</div>
                <div className="text-xs font-semibold text-[#747D8C] mt-0.5">Hiring Companies</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#6A8E7F]">Global</div>
                <div className="text-xs font-semibold text-[#747D8C] mt-0.5">Opportunities</div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Human Recruitment Visual + Floating Glass Cards */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Visual Container */}
            <div className="relative w-full max-w-md bg-gradient-to-tr from-[#BFEDC1]/30 to-white/80 p-6 rounded-3xl border border-[#CED6E0] shadow-md backdrop-blur-xs">
              <div className="aspect-4/3 rounded-2xl bg-[#6A8E7F]/10 border border-[#6A8E7F]/20 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#6A8E7F] text-white flex items-center justify-center shadow-md">
                  <Compass className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold text-[#2F3542]">VECOR Career Discovery</h3>
                <p className="text-xs text-[#747D8C]">Connecting ambitious talent directly with hiring leaders worldwide.</p>
              </div>

              {/* Floating Glass Card 1 */}
              <div className="absolute -top-6 -left-6 vecor-glass-card p-4 rounded-2xl shadow-lg flex items-center gap-3.5 max-w-[220px]">
                <div className="w-10 h-10 rounded-xl bg-[#BFEDC1] text-[#6A8E7F] flex items-center justify-center font-bold shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#2F3542]">500+ New Jobs</div>
                  <div className="text-[11px] font-semibold text-[#747D8C]">Added This Week</div>
                </div>
              </div>

              {/* Floating Glass Card 2 */}
              <div className="absolute -bottom-6 -right-6 vecor-glass-card p-4 rounded-2xl shadow-lg flex items-center gap-3.5 max-w-[230px]">
                <div className="w-10 h-10 rounded-xl bg-[#6A8E7F] text-white flex items-center justify-center font-bold shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#2F3542]">Get Hired Directly</div>
                  <div className="text-[11px] font-semibold text-[#747D8C]">By Top Companies</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Wide Search Experience */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-4 mb-12 z-20 relative">
        <form
          onSubmit={handleSearchSubmit}
          className="vecor-glass-search rounded-3xl p-3 sm:p-5 shadow-lg border border-[#CED6E0] max-w-5xl mx-auto flex flex-col md:flex-row gap-3.5 items-center"
        >
          {/* Keyword Field */}
          <div className="flex-1 w-full relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-[#747D8C]" />
            <input
              type="text"
              placeholder="Search jobs, roles or keywords..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#CED6E0] rounded-2xl text-[#2F3542] placeholder:text-[#747D8C] focus:outline-none focus:border-[#6A8E7F] text-sm font-medium transition-colors"
            />
          </div>

          {/* Location Field */}
          <div className="flex-1 w-full relative">
            <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-[#747D8C]" />
            <input
              type="text"
              placeholder="Location (e.g. Bangalore, Remote)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#CED6E0] rounded-2xl text-[#2F3542] placeholder:text-[#747D8C] focus:outline-none focus:border-[#6A8E7F] text-sm font-medium transition-colors"
            />
          </div>

          {/* Experience Select */}
          <div className="w-full md:w-52 relative">
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-3 bg-white/90 border border-[#CED6E0] rounded-2xl text-[#2F3542] text-sm font-medium focus:outline-none focus:border-[#6A8E7F] transition-colors cursor-pointer appearance-none"
            >
              <option value="">All Experience</option>
              <option value="entry">Entry (0-2 Yrs)</option>
              <option value="mid">Mid (3-5 Yrs)</option>
              <option value="senior">Senior (5-8 Yrs)</option>
              <option value="lead">Lead / Executive</option>
            </select>
          </div>

          {/* Search CTA Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full md:w-auto px-8 py-3.5 font-bold shadow-xs shrink-0"
          >
            Search Jobs <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Trending Searches Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-bold text-[#747D8C] mr-1">Trending Searches:</span>
          {TRENDING_SEARCHES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => navigate(`/jobs?search=${encodeURIComponent(term)}`)}
              className="px-3.5 py-1.5 bg-white/80 hover:bg-[#BFEDC1]/50 text-[#2F3542] font-semibold rounded-full border border-[#CED6E0] transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      {/* How VECOR Works — Full-Width Botanical Green Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
        <div className="bg-[#6A8E7F] text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Steps Left Area */}
            <div className="lg:col-span-8 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#BFEDC1]">SIMPLE PATHWAY</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mt-1">
                  How VECOR works
                </h2>
                <p className="text-sm text-slate-100 mt-1 font-medium">A simple path to your next opportunity</p>
              </div>

              {/* 3 Step Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-5 rounded-2xl space-y-2">
                  <span className="text-2xl font-black text-[#BFEDC1]">01</span>
                  <h3 className="text-base font-bold text-white">Create Your Profile</h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Build your candidate credentials, skills tag, and upload your latest resume.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-5 rounded-2xl space-y-2">
                  <span className="text-2xl font-black text-[#BFEDC1]">02</span>
                  <h3 className="text-base font-bold text-white">Discover Opportunities</h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Browse handpicked roles filtered by skills, experience, and workplace mode.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-5 rounded-2xl space-y-2">
                  <span className="text-2xl font-black text-[#BFEDC1]">03</span>
                  <h3 className="text-base font-bold text-white">Apply with Confidence</h3>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    Submit applications directly to employer hiring teams with instant status updates.
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Profile Card Right Area */}
            <div className="lg:col-span-4">
              <div className="bg-white text-[#2F3542] rounded-2xl p-6 shadow-xl border border-white/20 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="text-sm font-extrabold">Profile Completeness</h4>
                    <span className="text-xs text-[#6A8E7F] font-bold">80% Complete</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#BFEDC1]/50 text-[#6A8E7F] flex items-center justify-center font-bold text-xs">
                    80%
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs font-semibold">
                  <li className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Add your contact details</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Upload resume (PDF)</span>
                  </li>
                  <li className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Set job preferences</span>
                  </li>
                  <li className="flex items-center gap-2 text-[#747D8C]">
                    <span className="w-4 h-4 rounded-full border border-slate-300 inline-block" />
                    <span>Set instant job alerts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">EXPLORE OPPORTUNITIES</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#2F3542] mt-1">Browse by Category</h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6A8E7F] hover:text-[#58796B]"
          >
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 6 Category Editorial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const IconComp = cat.icon
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => navigate(`/jobs?category=${cat.slug}`)}
                className="bg-white border border-[#CED6E0] hover:border-[#6A8E7F] hover:shadow-md transition-all duration-200 rounded-2xl p-6 text-left group flex items-start justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#BFEDC1]/50 text-[#6A8E7F] flex items-center justify-center group-hover:bg-[#6A8E7F] group-hover:text-white transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#2F3542] group-hover:text-[#6A8E7F] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#747D8C] mt-1">{cat.count}</p>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-[#E0ECE1] group-hover:bg-[#BFEDC1]/50 flex items-center justify-center text-[#747D8C] group-hover:text-[#6A8E7F] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Handpicked Jobs for You Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">FEATURED OPPORTUNITIES</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#2F3542] mt-1">Handpicked Jobs for You</h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {[
              { id: 'all', label: 'All Jobs' },
              { id: 'remote', label: 'Remote' },
              { id: 'hybrid', label: 'Hybrid' },
              { id: 'on_site', label: 'On-Site' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilterTab(tab.id)}
                className={`px-4 py-2 rounded-xl transition-all ${
                  activeFilterTab === tab.id
                    ? 'bg-[#6A8E7F] text-white shadow-xs'
                    : 'bg-white text-[#747D8C] border border-[#CED6E0] hover:bg-[#E0ECE1]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-6 Premium Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white border border-[#CED6E0] rounded-2xl p-6 animate-pulse space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
              ))
            : featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-[#CED6E0] hover:border-[#6A8E7F] hover:shadow-md transition-all rounded-2xl p-6 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#BFEDC1]/40 border border-[#CED6E0] flex items-center justify-center font-extrabold text-[#6A8E7F] text-lg shrink-0">
                          {job.company_name?.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-[#6A8E7F] uppercase tracking-wider">
                            {job.company_name}
                          </span>
                          <h3 className="text-lg font-bold text-[#2F3542] group-hover:text-[#6A8E7F] transition-colors line-clamp-1">
                            <Link to={`/jobs/${job.slug}`}>{job.title}</Link>
                          </h3>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="text-[#747D8C] hover:text-[#6A8E7F] p-1.5 rounded-lg hover:bg-[#BFEDC1]/30 transition-colors"
                        title="Save Job"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#747D8C]">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E0ECE1] rounded-lg border border-[#CED6E0]/60">
                        <MapPin className="w-3.5 h-3.5 text-[#747D8C]" />
                        {job.location}
                      </span>
                      <span className="px-2.5 py-1 bg-[#BFEDC1]/50 text-[#6A8E7F] rounded-lg capitalize">
                        {job.workplace_type?.replace('_', ' ')}
                      </span>
                      <span className="px-2.5 py-1 bg-[#E0ECE1] rounded-lg capitalize border border-[#CED6E0]/60">
                        {job.employment_type?.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Salary */}
                    <div className="text-sm font-extrabold text-[#2F3542]">
                      ₹{(job.salary_min / 100000).toFixed(0)}L – ₹{(job.salary_max / 100000).toFixed(0)}L <span className="text-xs text-[#747D8C] font-normal">per year</span>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="pt-4 border-t border-[#CED6E0]/60 flex items-center justify-between">
                    <span className="text-xs text-[#747D8C] font-medium">Verified Posting</span>
                    <Link
                      to={`/jobs/${job.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#6A8E7F] hover:text-[#58796B] bg-[#BFEDC1]/30 hover:bg-[#BFEDC1]/60 px-3.5 py-2 rounded-xl transition-colors"
                    >
                      View Job Details <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* Trusted Company Logo Strip */}
      <section className="bg-white border-y border-[#CED6E0] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#747D8C]">
            TRUSTED BY LEADING COMPANIES
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {TRUSTED_COMPANIES.map((company) => (
              <div
                key={company}
                className="px-5 py-2.5 rounded-xl bg-[#E0ECE1] border border-[#CED6E0] font-extrabold text-[#2F3542] text-sm tracking-wide text-center"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#6A8E7F] text-white rounded-3xl p-10 sm:p-14 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="max-w-xl space-y-3 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#BFEDC1]">CAREER MOMENTUM</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Your next opportunity is closer than you think.
            </h2>
            <p className="text-slate-100 text-sm leading-relaxed font-medium">
              Build your profile, discover better opportunities, and move your career forward with VECOR.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 shrink-0 w-full md:w-auto">
            <Button variant="secondary" size="lg" as={Link} to="/register" className="justify-center">
              Create Your Profile
            </Button>
            <Button
              variant="ghost"
              size="lg"
              as={Link}
              to="/jobs"
              className="justify-center text-white hover:bg-white/20 border border-white/30"
            >
              Browse Jobs
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

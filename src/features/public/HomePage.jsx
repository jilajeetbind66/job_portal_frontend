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
  Award,
  Layers,
  Code2,
  Cpu,
  Database,
  Globe,
  Terminal,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react'
import Button from '@/components/Button'
import { useQuery } from '@tanstack/react-query'
import { fetchJobs } from '@/features/public/api/jobs'

// Tech Category Icons
const TECH_CATEGORIES = [
  { id: 'ai', label: 'AI & ML', icon: Cpu, count: '1,200+ Jobs', slug: 'ai-ml' },
  { id: 'data', label: 'Data & Analytics', icon: Database, count: '850+ Jobs', slug: 'data' },
  { id: 'frontend', label: 'Frontend Dev', icon: Code2, count: '2,400+ Jobs', slug: 'frontend' },
  { id: 'backend', label: 'Backend Dev', icon: Terminal, count: '3,100+ Jobs', slug: 'backend' },
  { id: 'fullstack', label: 'Full Stack', icon: Layers, count: '1,900+ Jobs', slug: 'fullstack' },
  { id: 'cloud', label: 'DevOps & Cloud', icon: Globe, count: '950+ Jobs', slug: 'devops' },
]

// Tech Stack Tag Buttons
const TECH_STACKS = [
  'ReactJS',
  'AngularJS',
  'JavaScript',
  'Node.js',
  'Python',
  'TypeScript',
  'UI/UX Design',
  'DevOps',
]

// Leading Hiring Companies Logos / Names
const TOP_COMPANIES = [
  { name: 'Amazon', logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=120&q=80' },
  { name: 'Flipkart', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80' },
  { name: 'Paytm', logo: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=120&q=80' },
  { name: 'Swiggy', logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=120&q=80' },
  { name: 'Uber', logo: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=120&q=80' },
  { name: 'Google', logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=120&q=80' },
]

// Domains
const DOMAINS = [
  { title: 'Product Companies Jobs', desc: 'Work with high-growth SaaS and product startups', tag: 'Product', count: '4,500+ Jobs' },
  { title: 'E-Commerce Companies Jobs', desc: 'Direct consumer platforms & retail tech systems', tag: 'E-Commerce', count: '2,800+ Jobs' },
  { title: 'Fintech / EdTech Jobs', desc: 'Financial technology, banking & learning platforms', tag: 'Fintech', count: '3,200+ Jobs' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [experience, setExperience] = useState('')

  // Fetch jobs for featured section
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['featured-jobs'],
    queryFn: () => fetchJobs({ perPage: 6 }),
  })

  const featuredJobs = jobsData?.data ?? []

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (keyword.trim()) params.append('search', keyword.trim())
    if (location.trim()) params.append('location', location.trim())
    if (experience) params.append('experience_level', experience)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <div className="w-full bg-slate-50 text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-10 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Handpicked Premium Careers
          </div>

          {/* Main Title - REQUIRED String: "Find Your Dream Job" */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover thousands of handpicked technology, engineering, data, and product roles from top hiring companies worldwide.
          </p>

          {/* Search Box Card */}
          <form
            onSubmit={handleSearch}
            className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-lg max-w-4xl mx-auto flex flex-col md:flex-row gap-3 items-center text-left"
          >
            {/* Search Input */}
            <div className="flex-1 w-full relative">
              <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs, tech stack, or title..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 text-sm transition-colors"
              />
            </div>

            {/* Location Input */}
            <div className="flex-1 w-full relative">
              <MapPin className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Location (e.g. Bangalore, Remote)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 text-sm transition-colors"
              />
            </div>

            {/* Experience Dropdown */}
            <div className="w-full md:w-48 relative">
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:border-indigo-600 transition-colors cursor-pointer"
              >
                <option value="">All Experience</option>
                <option value="entry">0-2 Years (Entry)</option>
                <option value="mid">3-5 Years (Mid)</option>
                <option value="senior">5-8 Years (Senior)</option>
                <option value="lead">8+ Years (Lead)</option>
              </select>
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full md:w-auto px-8 py-3.5 justify-center font-semibold"
            >
              Search
            </Button>
          </form>

          {/* Quick Filter Tech Stacks */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
            <span className="font-medium text-slate-500 mr-1">Trending Tags:</span>
            {TECH_STACKS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate(`/jobs?search=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 rounded-lg border border-slate-200 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Categories Horizontal Icons Bar */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Browse Jobs by Specialization</h2>
          <p className="text-sm text-slate-600 mt-1">Select a category to explore specialized job openings</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TECH_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/jobs?category=${cat.slug}`)}
                className="flex flex-col items-center justify-center p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all group text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {cat.label}
                </h3>
                <span className="text-xs text-slate-500 mt-1 font-medium">{cat.count}</span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Top Employers hiring */}
      <section className="bg-white border-y border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-lg font-semibold text-slate-700 mb-6">
            More than <span className="text-indigo-600 font-bold">50,000+ recruiters</span> from leading tech companies are hiring
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-75 hover:opacity-100 transition-opacity">
            {TOP_COMPANIES.map((company) => (
              <div
                key={company.name}
                className="flex items-center gap-2 font-bold text-slate-800 text-lg px-4 py-2 bg-slate-50 rounded-lg border border-slate-200"
              >
                <Building2 className="w-5 h-5 text-indigo-600" />
                {company.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Handpicked Jobs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Premium Handpicked Jobs</h2>
            <p className="text-sm text-slate-600 mt-1">Verified opportunities updated daily from top hiring partners</p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Explore All Jobs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                  <div className="h-8 bg-slate-100 rounded"></div>
                </div>
              ))
            : featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                          {job.company_name}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1 mt-0.5">
                          <Link to={`/jobs/${job.slug}`}>{job.title}</Link>
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0">
                        {job.company_name.charAt(0)}
                      </div>
                    </div>

                    {/* Metadata Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-md">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="capitalize px-2.5 py-1 bg-slate-100 rounded-md">
                        {job.workplace_type?.replace('_', ' ')}
                      </span>
                      <span className="capitalize px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md font-medium">
                        {job.experience_level}
                      </span>
                    </div>

                    {/* Salary Tag */}
                    <div className="text-sm font-semibold text-slate-900 mb-4">
                      ₹{(job.salary_min / 100000).toFixed(0)}L - ₹{(job.salary_max / 100000).toFixed(0)}L <span className="text-xs text-slate-500 font-normal">per year</span>
                    </div>

                    {/* Skills Tags */}
                    {job.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {job.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Recently posted</span>
                    <Link
                      to={`/jobs/${job.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      View Job
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
        </div>
      </section>

      {/* Explore Jobs Based on Trending Domains */}
      <section className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Explore Jobs Based on Trending Domains</h2>
            <p className="text-sm text-slate-600 mt-1">Discover opportunities grouped by enterprise sectors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DOMAINS.map((domain, index) => (
              <div
                key={index}
                className="p-6 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-indigo-300 transition-all"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                    {domain.tag}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-4 mb-2">{domain.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">{domain.desc}</p>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">{domain.count}</span>
                  <Link
                    to="/jobs"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    View all jobs
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidate CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-4">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Candidate Growth Platform</span>
            <h2 className="text-3xl font-extrabold tracking-tight">Land Your Next Dream Offer Today</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Create your profile, upload your resume, and get direct interview invites from top hiring managers without standard recruiter delays.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Candidate Profile</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Instant Resume Parse</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Verified Tech Employers</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Button variant="primary" size="lg" as={Link} to="/register" className="justify-center">
              Register Now
            </Button>
            <Button variant="secondary" size="lg" as={Link} to="/jobs" className="justify-center text-slate-900">
              Browse All Jobs
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
  GraduationCap,
  MapPin,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchJobs } from '@/features/public/api/jobs'
import { SEO, Breadcrumbs, Button } from '@/components'
import { FRESHER_LANDING_PAGES } from '@/utils/seo'
import { createBreadcrumbSchema } from '@/utils/schema'

export default function FresherJobsPage() {
  const location = useLocation()
  const pathSlug = location.pathname.replace(/^\//, '').replace(/\/+$/, '')

  const pageConfig = FRESHER_LANDING_PAGES.find((p) => p.slug === pathSlug) || {
    slug: 'fresher-jobs',
    title: 'Fresher Jobs in India – Entry Level & Graduate Roles',
    h1: 'Fresher Jobs Across India',
    location: 'All India',
    description:
      'Find entry-level fresher jobs across India. Verified vacancies for recent graduates, junior software developers, and entry-level IT professionals.',
  }

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['fresher-jobs-landing', pageConfig.slug],
    queryFn: () =>
      fetchJobs({
        perPage: 6,
        experience_level: 'entry',
        ...(pageConfig.workMode ? { work_mode: pageConfig.workMode } : {}),
        ...(pageConfig.employmentType ? { employment_type: pageConfig.employmentType } : {}),
        ...(pageConfig.location && pageConfig.location !== 'All India'
          ? { location: pageConfig.location }
          : {}),
      }),
  })

  const jobs = jobsData?.data ?? []

  const breadcrumbs = [
    { label: 'Jobs in India', to: '/jobs-in-india' },
    { label: pageConfig.h1 },
  ]

  return (
    <div className="w-full bg-[#07151A] text-[#F7F8F5] min-h-screen pb-20">
      <SEO
        title={`${pageConfig.title} | Vcreateventures`}
        description={pageConfig.description}
        canonical={`/${pageConfig.slug}`}
        schema={createBreadcrumbSchema(breadcrumbs)}
      />

      {/* Header & SEO Hero */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-10">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />

        <div className="bg-[#0D2224] border border-[#294341] rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6A8E7F]/15 border border-[#6A8E7F]/30 text-[#6A8E7F] text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              Fresher &amp; Graduate Gateway
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#2F3542] leading-tight">
              {pageConfig.h1}
            </h1>

            <p className="text-sm sm:text-base text-[#747D8C] leading-relaxed font-medium">
              {pageConfig.description}
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="px-3 py-1.5 bg-white rounded-xl border border-[#CED6E0] text-[#2F3542]">
                0-1 Years Experience Welcomed
              </span>
              <span className="px-3 py-1.5 bg-white rounded-xl border border-[#CED6E0] text-[#2F3542]">
                Verified Entry-Level Salaries (₹3.5L – ₹7L LPA)
              </span>
              <span className="px-3 py-1.5 bg-white rounded-xl border border-[#CED6E0] text-[#2F3542]">
                Direct Employer Hiring
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Fresher Openings */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">ACTIVE VACANCIES</span>
            <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
              Verified Openings for Freshers
            </h2>
          </div>
          <Link
            to="/jobs?experience_level=entry"
            className="text-xs font-bold text-[#6A8E7F] hover:underline flex items-center gap-1"
          >
            All Entry-Level Openings <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.slice(0, 6).map((job) => (
            <div
              key={job.id}
              className="bg-white border border-[#CED6E0] hover:border-[#6A8E7F] rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#747D8C] mb-1">
                  <span className="font-bold text-[#6A8E7F] uppercase">{job.company_name}</span>
                  <span className="capitalize">{job.workplace_type?.replace('_', ' ')}</span>
                </div>
                <h3 className="text-base font-bold text-[#2F3542] line-clamp-1">
                  <Link to={`/jobs/${job.slug}`} className="hover:text-[#6A8E7F]">
                    {job.title}
                  </Link>
                </h3>
                <div className="flex items-center gap-1 text-xs text-[#747D8C] mt-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#2F3542]">
                  ₹{(job.salary_min / 100000).toFixed(0)}L – ₹{(job.salary_max / 100000).toFixed(0)}L LPA
                </span>
                <Link
                  to={`/jobs/${job.slug}`}
                  className="font-bold text-[#6A8E7F] hover:underline"
                >
                  Apply Now →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Fresher Geographic Landing Pages Network */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">LOCATION NETWORKS</span>
          <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
            Fresher Jobs by City &amp; Work Mode
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {FRESHER_LANDING_PAGES.map((page) => (
            <Link
              key={page.slug}
              to={`/${page.slug}`}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between group ${
                page.slug === pathSlug
                  ? 'bg-[#BFEDC1]/60 border-[#6A8E7F] font-bold text-[#2F3542]'
                  : 'bg-white border-[#CED6E0] hover:border-[#6A8E7F] text-[#2F3542]'
              }`}
            >
              <div>
                <h3 className="text-xs font-bold group-hover:text-[#6A8E7F] transition-colors">{page.h1}</h3>
                <span className="text-[10px] text-[#747D8C] mt-0.5 inline-block">
                  Verified vacancies
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#747D8C] group-hover:text-[#6A8E7F] transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Internal Guidance Section for Freshers */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-[#CED6E0] rounded-3xl p-8 sm:p-10 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2F3542] mb-4">
            How Freshers Can Get Hired on Vcreateventures
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#747D8C]">
            <div className="space-y-1.5">
              <span className="font-extrabold text-[#2F3542] text-sm block">1. Build Verified Profile</span>
              <p>Add your degrees, certifications, GitHub projects, and highlight foundational computer science concepts.</p>
            </div>
            <div className="space-y-1.5">
              <span className="font-extrabold text-[#2F3542] text-sm block">2. Tailor Your Application</span>
              <p>Highlight your internships and academic projects when applying to junior engineering openings.</p>
            </div>
            <div className="space-y-1.5">
              <span className="font-extrabold text-[#2F3542] text-sm block">3. Direct Recruiter Matching</span>
              <p>Applications reach verified company recruiters directly with instant status progression notifications.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


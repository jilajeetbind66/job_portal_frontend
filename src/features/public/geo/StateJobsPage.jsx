import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin,
  Building2,
  Sparkles,
  ArrowRight,
  Briefcase,
  ChevronRight,
  GraduationCap,
  Laptop,
  CheckCircle2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchJobs } from '@/features/public/api/jobs'
import Breadcrumbs from '@/components/Breadcrumbs'
import SEO from '@/components/SEO'
import Button from '@/components/Button'
import { getRegionBySlug, STANDARD_JOB_CATEGORIES } from '@/data/geoIndia'
import { createBreadcrumbSchema } from '@/utils/schema'

export default function StateJobsPage() {
  const { stateSlug } = useParams()
  const region = getRegionBySlug(stateSlug || 'uttar-pradesh')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all')

  const stateName = region?.name || 'Uttar Pradesh'
  const isUP = region?.slug === 'uttar-pradesh'

  // Fetch jobs filtered by location or generic
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['state-jobs', stateName, activeCategoryFilter],
    queryFn: () =>
      fetchJobs({
        perPage: 6,
        ...(activeCategoryFilter === 'remote' ? { work_mode: 'remote' } : {}),
      }),
  })

  const jobs = jobsData?.data ?? []

  const canonicalPath = `/jobs-in-${region?.slug || stateSlug}`
  const breadcrumbItems = [
    { label: 'Jobs in India', to: '/jobs-in-india' },
    { label: `Jobs in ${stateName}`, to: canonicalPath },
  ]

  return (
    <div className="w-full bg-[#07151A] text-[#F7F8F5] min-h-screen pb-20">
      <SEO
        title={`Jobs in ${stateName} – Verified IT, Fresher & Corporate Vacancies | Vcreateventures`}
        description={`Find active jobs in ${stateName}. Explore IT, software engineering, fresher, internship, and remote positions across ${stateName} cities verified by Vcreateventures.`}
        canonical={canonicalPath}
        schema={createBreadcrumbSchema(breadcrumbItems)}
      />
      {/* Header & Hero */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-10">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-4 bg-[#0D2224] border border-[#294341] rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6A8E7F]/15 border border-[#6A8E7F]/30 text-[#6A8E7F] text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              {region?.type === 'ut' ? 'Union Territory Directory' : 'State Employment Hub'} ({region?.code})
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#2F3542] leading-tight">
              Jobs in <span className="text-[#6A8E7F]">{stateName}</span>
            </h1>

            <p className="text-sm sm:text-base text-[#747D8C] leading-relaxed font-medium">
              Explore verified private, IT, software engineering, fresher, internship, and remote job vacancies in {stateName}. Vcreateventures connects talented candidates directly with verified hiring partners across major industrial and technology hubs.
            </p>

            {/* Quick Filter Tabs */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
              {[
                { id: 'all', label: `All ${stateName} Jobs` },
                { id: 'fresher', label: 'Fresher Jobs' },
                { id: 'it', label: 'IT & Software Roles' },
                { id: 'internship', label: 'Internships' },
                { id: 'remote', label: 'Remote / Work From Home' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategoryFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    activeCategoryFilter === tab.id
                      ? 'bg-[#6A8E7F] text-white shadow-2xs'
                      : 'bg-white text-[#2F3542] border border-[#CED6E0] hover:bg-[#BFEDC1]/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Special Uttar Pradesh Focus: Prayagraj Spotlight */}
      {isUP && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-white to-[#BFEDC1]/40 border-2 border-[#6A8E7F] rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6A8E7F] text-white text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                Highest Priority Local Hub
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2F3542]">
                Explore Verified Jobs in Prayagraj (Allahabad)
              </h2>
              <p className="text-xs sm:text-sm text-[#747D8C] leading-relaxed">
                Prayagraj hosts leading educational institutions (IIIT Allahabad, MNNIT) and burgeoning software development firms in Civil Lines, Naini, Jhalwa, and Phaphamau. Explore tailored listings for software engineers, freshers, and remote talent.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs">
                <Link to="/jobs-in-prayagraj/software-developer" className="bg-white px-2.5 py-1 rounded-lg border border-[#CED6E0] font-semibold text-[#2F3542] hover:border-[#6A8E7F]">
                  Software Developer
                </Link>
                <Link to="/jobs-in-prayagraj/fresher-jobs" className="bg-white px-2.5 py-1 rounded-lg border border-[#CED6E0] font-semibold text-[#2F3542] hover:border-[#6A8E7F]">
                  Fresher Jobs
                </Link>
                <Link to="/jobs-in-prayagraj/internships" className="bg-white px-2.5 py-1 rounded-lg border border-[#CED6E0] font-semibold text-[#2F3542] hover:border-[#6A8E7F]">
                  Tech Internships
                </Link>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              as={Link}
              to="/jobs-in-prayagraj"
              className="shrink-0 px-6 py-3 font-bold"
            >
              Visit Prayagraj Hub <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </section>
      )}

      {/* Directory of Cities in the State */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">INTERNAL GEOGRAPHIC LINKS</span>
          <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
            Cities in {stateName} ({region?.majorCities.length || 0} Cities)
          </h2>
          <p className="text-xs text-[#747D8C] mt-1">
            Browse verified job vacancies by city across {stateName}.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {(region?.majorCities || []).map((city) => {
            const citySlug = city.toLowerCase().replace(/\s+/g, '-')
            const isSpecialCity = city === 'Prayagraj'

            return (
              <Link
                key={city}
                to={`/jobs-in-${citySlug}`}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSpecialCity
                    ? 'bg-[#BFEDC1]/60 border-[#6A8E7F] font-bold text-[#2F3542] shadow-xs'
                    : 'bg-white border-[#CED6E0] hover:border-[#6A8E7F] hover:bg-[#E0ECE1] text-[#2F3542] text-xs font-semibold'
                }`}
              >
                <div className="truncate">
                  {city} {isSpecialCity && '⭐'}
                </div>
                <div className="text-[10px] text-[#747D8C] mt-0.5">
                  Jobs in {city}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Popular Job Categories for State */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">ROLES &amp; SPECIALIZATIONS</span>
          <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
            Top Job Categories in {stateName}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {STANDARD_JOB_CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              to={`/jobs?search=${encodeURIComponent(cat.shortTitle)}&location=${encodeURIComponent(stateName)}`}
              className="bg-white border border-[#CED6E0] hover:border-[#6A8E7F] p-4 rounded-xl transition-all group flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-[#2F3542] group-hover:text-[#6A8E7F] transition-colors">
                  {cat.title}
                </h4>
                <p className="text-xs text-[#747D8C] mt-0.5">
                  {stateName} Openings
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-[#747D8C] group-hover:text-[#6A8E7F] group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* Live State Job Listings */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">AVAILABLE POSITIONS</span>
            <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
              Latest Openings in {stateName}
            </h2>
          </div>
          <Link
            to={`/jobs?location=${encodeURIComponent(stateName)}`}
            className="text-xs font-bold text-[#6A8E7F] hover:underline flex items-center gap-1"
          >
            All {stateName} Listings <ArrowRight className="w-3.5 h-3.5" />
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
                <h4 className="text-base font-bold text-[#2F3542] line-clamp-1">
                  <Link to={`/jobs/${job.slug}`} className="hover:text-[#6A8E7F]">
                    {job.title}
                  </Link>
                </h4>
                <div className="flex items-center gap-1 text-xs text-[#747D8C] mt-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#2F3542]">
                  ₹{(job.salary_min / 100000).toFixed(0)}L – ₹{(job.salary_max / 100000).toFixed(0)}L
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

      {/* State FAQs */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-[#CED6E0] rounded-3xl p-8 sm:p-10 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2F3542] mb-6">
            Frequently Asked Questions — Jobs in {stateName}
          </h2>

          <div className="space-y-5 text-sm">
            <div>
              <h3 className="font-bold text-[#2F3542]">What types of jobs are currently hiring in {stateName}?</h3>
              <p className="text-[#747D8C] mt-1 leading-relaxed">
                Hiring across {stateName} spans IT software development, data analytics, product management, sales, customer operations, and manufacturing engineering. Additionally, remote-first technology roles allow professionals to work from anywhere in {stateName}.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#2F3542]">How do I apply for jobs in {stateName} via Vcreateventures?</h3>
              <p className="text-[#747D8C] mt-1 leading-relaxed">
                Browse our verified {stateName} listings, filter by your preferred city or work mode (Remote / Hybrid / On-Site), and submit your application with your Vcreateventures profile and resume directly to partner recruiters.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


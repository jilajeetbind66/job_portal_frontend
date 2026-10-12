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
  Info,
  CheckCircle2,
  DollarSign,
  Compass,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchJobs } from '@/features/public/api/jobs'
import Breadcrumbs from '@/components/Breadcrumbs'
import SEO from '@/components/SEO'
import Button from '@/components/Button'
import { getCityDetails, PRAYAGRAJ_PROFILE } from '@/data/geoIndia'
import { createBreadcrumbSchema } from '@/utils/schema'

export default function CityJobsPage() {
  const { citySlug = 'prayagraj', stateSlug } = useParams()
  const city = getCityDetails(citySlug, stateSlug)
  const isPrayagraj = city.slug === 'prayagraj'
  const isAllahabadQuery = citySlug.toLowerCase().includes('allahabad')

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all')

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['city-jobs', city.name, activeCategoryFilter],
    queryFn: () =>
      fetchJobs({
        perPage: 6,
        ...(activeCategoryFilter === 'remote' ? { work_mode: 'remote' } : {}),
      }),
  })

  const jobs = jobsData?.data ?? []

  const canonicalPath = `/jobs-in-${city.slug}`
  const breadcrumbItems = [
    { label: 'Jobs in India', to: '/jobs-in-india' },
    { label: city.state, to: `/jobs-in-${city.stateSlug}` },
    { label: `Jobs in ${city.name}`, to: canonicalPath },
  ]

  const seoTitle = isPrayagraj
    ? 'Jobs in Prayagraj – IT, Software & Fresher Jobs in Allahabad UP | Vcreateventures'
    : `Jobs in ${city.name} – Verified Vacancies in ${city.state} | Vcreateventures`

  const seoDescription = isPrayagraj
    ? 'Find verified jobs in Prayagraj (Allahabad). Explore IT, software developer, fresher jobs, private roles, internships, and remote jobs for Prayagraj candidates on Vcreateventures.'
    : `Explore verified IT, corporate, fresher, and remote job vacancies in ${city.name}, ${city.state} on Vcreateventures.`

  return (
    <div className="w-full bg-[#07151A] text-[#F7F8F5] min-h-screen pb-20">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonicalPath}
        schema={createBreadcrumbSchema(breadcrumbItems)}
      />

      {/* Hero & SEO Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-10">
        <Breadcrumbs items={breadcrumbItems} />

        {/* Alias Notice for Allahabad / Prayagraj */}
        {(isPrayagraj || isAllahabadQuery) && (
          <div className="mt-3 mb-4 p-4 rounded-2xl bg-[#0D2224] border border-[#294341] flex items-center gap-3 text-xs text-[#F7F8F5]">
            <Info className="w-5 h-5 text-[#2F7D5B] shrink-0" />
            <div>
              <span className="font-bold text-[#D6A84F]">Historical &amp; Geographic Alias:</span> Prayagraj was formerly known as Allahabad. All job listings, tech recruiter networks, and salary insights below cover both <strong>Prayagraj and Allahabad</strong>. Canonical index: <code>/jobs-in-prayagraj</code>.
            </div>
          </div>
        )}

        <div className="bg-[#0D2224] border border-[#294341] rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6A8E7F]/15 border border-[#6A8E7F]/30 text-[#6A8E7F] text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              {isPrayagraj ? 'Highest Priority Local Market ⭐' : 'City Recruitment Center'} ({city.stateCode})
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#2F3542] leading-tight">
              Jobs in <span className="text-[#6A8E7F]">{city.name}</span>
            </h1>

            <p className="text-sm sm:text-base text-[#747D8C] leading-relaxed font-medium">
              {city.description}
            </p>

            {/* Quick Filters */}
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-semibold">
              {[
                { id: 'all', label: `All ${city.name} Jobs` },
                { id: 'fresher', label: 'Fresher Openings' },
                { id: 'it', label: 'Software / IT Roles' },
                { id: 'internship', label: 'Internships' },
                { id: 'remote', label: 'Remote from ' + city.name },
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

      {/* Prayagraj Priority Local Hiring Hubs */}
      {isPrayagraj && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">LOCAL DISTRICT INTELLIGENCE</span>
            <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
              Major Hiring Hubs in Prayagraj
            </h2>
            <p className="text-xs text-[#747D8C] mt-1">
              Key commercial zones and technology clusters hosting verified employers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRAYAGRAJ_PROFILE.hiringHubs.map((hub) => (
              <div
                key={hub.name}
                className="bg-white border border-[#CED6E0] hover:border-[#6A8E7F] p-5 rounded-2xl shadow-2xs transition-all space-y-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#BFEDC1]/50 text-[#6A8E7F] flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-[#2F3542]">{hub.name}</h3>
                </div>
                <p className="text-xs text-[#747D8C] leading-relaxed">
                  {hub.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Job Categories in City */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">TARGETED VACANCIES</span>
            <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
              Job Categories in {city.name}
            </h2>
            <p className="text-xs text-[#747D8C] mt-1">
              Direct SEO index for specific engineering, IT, fresher, and operational roles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {(city.popularCategories || []).map((cat) => (
            <Link
              key={cat.slug}
              to={`/jobs-in-${city.slug}/${cat.slug}`}
              className="bg-white border border-[#CED6E0] hover:border-[#6A8E7F] hover:shadow-xs p-4 rounded-xl transition-all group flex items-center justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-[#2F3542] group-hover:text-[#6A8E7F] transition-colors">
                  {cat.title}
                </h3>
                <span className="text-xs text-[#747D8C] mt-0.5 inline-block">
                  {cat.count ? `${cat.count} verified openings` : `Explore openings in ${city.name}`}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#747D8C] group-hover:text-[#6A8E7F] group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </section>

      {/* Live Job Openings List */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">VERIFIED LISTINGS</span>
            <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
              Active Vacancies in {city.name}
            </h2>
          </div>
          <Link
            to={`/jobs?location=${encodeURIComponent(city.name)}`}
            className="text-xs font-bold text-[#6A8E7F] hover:underline flex items-center gap-1"
          >
            All {city.name} Listings <ArrowRight className="w-3.5 h-3.5" />
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
                  <span>{city.name}, {city.stateCode}</span>
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

      {/* Nearby Cities / Commuter & Regional Network */}
      {city.nearbyCities && city.nearbyCities.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">REGIONAL TALENT NETWORK</span>
            <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
              Jobs in Cities Near {city.name}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {city.nearbyCities.map((nc) => (
              <Link
                key={nc.name}
                to={`/jobs-in-${nc.slug}`}
                className="bg-white border border-[#CED6E0] hover:border-[#6A8E7F] p-3 rounded-xl text-center text-xs transition-all hover:bg-[#BFEDC1]/20"
              >
                <div className="font-bold text-[#2F3542]">{nc.name}</div>
                {nc.distance && (
                  <div className="text-[10px] text-[#747D8C] mt-0.5">{nc.distance}</div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Local SEO FAQs */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-[#CED6E0] rounded-3xl p-8 sm:p-10 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2F3542] mb-6">
            Frequently Asked Questions — Jobs in {city.name}
          </h2>

          <div className="space-y-5 text-sm">
            {(city.faqs || []).map((faq, i) => (
              <div key={i}>
                <h3 className="font-bold text-[#2F3542]">{faq.q}</h3>
                <p className="text-[#747D8C] mt-1 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


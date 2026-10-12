import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Building2,
  Search,
  Sparkles,
  ArrowRight,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchJobs } from '@/features/public/api/jobs'
import Breadcrumbs from '@/components/Breadcrumbs'
import SEO from '@/components/SEO'
import Button from '@/components/Button'
import { INDIAN_STATES, UNION_TERRITORIES } from '@/data/geoIndia'
import { createBreadcrumbSchema } from '@/utils/schema'

export default function JobsInIndiaPage() {
  const [searchFilter, setSearchFilter] = useState('')

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['india-jobs-overview'],
    queryFn: () => fetchJobs({ perPage: 6 }),
  })

  const jobs = jobsData?.data ?? []

  const filteredStates = INDIAN_STATES.filter((s) =>
    s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    s.majorCities.some((c) => c.toLowerCase().includes(searchFilter.toLowerCase()))
  )

  const filteredUTs = UNION_TERRITORIES.filter((u) =>
    u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.majorCities.some((c) => c.toLowerCase().includes(searchFilter.toLowerCase()))
  )

  const breadcrumbItems = [
    { label: 'Jobs in India', to: '/jobs-in-india' },
  ]

  return (
    <div className="w-full bg-[#07151A] text-[#F7F8F5] min-h-screen pb-20">
      <SEO
        title="Jobs in India – Explore Verified Openings Across 28 States & 8 UTs | Vcreateventures"
        description="Search verified jobs in India across all 28 states and 8 union territories. Explore high-growth tech hubs, remote positions, and corporate roles on Vcreateventures."
        canonical="/jobs-in-india"
        schema={createBreadcrumbSchema(breadcrumbItems)}
      />
      {/* Hero & SEO Header */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-12">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="mt-4 bg-[#0D2224] border border-[#294341] rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#102A2B] border border-[#294341] text-[#B9D8C4] text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#2F7D5B]" />
              Pan-India Geographic Directory
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F7F8F5] leading-tight">
              Jobs in India — <span className="text-[#B9D8C4]">All 28 States &amp; 8 UTs</span>
            </h1>

            <p className="text-sm sm:text-base text-[#91A6A0] leading-relaxed font-medium">
              Find verified career openings across India’s thriving technological, industrial, and commercial centers. From Tier-1 metros to emerging Tier-2 tech hubs like Prayagraj, explore authentic local and remote opportunities verified by Vcreateventures hiring partners.
            </p>

            {/* Quick State/City Filter Input */}
            <div className="pt-2 max-w-md">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-[#747D8C]" />
                <input
                  type="text"
                  placeholder="Filter states, union territories, or cities..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-[#CED6E0] rounded-xl text-sm font-medium focus:outline-none focus:border-[#6A8E7F] shadow-2xs"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Priority Focus Markets: Uttar Pradesh & Prayagraj */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">FEATURED REGIONAL MARKETS</span>
            <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">High-Priority Growth Markets</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Uttar Pradesh Focus Card */}
          <div className="bg-white border-2 border-[#6A8E7F]/30 hover:border-[#6A8E7F] rounded-2xl p-7 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#BFEDC1] text-[#6A8E7F] text-xs font-extrabold">
                  State Focus: Uttar Pradesh (UP)
                </span>
                <span className="text-xs font-semibold text-[#747D8C]">50+ Cities</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#2F3542]">Jobs in Uttar Pradesh</h3>
              <p className="text-xs sm:text-sm text-[#747D8C] leading-relaxed">
                Explore tech careers in Lucknow, Noida, Greater Noida, Kanpur, Varanasi, Agra, and across 45+ districts. Uttar Pradesh represents one of India’s fastest-growing tech and digital talent corridors.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
                {['Lucknow', 'Noida', 'Prayagraj', 'Varanasi', 'Kanpur', 'Agra'].map((city) => (
                  <Link
                    key={city}
                    to={`/jobs-in-${city.toLowerCase().replace(/\s+/g, '-')}`}
                    className="px-2.5 py-1 bg-[#E0ECE1] hover:bg-[#BFEDC1] text-[#2F3542] rounded-lg font-semibold transition-colors"
                  >
                    {city}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#CED6E0]/60 flex items-center justify-between">
              <span className="text-xs text-[#747D8C]">Direct UP Directory</span>
              <Button variant="primary" size="sm" as={Link} to="/jobs-in-uttar-pradesh">
                Explore Uttar Pradesh Jobs <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Prayagraj Focus Card */}
          <div className="bg-gradient-to-br from-white to-[#BFEDC1]/30 border-2 border-[#6A8E7F] rounded-2xl p-7 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#6A8E7F] text-white text-xs font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Highest Priority Local SEO Hub
                </span>
                <span className="text-xs font-bold text-[#6A8E7F]">Allahabad Index</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#2F3542]">Jobs in Prayagraj</h3>
              <p className="text-xs sm:text-sm text-[#747D8C] leading-relaxed">
                Dedicated local tech ecosystem powered by premier institutes (IIIT Allahabad, MNNIT). Prominent hiring in Civil Lines, Naini, Jhalwa, and Phaphamau for software developers, freshers, and remote teams.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
                <Link to="/jobs-in-prayagraj/software-developer" className="px-2.5 py-1 bg-white border border-[#CED6E0] text-[#2F3542] rounded-lg font-semibold hover:border-[#6A8E7F]">
                  Software Developer
                </Link>
                <Link to="/jobs-in-prayagraj/fresher-jobs" className="px-2.5 py-1 bg-white border border-[#CED6E0] text-[#2F3542] rounded-lg font-semibold hover:border-[#6A8E7F]">
                  Fresher Jobs
                </Link>
                <Link to="/jobs-in-prayagraj/react-developer" className="px-2.5 py-1 bg-white border border-[#CED6E0] text-[#2F3542] rounded-lg font-semibold hover:border-[#6A8E7F]">
                  React Developer
                </Link>
                <Link to="/jobs-in-prayagraj/internships" className="px-2.5 py-1 bg-white border border-[#CED6E0] text-[#2F3542] rounded-lg font-semibold hover:border-[#6A8E7F]">
                  Internships
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-[#CED6E0]/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#6A8E7F]">Verified Local Portal</span>
              <Button variant="primary" size="sm" as={Link} to="/jobs-in-prayagraj">
                View Prayagraj Hub <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Directory of 28 States */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">COMPLETE REGIONAL ARCHITECTURE</span>
          <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
            All 28 Indian States ({filteredStates.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStates.map((state) => (
            <Link
              key={state.slug}
              to={`/jobs-in-${state.slug}`}
              className="bg-white border border-[#CED6E0] hover:border-[#6A8E7F] hover:shadow-xs p-4 rounded-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#747D8C] uppercase tracking-wider">{state.code}</span>
                  {state.isPriority && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-[#BFEDC1] text-[#6A8E7F] rounded">
                      PRIORITY
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-[#2F3542] group-hover:text-[#6A8E7F] transition-colors mt-1">
                  Jobs in {state.name}
                </h3>
                <p className="text-xs text-[#747D8C] mt-1 line-clamp-1">
                  {state.majorCities.slice(0, 3).join(', ')}...
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#6A8E7F]">
                <span>View {state.majorCities.length} Cities</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Directory of 8 Union Territories */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">CENTRAL JURISDICTIONS</span>
          <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
            Union Territories ({filteredUTs.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filteredUTs.map((ut) => (
            <Link
              key={ut.slug}
              to={`/jobs-in-${ut.slug}`}
              className="bg-white border border-[#CED6E0] hover:border-[#6A8E7F] hover:shadow-xs p-4 rounded-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#747D8C] uppercase tracking-wider">{ut.code}</span>
                  {ut.isPriority && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-[#BFEDC1] text-[#6A8E7F] rounded">
                      NATIONAL CAPITAL
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-[#2F3542] group-hover:text-[#6A8E7F] transition-colors mt-1">
                  Jobs in {ut.name}
                </h3>
                <p className="text-xs text-[#747D8C] mt-1">
                  Capital: {ut.capital}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#6A8E7F]">
                <span>Explore Openings</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Jobs Across India */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">LIVE VACANCIES</span>
            <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">Latest Indian Opportunities</h2>
          </div>
          <Link to="/jobs" className="text-xs font-bold text-[#6A8E7F] hover:underline flex items-center gap-1">
            Browse All Jobs <ArrowRight className="w-3.5 h-3.5" />
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
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pan-India FAQs for Google SEO */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-[#CED6E0] rounded-3xl p-8 sm:p-10 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2F3542] mb-6">
            Frequently Asked Questions — Jobs in India
          </h2>

          <div className="space-y-5 text-sm">
            <div>
              <h3 className="font-bold text-[#2F3542]">How does Vcreateventures cover Indian job markets?</h3>
              <p className="text-[#747D8C] mt-1 leading-relaxed">
                Vcreateventures maintains a verified geographic SEO architecture mapping opportunities down to state, union territory, and individual city levels across all 28 Indian states, ensuring authentic local and remote listings without thin doorway pages.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[#2F3542]">Which cities are prioritized for tech and software hiring?</h3>
              <p className="text-[#747D8C] mt-1 leading-relaxed">
                Alongside national technology metros such as Bengaluru, Hyderabad, Pune, and Delhi NCR, Vcreateventures places highest priority on high-potential regional corridors like Prayagraj, Lucknow, and Noida in Uttar Pradesh.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


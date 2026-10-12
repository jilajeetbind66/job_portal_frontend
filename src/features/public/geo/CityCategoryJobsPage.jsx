import React from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin,
  Building2,
  Sparkles,
  ArrowRight,
  Briefcase,
  ChevronRight,
  DollarSign,
  GraduationCap,
  Layers,
  Code2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchJobs } from '@/features/public/api/jobs'
import Breadcrumbs from '@/components/Breadcrumbs'
import SEO from '@/components/SEO'
import Button from '@/components/Button'
import { getCityDetails, STANDARD_JOB_CATEGORIES } from '@/data/geoIndia'
import { createBreadcrumbSchema } from '@/utils/schema'

export default function CityCategoryJobsPage() {
  const { citySlug = 'prayagraj', categorySlug } = useParams()
  const city = getCityDetails(citySlug)

  const category =
    STANDARD_JOB_CATEGORIES.find((c) => c.slug === categorySlug) || {
      slug: categorySlug,
      title: categorySlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ') + ' Jobs',
      shortTitle: categorySlug
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' '),
      keywords: [categorySlug],
    }

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['city-category-jobs', city.name, category.slug],
    queryFn: () =>
      fetchJobs({
        perPage: 6,
        search: category.shortTitle,
      }),
  })

  const jobs = jobsData?.data ?? []

  const canonicalPath = `/jobs-in-${city.slug}/${category.slug}`
  const breadcrumbItems = [
    { label: 'Jobs in India', to: '/jobs-in-india' },
    { label: city.state, to: `/jobs-in-${city.stateSlug}` },
    { label: `Jobs in ${city.name}`, to: `/jobs-in-${city.slug}` },
    { label: category.title, to: canonicalPath },
  ]

  const seoTitle = `${category.title} in ${city.name} | Vcreateventures`
  const seoDescription = `Find verified ${category.title.toLowerCase()} in ${city.name}, ${city.state}. Explore junior, senior, and remote roles on Vcreateventures.`

  return (
    <div className="w-full bg-[#07151A] text-[#F7F8F5] min-h-screen pb-20">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={canonicalPath}
        schema={createBreadcrumbSchema(breadcrumbItems)}
      />

      {/* Header & Hero */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-10">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="bg-[#0D2224] border border-[#294341] rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6A8E7F]/15 border border-[#6A8E7F]/30 text-[#6A8E7F] text-xs font-bold uppercase tracking-wider">
              <Code2 className="w-3.5 h-3.5" />
              {category.shortTitle} • {city.name}, {city.stateCode}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#2F3542] leading-tight">
              {category.title} in <span className="text-[#6A8E7F]">{city.name}</span>
            </h1>

            <p className="text-sm sm:text-base text-[#747D8C] leading-relaxed font-medium">
              Discover verified {category.title.toLowerCase()} in {city.name}, {city.state}. Explore positions from junior and entry-level freshers to senior specialists across tech companies, startups, and remote teams.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                variant="primary"
                size="md"
                as={Link}
                to={`/jobs?search=${encodeURIComponent(category.shortTitle)}&location=${encodeURIComponent(city.name)}`}
              >
                Apply to All Openings <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="md"
                as={Link}
                to={`/jobs-in-${city.slug}`}
              >
                All {city.name} Roles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Salary & Hiring Guide for this role */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="bg-white border border-[#CED6E0] rounded-2xl p-6 shadow-2xs">
          <h2 className="text-lg font-bold text-[#2F3542] mb-3">
            Hiring &amp; Salary Insights for {category.shortTitle} in {city.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#747D8C]">
            <div className="p-4 rounded-xl bg-[#E0ECE1] space-y-1">
              <span className="font-extrabold text-[#2F3542] text-sm">Entry / Fresher Range</span>
              <p className="text-[#2F3542] font-semibold text-base">₹3.5L – ₹6.5L / yr</p>
              <p>Ideal for recent graduates and candidates with 0-2 years experience.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#E0ECE1] space-y-1">
              <span className="font-extrabold text-[#2F3542] text-sm">Mid to Senior Level</span>
              <p className="text-[#2F3542] font-semibold text-base">₹8L – ₹18L+ / yr</p>
              <p>For skilled engineers leading projects or full-stack architectures.</p>
            </div>
            <div className="p-4 rounded-xl bg-[#E0ECE1] space-y-1">
              <span className="font-extrabold text-[#2F3542] text-sm">Remote Product Roles</span>
              <p className="text-[#2F3542] font-semibold text-base">₹14L – ₹30L+ / yr</p>
              <p>National/Global tech companies hiring remote engineers living in {city.name}.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Matching Job Listings */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">AVAILABLE ROLES</span>
            <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
              Current {category.shortTitle} Openings
            </h2>
          </div>
          <Link
            to={`/jobs?search=${encodeURIComponent(category.shortTitle)}`}
            className="text-xs font-bold text-[#6A8E7F] hover:underline flex items-center gap-1"
          >
            All Matching Jobs <ArrowRight className="w-3.5 h-3.5" />
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

      {/* Sibling Categories in this City */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6A8E7F]">RELATED SPECIALIZATIONS</span>
          <h2 className="text-2xl font-extrabold text-[#2F3542] mt-0.5">
            More Job Categories in {city.name}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {STANDARD_JOB_CATEGORIES.filter((c) => c.slug !== category.slug).map((c) => (
            <Link
              key={c.slug}
              to={`/jobs-in-${city.slug}/${c.slug}`}
              className="bg-white border border-[#CED6E0] hover:border-[#6A8E7F] p-3 rounded-xl text-center text-xs transition-all hover:bg-[#BFEDC1]/20 font-semibold text-[#2F3542]"
            >
              {c.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}


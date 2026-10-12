import React from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Briefcase,
  MapPin,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchJobs } from '@/features/public/api/jobs'
import { SEO, Breadcrumbs, Button } from '@/components'
import { getCategoryBySlug, NATIONAL_JOB_CATEGORIES } from '@/data/categories'
import { createBreadcrumbSchema } from '@/utils/schema'

export default function CategoryJobsPage() {
  const { categorySlug, slug } = useParams()
  const rawSlug = categorySlug || slug || 'software-development'
  const category = getCategoryBySlug(rawSlug) || {
    slug: rawSlug,
    title: rawSlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') + ' Jobs',
    h1: rawSlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ') + ' Jobs in India',
    shortTitle: rawSlug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' '),
    intro: `Explore verified ${rawSlug.replace(/-/g, ' ')} job opportunities in India across top tech companies, startups, and remote teams on Vcreateventures.`,
    avgSalary: '₹5L – ₹25L LPA',
    topLocations: ['Bangalore', 'Hyderabad', 'Prayagraj', 'Noida', 'Pune', 'Remote'],
  }

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['category-jobs-landing', category.slug],
    queryFn: () =>
      fetchJobs({
        perPage: 6,
        search: category.shortTitle,
        ...(category.slug === 'remote-jobs' ? { work_mode: 'remote' } : {}),
        ...(category.slug === 'internships' ? { employment_type: 'internship' } : {}),
      }),
  })

  const jobs = jobsData?.data ?? []

  const breadcrumbs = [
    { label: 'Jobs in India', to: '/jobs-in-india' },
    { label: category.title },
  ]

  const relatedCategories = NATIONAL_JOB_CATEGORIES.filter(
    (c) => c.slug !== category.slug
  ).slice(0, 8)

  return (
    <div className="w-full bg-[#07151A] text-[#F7F8F5] min-h-screen pb-20">
      <SEO
        title={`${category.title} – Verified Openings in India | Vcreateventures`}
        description={category.intro}
        canonical={`/jobs/${category.slug}`}
        schema={createBreadcrumbSchema(breadcrumbs)}
      />

      {/* Hero & SEO Intro */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-10">
        <Breadcrumbs items={breadcrumbs} className="mb-4" />

        <div className="bg-[#0D2224] border border-[#294341] rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#102A2B] border border-[#294341] text-[#B9D8C4] text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-[#2F7D5B]" />
              Verified Specialization Hub
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F7F8F5] leading-tight">
              {category.h1}
            </h1>

            <p className="text-sm sm:text-base text-[#91A6A0] leading-relaxed font-medium">
              {category.intro}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#91A6A0]">
              <span className="px-3 py-1.5 bg-[#102A2B] rounded-xl border border-[#294341] text-[#F7F8F5]">
                Average Compensation: <strong className="text-[#D6A84F]">{category.avgSalary}</strong>
              </span>
              <span className="px-3 py-1.5 bg-[#102A2B] rounded-xl border border-[#294341] text-[#B9D8C4]">
                Verified Hiring Partners
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Live Matching Job Listings */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#8FAF9A]">ACTIVE INVENTORY</span>
            <h2 className="text-2xl font-extrabold text-[#F7F8F5] mt-0.5">
              Current {category.shortTitle} Openings
            </h2>
          </div>
          <Link
            to={`/jobs?search=${encodeURIComponent(category.shortTitle)}`}
            className="text-xs font-bold text-[#D6A84F] hover:underline flex items-center gap-1"
          >
            Explore All Results <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.slice(0, 6).map((job) => (
            <div
              key={job.id}
              className="bg-[#0D2224] border border-[#294341] hover:border-[#8FAF9A] hover:bg-[#102A2B] rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#91A6A0] mb-1">
                  <span className="font-bold text-[#B9D8C4] uppercase">{job.company_name}</span>
                  <span className="capitalize">{job.workplace_type?.replace('_', ' ')}</span>
                </div>
                <h3 className="text-base font-bold text-[#F7F8F5] line-clamp-1">
                  <Link to={`/jobs/${job.slug}`} className="hover:text-[#B9D8C4]">
                    {job.title}
                  </Link>
                </h3>
                <div className="flex items-center gap-1 text-xs text-[#91A6A0] mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#8FAF9A]" />
                  <span>{job.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#294341] flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#D6A84F]">
                  ₹{(job.salary_min / 100000).toFixed(0)}L – ₹{(job.salary_max / 100000).toFixed(0)}L
                </span>
                <Link
                  to={`/jobs/${job.slug}`}
                  className="font-bold text-[#B9D8C4] hover:text-white"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Hiring Hubs for this Category */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-14">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8FAF9A]">LOCATION INDEX</span>
          <h2 className="text-2xl font-extrabold text-[#F7F8F5] mt-0.5">
            Top Cities Hiring for {category.shortTitle}
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {(category.topLocations || []).map((loc) => {
            const locSlug = loc.toLowerCase().replace(/\s+/g, '-')
            return (
              <Link
                key={loc}
                to={loc === 'Prayagraj' ? `/jobs-in-prayagraj/${category.slug}` : `/jobs-in-${locSlug}`}
                className="bg-[#0D2224] border border-[#294341] hover:border-[#8FAF9A] p-3 rounded-xl text-center text-xs font-bold text-[#F7F8F5] hover:bg-[#102A2B] transition-all"
              >
                <div>{loc}</div>
                <div className="text-[10px] text-[#91A6A0] font-normal mt-0.5">
                  {loc === 'Prayagraj' ? 'Priority Hub ⭐' : 'Explore Openings'}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Related Categories */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#8FAF9A]">RELATED DISCIPLINES</span>
          <h2 className="text-2xl font-extrabold text-[#F7F8F5] mt-0.5">
            Related Job Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {relatedCategories.map((rc) => (
            <Link
              key={rc.slug}
              to={`/jobs/${rc.slug}`}
              className="bg-[#0D2224] border border-[#294341] hover:border-[#8FAF9A] p-3.5 rounded-xl text-xs font-semibold text-[#F7F8F5] hover:bg-[#102A2B] transition-all flex items-center justify-between group"
            >
              <span>{rc.title}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#91A6A0] group-hover:text-[#B9D8C4]" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

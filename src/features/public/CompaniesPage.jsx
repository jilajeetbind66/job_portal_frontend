import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Briefcase, Building2, Search } from 'lucide-react'
import { Button, EmptyState, SEO } from '@/components'
import { fetchCompanies } from './api/jobs'

const PER_PAGE = 12

export default function CompaniesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1)
  const [searchInput, setSearchInput] = useState(search)

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['public', 'companies', search, page],
    queryFn: () => fetchCompanies({ search: search || undefined, page, per_page: PER_PAGE }),
  })

  const companies = data?.data || []
  const meta = data?.meta || { current_page: 1, last_page: 1, total: 0 }

  const submitSearch = (event) => {
    event.preventDefault()
    const params = new URLSearchParams(searchParams)
    const nextSearch = searchInput.trim()

    if (nextSearch) {
      params.set('search', nextSearch)
    } else {
      params.delete('search')
    }
    params.delete('page')
    setSearchParams(params)
  }

  const goToPage = (nextPage) => {
    const params = new URLSearchParams(searchParams)
    if (nextPage === 1) {
      params.delete('page')
    } else {
      params.set('page', String(nextPage))
    }
    setSearchParams(params)
  }

  const clearSearch = () => {
    setSearchInput('')
    setSearchParams(new URLSearchParams())
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-6 lg:px-8">
      <SEO
        title="Browse Hiring Companies | Vcreateventures"
        description="Browse verified hiring companies, learn about their work, and explore current job openings."
        canonical="/companies"
      />

      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-[#D6A84F]">Hiring partners</p>
          <h1 className="text-3xl font-extrabold text-[#F7F8F5]">Browse Companies</h1>
          <p className="mt-2 max-w-xl text-sm text-[#91A6A0]">
            Explore companies that are hiring and view their current opportunities.
          </p>
        </div>

        <form onSubmit={submitSearch} className="flex w-full gap-2 sm:max-w-md">
          <label className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#91A6A0]" />
            <input
              aria-label="Search companies"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Company name or industry"
              className="w-full rounded-xl border border-[#294341] bg-[#0D2224] py-2.5 pl-10 pr-3 text-sm text-[#F7F8F5] placeholder:text-[#91A6A0] focus:border-[#8FAF9A] focus:outline-none"
            />
          </label>
          <Button type="submit" disabled={isFetching}>
            Search
          </Button>
        </form>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-52 animate-pulse rounded-2xl border border-[#294341] bg-[#0D2224]"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-900/50 bg-[#0D2224] px-6 py-12 text-center">
          <p className="text-sm font-semibold text-rose-300">Could not load companies.</p>
          <Button variant="secondary" className="mt-4" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : companies.length === 0 ? (
        <EmptyState
          title="No companies found"
          description={search ? 'Try another company name or industry.' : 'Companies with active job openings will appear here.'}
          action={search ? <Button variant="secondary" onClick={clearSearch}>Clear search</Button> : null}
        />
      ) : (
        <>
          <p className="mb-4 text-xs text-[#91A6A0]">
            {meta.total} {meta.total === 1 ? 'company' : 'companies'} hiring
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <Link
                key={company.id}
                to={`/companies/${company.slug}`}
                className="group flex min-h-56 flex-col rounded-2xl border border-[#294341] bg-[#0D2224] p-5 transition-colors hover:border-[#8FAF9A] hover:bg-[#102A2B]"
              >
                <div className="flex items-start gap-3">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-xl border border-[#294341] object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#294341] bg-[#102A2B] text-[#B9D8C4]">
                      <Building2 className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-bold text-[#F7F8F5] group-hover:text-[#B9D8C4]">
                      {company.name}
                    </h2>
                    {company.industry && (
                      <p className="mt-1 text-xs text-[#91A6A0]">{company.industry}</p>
                    )}
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-[#91A6A0]">
                  {company.description || `${company.name} is hiring through Vcreateventures.`}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-[#294341] pt-4 text-xs">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-[#B9D8C4]">
                    <Briefcase className="h-3.5 w-3.5" />
                    {company.active_jobs_count} active {company.active_jobs_count === 1 ? 'job' : 'jobs'}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#D6A84F]">
                    View profile <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {meta.last_page > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-[#294341] pt-4">
              <p className="text-xs text-[#91A6A0]">
                Page {meta.current_page} of {meta.last_page}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={meta.current_page <= 1 || isFetching}
                  onClick={() => goToPage(meta.current_page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  disabled={meta.current_page >= meta.last_page || isFetching}
                  onClick={() => goToPage(meta.current_page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
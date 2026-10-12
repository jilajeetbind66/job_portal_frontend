import { useState, useEffect } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  Search,
  ArrowLeft,
  FileText,
  Clock,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Award,
  Calendar,
  CheckCircle,
} from 'lucide-react'
import { clsx } from 'clsx'
import { APPLICATION_STATUS } from '@/constants'
import { fetchApplications } from './api/applications'
import { fetchPartnerJob } from './api/jobs'
import ApplicationStatusBadge from './components/ApplicationStatusBadge'
import ApplicationDetailDrawer from './components/ApplicationDetailDrawer'
import ResumeViewerModal from './components/ResumeViewerModal'
import { useDebounce } from '@/hooks/useDebounce'

export default function ApplicantsPage() {
  const { id: jobId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const currentStatus = searchParams.get('status') || 'all'
  const searchParam = searchParams.get('search') || ''
  const pageParam = parseInt(searchParams.get('page') || '1', 10)

  const [searchInput, setSearchInput] = useState(searchParam)
  const debouncedSearch = useDebounce(searchInput, 400)

  // Drawer & Resume Modal State
  const [selectedAppId, setSelectedAppId] = useState(null)
  const [resumeModalData, setResumeModalData] = useState(null)

  // Sync debounced search to URL without infinite loop
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const current = prev.get('search') || ''
        if (debouncedSearch === current) return prev

        const next = new URLSearchParams(prev)
        if (debouncedSearch) {
          next.set('search', debouncedSearch)
          next.set('page', '1')
        } else {
          next.delete('search')
        }
        return next
      },
      { replace: true }
    )
  }, [debouncedSearch, setSearchParams])

  // Optional: fetch job detail if jobId is present
  const { data: jobResponse } = useQuery({
    queryKey: ['partner', 'job', jobId],
    queryFn: () => fetchPartnerJob(jobId),
    enabled: Boolean(jobId),
  })

  const job = jobResponse?.data

  // Fetch applications
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['partner', 'applications', { jobId, status: currentStatus, search: debouncedSearch, page: pageParam }],
    queryFn: () =>
      fetchApplications({
        jobId,
        status: currentStatus,
        search: debouncedSearch,
        page: pageParam,
      }),
  })

  const applications = data?.data || []
  const meta = data?.meta || { current_page: 1, last_page: 1, total: 0, counts: {} }
  const counts = meta.counts || {}

  const handleStatusTab = (status) => {
    const params = new URLSearchParams(searchParams)
    if (status === 'all') {
      params.delete('status')
    } else {
      params.set('status', status)
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Breadcrumb */}
      <div>
        <Link
          to="/partner/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#91A6A0] hover:text-[#F7F8F5] mb-2 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Jobs List
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F8F5]">
              Applicant Tracking (ATS){job ? `: ${job.title}` : ''}
            </h1>
            <p className="mt-1 text-sm text-[#91A6A0]">
              {job
                ? `${job.department} • ${job.location} • Review and move candidates through recruitment stages.`
                : 'Manage talent pipeline, evaluate candidate profiles, and schedule interviews.'}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: 'Total In Pipeline', count: counts.all || 0, color: 'text-[#F7F8F5]' },
          { label: 'Shortlisted', count: counts[APPLICATION_STATUS.SHORTLISTED] || 0, color: 'text-[#E5B866]' },
          { label: 'Interviewing', count: counts[APPLICATION_STATUS.INTERVIEW] || 0, color: 'text-[#E5B866]' },
          { label: 'Offer Stage', count: counts[APPLICATION_STATUS.OFFERED] || 0, color: 'text-[#B9D8C4]' },
          { label: 'Hired 🎉', count: counts[APPLICATION_STATUS.HIRED] || 0, color: 'text-[#B9D8C4]' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-[#294341] bg-[#0D2224] p-4">
            <p className="text-xs font-medium text-[#91A6A0]">{stat.label}</p>
            <p className={clsx('mt-1 text-xl font-bold', stat.color)}>
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Main Filter & Table Card */}
      <div className="rounded-2xl border border-[#294341] bg-[#0D2224] p-5 space-y-4">
        {/* Navigation Tabs & Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[#294341] pb-3 sm:border-b-0 sm:pb-0">
            {[
              { id: 'all', label: 'All' },
              { id: APPLICATION_STATUS.APPLIED, label: 'Applied' },
              { id: APPLICATION_STATUS.SHORTLISTED, label: 'Shortlisted' },
              { id: APPLICATION_STATUS.INTERVIEW, label: 'Interviewing' },
              { id: APPLICATION_STATUS.OFFERED, label: 'Offered' },
              { id: APPLICATION_STATUS.HIRED, label: 'Hired' },
              { id: APPLICATION_STATUS.REJECTED, label: 'Rejected' },
            ].map((tab) => {
              const active = currentStatus === tab.id
              const tabCount = counts[tab.id]
              return (
                <button
                  key={tab.id}
                  onClick={() => handleStatusTab(tab.id)}
                  className={clsx(
                    'flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all',
                    active
                      ? 'bg-[#153536] text-[#B9D8C4] border border-[#294341]'
                      : 'text-[#91A6A0] hover:bg-[#102A2B] hover:text-[#F7F8F5]'
                  )}
                >
                  <span>{tab.label}</span>
                  {tabCount !== undefined && (
                    <span
                      className={clsx(
                        'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                        active ? 'bg-[#2F7D5B] text-[#F7F8F5]' : 'bg-[#102A2B] text-[#91A6A0]'
                      )}
                    >
                      {tabCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#91A6A0]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search candidate, skill, email..."
              className="w-full rounded-xl border border-[#294341] bg-[#102A2B] pl-10 pr-3.5 py-2 text-sm text-[#F7F8F5] placeholder:text-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-xl border border-[#294341]">
          <table className="w-full text-left text-sm text-[#91A6A0]">
            <thead className="bg-[#102A2B] text-xs uppercase tracking-wider text-[#91A6A0]">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Candidate Profile</th>
                <th className="px-4 py-3.5 font-semibold">Experience & Role</th>
                <th className="px-4 py-3.5 font-semibold">Stage Status</th>
                <th className="px-4 py-3.5 font-semibold">Applied On</th>
                <th className="px-4 py-3.5 font-semibold">Resume</th>
                <th className="px-4 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#294341]/60 bg-[#0D2224]">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 w-40 bg-[#102A2B] rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-32 bg-[#102A2B] rounded" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-20 bg-[#102A2B] rounded-full" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-20 bg-[#102A2B] rounded" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-16 bg-[#102A2B] rounded" /></td>
                    <td className="px-4 py-4 text-right"><div className="h-8 w-24 bg-[#102A2B] rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-medium text-rose-400">
                    Failed to load applicants: {error?.message}
                    <div className="mt-2">
                      <button onClick={() => refetch()} className="text-xs text-[#D6A84F] underline">
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#102A2B] text-[#D6A84F] border border-[#294341] mb-3">
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="text-base font-semibold text-[#F7F8F5]">No applicants found</p>
                    <p className="mt-1 text-sm text-[#91A6A0]">
                      {debouncedSearch || currentStatus !== 'all'
                        ? 'Try clearing filters or search keywords.'
                        : 'New candidate applications will appear here as soon as candidates apply.'}
                    </p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const candidate = app.candidate || {}

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-[#153536]/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedAppId(app.id)}
                    >
                      {/* Candidate */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#102A2B] border border-[#294341] font-bold text-sm text-[#D6A84F]">
                            {candidate.name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <p className="font-semibold text-[#F7F8F5] hover:text-[#D6A84F] transition-colors">
                              {candidate.name}
                            </p>
                            <p className="text-xs text-[#91A6A0]">{candidate.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Experience & Title */}
                      <td className="px-4 py-4 text-xs">
                        <p className="font-semibold text-[#F7F8F5]">{candidate.current_title}</p>
                        <p className="mt-0.5 text-[#91A6A0]">
                          {candidate.experience_years} yrs • {candidate.location}
                        </p>
                      </td>

                      {/* Stage Status */}
                      <td className="px-4 py-4">
                        <ApplicationStatusBadge status={app.status} />
                      </td>

                      {/* Applied Date */}
                      <td className="px-4 py-4 text-xs text-[#91A6A0]">
                        {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Resume preview */}
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        {candidate.resume_url ? (
                          <button
                            onClick={() =>
                              setResumeModalData({
                                name: candidate.name,
                                url: candidate.resume_url,
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-[#294341] bg-[#102A2B] px-2.5 py-1 text-xs font-semibold text-[#B9D8C4] hover:border-[#D6A84F] transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            PDF
                          </button>
                        ) : (
                          <span className="text-xs text-[#91A6A0]/40">None</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedAppId(app.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-[#102A2B] border border-[#294341] px-3 py-1.5 text-xs font-semibold text-[#D6A84F] hover:bg-[#153536] hover:text-[#E5B866] transition-colors"
                        >
                          Review & Advance →
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {meta.total > 0 && (
          <div className="flex items-center justify-between border-t border-[#294341] pt-4 text-xs text-[#91A6A0]">
            <p>
              Showing page <span className="font-semibold text-[#F7F8F5]">{meta.current_page}</span> of{' '}
              <span className="font-semibold text-[#F7F8F5]">{meta.last_page}</span> ({meta.total} candidates)
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={meta.current_page <= 1}
                onClick={() => {
                  const p = new URLSearchParams(searchParams)
                  p.set('page', String(meta.current_page - 1))
                  setSearchParams(p)
                }}
                className="rounded-lg border border-[#294341] bg-[#102A2B] px-3 py-1 font-medium text-[#91A6A0] hover:bg-[#153536] hover:text-[#F7F8F5] disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                disabled={meta.current_page >= meta.last_page}
                onClick={() => {
                  const p = new URLSearchParams(searchParams)
                  p.set('page', String(meta.current_page + 1))
                  setSearchParams(p)
                }}
                className="rounded-lg border border-[#294341] bg-[#102A2B] px-3 py-1 font-medium text-[#91A6A0] hover:bg-[#153536] hover:text-[#F7F8F5] disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      <ApplicationDetailDrawer
        applicationId={selectedAppId}
        open={Boolean(selectedAppId)}
        onClose={() => setSelectedAppId(null)}
      />

      {/* Standalone Resume Viewer Modal */}
      {resumeModalData && (
        <ResumeViewerModal
          open={Boolean(resumeModalData)}
          onClose={() => setResumeModalData(null)}
          candidateName={resumeModalData.name}
          resumeUrl={resumeModalData.url}
        />
      )}
    </div>
  )
}

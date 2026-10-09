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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Jobs List
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {job ? `Applicants: ${job.title}` : 'Applicant Tracking (ATS)'}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
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
          { label: 'Total In Pipeline', count: counts.all || 0, color: 'text-slate-700 bg-slate-50' },
          { label: 'Shortlisted', count: counts[APPLICATION_STATUS.SHORTLISTED] || 0, color: 'text-purple-700 bg-purple-50' },
          { label: 'Interviewing', count: counts[APPLICATION_STATUS.INTERVIEW] || 0, color: 'text-amber-700 bg-amber-50' },
          { label: 'Offer Stage', count: counts[APPLICATION_STATUS.OFFERED] || 0, color: 'text-teal-700 bg-teal-50' },
          { label: 'Hired 🎉', count: counts[APPLICATION_STATUS.HIRED] || 0, color: 'text-emerald-700 bg-emerald-50' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            <p className={clsx('mt-1 text-xl font-bold', stat.color.split(' ')[0])}>
              {stat.count}
            </p>
          </div>
        ))}
      </div>

      {/* Main Filter & Table Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        {/* Navigation Tabs & Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-2 sm:border-b-0 sm:pb-0">
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
                    'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  <span>{tab.label}</span>
                  {tabCount !== undefined && (
                    <span
                      className={clsx(
                        'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                        active ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
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
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search candidate, skill, email..."
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Candidate Profile</th>
                <th className="px-4 py-3 font-semibold">Experience & Role</th>
                <th className="px-4 py-3 font-semibold">Stage Status</th>
                <th className="px-4 py-3 font-semibold">Applied On</th>
                <th className="px-4 py-3 font-semibold">Resume</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 w-40 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-20 bg-slate-200 rounded-full" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-16 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4 text-right"><div className="h-8 w-24 bg-slate-200 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-medium text-rose-600">
                    Failed to load applicants: {error?.message}
                    <div className="mt-2">
                      <button onClick={() => refetch()} className="text-xs text-indigo-600 underline">
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="text-base font-semibold text-slate-800">No applicants found</p>
                    <p className="mt-1 text-sm text-slate-500">
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
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => setSelectedAppId(app.id)}
                    >
                      {/* Candidate */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-sm text-indigo-600">
                            {candidate.name?.charAt(0) || 'C'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 hover:text-indigo-600">
                              {candidate.name}
                            </p>
                            <p className="text-xs text-slate-500">{candidate.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Experience & Title */}
                      <td className="px-4 py-4 text-xs">
                        <p className="font-semibold text-slate-800">{candidate.current_title}</p>
                        <p className="mt-0.5 text-slate-500">
                          {candidate.experience_years} yrs • {candidate.location}
                        </p>
                      </td>

                      {/* Stage Status */}
                      <td className="px-4 py-4">
                        <ApplicationStatusBadge status={app.status} />
                      </td>

                      {/* Applied Date */}
                      <td className="px-4 py-4 text-xs text-slate-500">
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
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 shadow-sm"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            PDF
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">None</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedAppId(app.id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
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
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <p>
              Showing page <span className="font-semibold text-slate-700">{meta.current_page}</span> of{' '}
              <span className="font-semibold text-slate-700">{meta.last_page}</span> ({meta.total} candidates)
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={meta.current_page <= 1}
                onClick={() => {
                  const p = new URLSearchParams(searchParams)
                  p.set('page', String(meta.current_page - 1))
                  setSearchParams(p)
                }}
                className="rounded-lg border border-slate-200 px-2.5 py-1 font-medium hover:bg-slate-50 disabled:opacity-40"
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
                className="rounded-lg border border-slate-200 px-2.5 py-1 font-medium hover:bg-slate-50 disabled:opacity-40"
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

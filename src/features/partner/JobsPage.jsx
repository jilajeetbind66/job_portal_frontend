import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Search,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Eye,
  Pencil,
  MoreVertical,
  Trash2,
  Send,
  Lock,
  RotateCcw,
} from 'lucide-react'
import { clsx } from 'clsx'
import { JOB_STATUS } from '@/constants'
import {
  fetchPartnerJobs,
  updatePartnerJobStatus,
  deletePartnerJob,
} from './api/jobs'
import JobStatusBadge from './components/JobStatusBadge'
import { useDebounce } from '@/hooks/useDebounce'

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const currentStatus = searchParams.get('status') || 'all'
  const searchParam = searchParams.get('search') || ''
  const pageParam = parseInt(searchParams.get('page') || '1', 10)

  const [searchInput, setSearchInput] = useState(searchParam)
  const debouncedSearch = useDebounce(searchInput, 400)
  const [activeMenuId, setActiveMenuId] = useState(null)

  // Sync debounced search to URL
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

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['partner', 'jobs', { status: currentStatus, search: debouncedSearch, page: pageParam }],
    queryFn: () =>
      fetchPartnerJobs({
        status: currentStatus,
        search: debouncedSearch,
        page: pageParam,
      }),
  })

  // Status mutation (e.g. submit draft for review or close job)
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updatePartnerJobStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'jobs'] })
      setActiveMenuId(null)
    },
  })

  // Delete mutation for drafts
  const deleteMutation = useMutation({
    mutationFn: (id) => deletePartnerJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'jobs'] })
      setActiveMenuId(null)
    },
  })

  const jobs = data?.data || []
  const meta = data?.meta || { current_page: 1, last_page: 1, total: 0 }

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

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Not disclosed'
    const cur = currency === 'INR' ? '₹' : '$'
    if (min && max) return `${cur}${(min / 100000).toFixed(1)}L - ${cur}${(max / 100000).toFixed(1)}L`
    if (min) return `From ${cur}${(min / 100000).toFixed(1)}L`
    return `Up to ${cur}${(max / 100000).toFixed(1)}L`
  }

  // Quick stats computed from current or all items
  const stats = [
    { label: 'Published Jobs', value: jobs.filter((j) => j.status === JOB_STATUS.PUBLISHED).length, icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Under Review', value: jobs.filter((j) => j.status === JOB_STATUS.PENDING_REVIEW).length, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Needs Revision', value: jobs.filter((j) => j.status === JOB_STATUS.REJECTED).length, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
    { label: 'Total Applicants', value: jobs.reduce((acc, curr) => acc + (curr.applicants_count || 0), 0), icon: Users, color: 'text-indigo-600 bg-indigo-50' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Job Postings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create and manage your open positions, track applicant responses, and view moderation updates.
          </p>
        </div>
        <Link
          to="/partner/jobs/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Post a New Job
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-2 sm:border-b-0 sm:pb-0">
            {[
              { id: 'all', label: 'All Jobs' },
              { id: JOB_STATUS.PUBLISHED, label: 'Published' },
              { id: JOB_STATUS.PENDING_REVIEW, label: 'Under Review' },
              { id: JOB_STATUS.DRAFT, label: 'Drafts' },
              { id: JOB_STATUS.REJECTED, label: 'Needs Revision' },
              { id: JOB_STATUS.CLOSED, label: 'Closed' },
            ].map((tab) => {
              const active = currentStatus === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleStatusTab(tab.id)}
                  className={clsx(
                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                    active
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, dept, location..."
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Job Title & Spec</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Compensation</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Applicants</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 w-48 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-24 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-20 bg-slate-200 rounded-full" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-12 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4 text-right"><div className="h-8 w-16 bg-slate-200 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <p className="text-sm font-medium text-rose-600">Failed to load jobs: {error?.message}</p>
                    <button
                      onClick={() => refetch()}
                      className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <p className="text-base font-semibold text-slate-800">No jobs found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {debouncedSearch || currentStatus !== 'all'
                        ? 'Try clearing filters or search keyword.'
                        : 'Post your first opening to start receiving candidates.'}
                    </p>
                    {currentStatus === 'all' && !debouncedSearch && (
                      <Link
                        to="/partner/jobs/new"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                      >
                        <Plus className="h-4 w-4" /> Create Opening
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                jobs.map((job) => {
                  const isRejected = job.status === JOB_STATUS.REJECTED
                  const isDraft = job.status === JOB_STATUS.DRAFT
                  const isPublished = job.status === JOB_STATUS.PUBLISHED

                  return (
                    <tr key={job.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Job Title & Details */}
                      <td className="px-4 py-4">
                        <div>
                          <Link
                            to={`/partner/jobs/${job.id}/edit`}
                            className="font-semibold text-slate-900 hover:text-indigo-600 line-clamp-1"
                          >
                            {job.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="capitalize">{job.workplace_type?.replace('_', ' ')}</span>
                            <span>•</span>
                            <span className="capitalize">{job.employment_type?.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                          </div>

                          {/* Rejection Alert Box */}
                          {isRejected && job.rejection_reason && (
                            <div className="mt-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-2.5 text-xs text-rose-800">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                                <div>
                                  <span className="font-semibold">Reviewer Feedback: </span>
                                  {job.rejection_reason}
                                  <div className="mt-1">
                                    <Link
                                      to={`/partner/jobs/${job.id}/edit`}
                                      className="font-bold underline hover:text-rose-900"
                                    >
                                      Edit & Resubmit Job →
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {job.department || 'General'}
                      </td>

                      {/* Compensation */}
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {formatSalary(job.salary_min, job.salary_max, job.currency)}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <JobStatusBadge status={job.status} />
                      </td>

                      {/* Applicants */}
                      <td className="px-4 py-4">
                        <Link
                          to={`/partner/jobs/${job.id}/applicants`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          <Users className="h-4 w-4" />
                          <span>{job.applicants_count || 0} applicants</span>
                        </Link>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/partner/jobs/${job.id}/edit`}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                            title="Edit Job"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>

                          {/* Quick submit for draft */}
                          {isDraft && (
                            <button
                              onClick={() =>
                                statusMutation.mutate({
                                  id: job.id,
                                  status: JOB_STATUS.PENDING_REVIEW,
                                })
                              }
                              disabled={statusMutation.isPending}
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100"
                              title="Submit for Review"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Submit
                            </button>
                          )}

                          {/* Close published job */}
                          {isPublished && (
                            <button
                              onClick={() =>
                                statusMutation.mutate({
                                  id: job.id,
                                  status: JOB_STATUS.CLOSED,
                                })
                              }
                              disabled={statusMutation.isPending}
                              className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                              title="Close Job"
                            >
                              <Lock className="h-3.5 w-3.5" />
                              Close
                            </button>
                          )}

                          {/* Delete draft */}
                          {isDraft && (
                            <button
                              onClick={() => {
                                if (window.confirm('Delete this draft job?')) {
                                  deleteMutation.mutate(job.id)
                                }
                              }}
                              disabled={deleteMutation.isPending}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              title="Delete Draft"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
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
              <span className="font-semibold text-slate-700">{meta.last_page}</span> ({meta.total} jobs)
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
    </div>
  )
}

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
    { label: 'Published Jobs', value: jobs.filter((j) => j.status === JOB_STATUS.PUBLISHED).length, icon: CheckCircle2, color: 'text-[#B9D8C4] bg-[#2F7D5B]/20 border border-[#2F7D5B]/30' },
    { label: 'Under Review', value: jobs.filter((j) => j.status === JOB_STATUS.PENDING_REVIEW).length, icon: Clock, color: 'text-[#E5B866] bg-[#D6A84F]/15 border border-[#D6A84F]/30' },
    { label: 'Needs Revision', value: jobs.filter((j) => j.status === JOB_STATUS.REJECTED).length, icon: AlertTriangle, color: 'text-rose-300 bg-rose-950/40 border border-rose-800/40' },
    { label: 'Total Applicants', value: jobs.reduce((acc, curr) => acc + (curr.applicants_count || 0), 0), icon: Users, color: 'text-[#E5B866] bg-[#D6A84F]/20 border border-[#D6A84F]/30' },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F8F5]">Job Postings</h1>
          <p className="mt-1 text-sm text-[#91A6A0]">
            Create and manage your open positions, track applicant responses, and view moderation updates.
          </p>
        </div>
        <Link
          to="/partner/jobs/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F7D5B] px-5 py-2.5 text-sm font-semibold text-[#F7F8F5] shadow-lg shadow-[#2F7D5B]/20 hover:bg-[#25684a] transition-all"
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
            <div key={stat.label} className="rounded-2xl border border-[#294341] bg-[#0D2224] p-4">
              <div className="flex items-center gap-3">
                <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#91A6A0]">{stat.label}</p>
                  <p className="text-xl font-bold text-[#F7F8F5]">{stat.value}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="rounded-2xl border border-[#294341] bg-[#0D2224] p-5 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[#294341] pb-3 sm:border-b-0 sm:pb-0">
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
                    'rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all',
                    active
                      ? 'bg-[#153536] text-[#B9D8C4] border border-[#294341] font-semibold'
                      : 'text-[#91A6A0] hover:bg-[#102A2B] hover:text-[#F7F8F5]'
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#91A6A0]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, dept, location..."
              className="w-full rounded-xl border border-[#294341] bg-[#102A2B] pl-10 pr-3.5 py-2 text-sm text-[#F7F8F5] placeholder:text-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto rounded-xl border border-[#294341]">
          <table className="w-full text-left text-sm text-[#91A6A0]">
            <thead className="bg-[#102A2B] text-xs uppercase tracking-wider text-[#91A6A0]">
              <tr>
                <th className="px-4 py-3.5 font-semibold">Job Title & Spec</th>
                <th className="px-4 py-3.5 font-semibold">Department</th>
                <th className="px-4 py-3.5 font-semibold">Compensation</th>
                <th className="px-4 py-3.5 font-semibold">Status</th>
                <th className="px-4 py-3.5 font-semibold">Applicants</th>
                <th className="px-4 py-3.5 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#294341]/60 bg-[#0D2224]">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 w-48 bg-[#102A2B] rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-24 bg-[#102A2B] rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-28 bg-[#102A2B] rounded" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-20 bg-[#102A2B] rounded-full" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-12 bg-[#102A2B] rounded" /></td>
                    <td className="px-4 py-4 text-right"><div className="h-8 w-16 bg-[#102A2B] rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <p className="text-sm font-medium text-rose-400">Failed to load jobs: {error?.message}</p>
                    <button
                      onClick={() => refetch()}
                      className="mt-2 text-xs font-semibold text-[#D6A84F] hover:underline"
                    >
                      Try Again
                    </button>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#102A2B] text-[#D6A84F] border border-[#294341] mb-3">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <p className="text-base font-semibold text-[#F7F8F5]">No jobs found</p>
                    <p className="mt-1 text-sm text-[#91A6A0]">
                      {debouncedSearch || currentStatus !== 'all'
                        ? 'Try clearing filters or search keyword.'
                        : 'Post your first opening to start receiving candidates.'}
                    </p>
                    {currentStatus === 'all' && !debouncedSearch && (
                      <Link
                        to="/partner/jobs/new"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#2F7D5B] px-4 py-2 text-xs font-semibold text-[#F7F8F5] hover:bg-[#25684a]"
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
                    <tr key={job.id} className="hover:bg-[#153536]/50 transition-colors">
                      {/* Job Title & Details */}
                      <td className="px-4 py-4">
                        <div>
                          <Link
                            to={`/partner/jobs/${job.id}/edit`}
                            className="font-semibold text-[#F7F8F5] hover:text-[#D6A84F] line-clamp-1 transition-colors"
                          >
                            {job.title}
                          </Link>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#91A6A0]">
                            <span className="capitalize">{job.workplace_type?.replace('_', ' ')}</span>
                            <span>•</span>
                            <span className="capitalize">{job.employment_type?.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                          </div>

                          {/* Rejection Alert Box */}
                          {isRejected && job.rejection_reason && (
                            <div className="mt-2.5 rounded-xl border border-rose-900/50 bg-rose-950/40 p-2.5 text-xs text-rose-300">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                                <div>
                                  <span className="font-semibold">Reviewer Feedback: </span>
                                  {job.rejection_reason}
                                  <div className="mt-1">
                                    <Link
                                      to={`/partner/jobs/${job.id}/edit`}
                                      className="font-bold underline text-[#D6A84F] hover:text-[#E5B866]"
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
                      <td className="px-4 py-4 text-sm text-[#F7F8F5]">
                        {job.department || 'General'}
                      </td>

                      {/* Compensation */}
                      <td className="px-4 py-4 text-sm font-medium text-[#E5B866]">
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
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D6A84F] hover:text-[#E5B866] transition-colors"
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
                            className="rounded-lg p-1.5 text-[#91A6A0] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors"
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
                              className="inline-flex items-center gap-1 rounded-lg bg-[#D6A84F]/15 border border-[#D6A84F]/30 px-2 py-1 text-xs font-medium text-[#E5B866] hover:bg-[#D6A84F]/25 transition-colors"
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
                              className="inline-flex items-center gap-1 rounded-lg bg-[#102A2B] border border-[#294341] px-2 py-1 text-xs font-medium text-[#91A6A0] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors"
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
                              className="rounded-lg p-1.5 text-[#91A6A0] hover:bg-rose-950/40 hover:text-rose-400 transition-colors"
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
          <div className="flex items-center justify-between border-t border-[#294341] pt-4 text-xs text-[#91A6A0]">
            <p>
              Showing page <span className="font-semibold text-[#F7F8F5]">{meta.current_page}</span> of{' '}
              <span className="font-semibold text-[#F7F8F5]">{meta.last_page}</span> ({meta.total} jobs)
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
    </div>
  )
}

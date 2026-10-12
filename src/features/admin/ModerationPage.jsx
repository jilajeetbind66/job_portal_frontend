import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ShieldCheck,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  Building2,
  Clock,
  AlertTriangle,
  Loader2,
  Briefcase,
  ChevronRight,
} from 'lucide-react'
import { clsx } from 'clsx'
import { JOB_STATUS } from '@/constants'
import {
  fetchModerationQueue,
  approveJob,
  rejectJob,
} from './api/moderation'
import RejectReasonModal from './components/RejectReasonModal'
import JobStatusBadge from '@/features/partner/components/JobStatusBadge'
import { useDebounce } from '@/hooks/useDebounce'

export default function ModerationPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const currentStatus = searchParams.get('status') || JOB_STATUS.PENDING_REVIEW
  const searchParam = searchParams.get('search') || ''
  const pageParam = parseInt(searchParams.get('page') || '1', 10)

  const [searchInput, setSearchInput] = useState(searchParam)
  const debouncedSearch = useDebounce(searchInput, 400)

  // State for Reject Modal
  const [rejectModalJob, setRejectModalJob] = useState(null)

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
    queryKey: ['admin', 'moderation', { status: currentStatus, search: debouncedSearch, page: pageParam }],
    queryFn: () =>
      fetchModerationQueue({
        status: currentStatus,
        search: debouncedSearch,
        page: pageParam,
      }),
  })

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: (id) => approveJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation'] })
    },
  })

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => rejectJob(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation'] })
      setRejectModalJob(null)
    },
  })

  const jobs = data?.data || []
  const meta = data?.meta || { current_page: 1, last_page: 1, total: 0, counts: {} }
  const counts = meta.counts || {}

  const handleTabChange = (status) => {
    const params = new URLSearchParams(searchParams)
    params.set('status', status)
    params.set('page', '1')
    setSearchParams(params)
  }

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Not disclosed'
    const cur = currency === 'INR' ? '₹' : '$'
    if (min && max) return `${cur}${(min / 100000).toFixed(1)}L - ${cur}${(max / 100000).toFixed(1)}L`
    return `${cur}${(min / 100000).toFixed(1)}L`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[#F7F8F5]">Job Moderation Queue</h1>
            <span className="inline-flex items-center rounded-full bg-[#D6A84F]/15 border border-[#D6A84F]/30 px-3 py-0.5 text-xs font-semibold text-[#E5B866]">
              {counts.pending_review || 0} Pending
            </span>
          </div>
          <p className="mt-1 text-xs text-[#91A6A0]">
            Review submissions from partner organizations to ensure compliance, authenticity, and high standards.
          </p>
        </div>
      </div>

      {/* Main Card with Tabs & Search */}
      <div className="rounded-2xl border border-[#294341] bg-[#0D2224] p-5 shadow-xl space-y-4">
        {/* Navigation Tabs & Search */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#294341]/60 pb-2 sm:border-b-0 sm:pb-0">
            {[
              { id: JOB_STATUS.PENDING_REVIEW, label: 'Pending Review', count: counts.pending_review },
              { id: JOB_STATUS.PUBLISHED, label: 'Approved', count: counts.published },
              { id: JOB_STATUS.REJECTED, label: 'Rejected', count: counts.rejected },
              { id: 'all', label: 'All Jobs', count: counts.all },
            ].map((tab) => {
              const active = currentStatus === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={clsx(
                    'flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all',
                    active
                      ? 'bg-[#2F7D5B] text-white shadow-md'
                      : 'text-[#8FAF9A] bg-[#102A2B]/60 border border-[#294341] hover:bg-[#153536] hover:text-[#F7F8F5]'
                  )}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={clsx(
                        'rounded-full px-1.5 py-0.2 text-[10px] font-bold',
                        active ? 'bg-white/20 text-white' : 'bg-[#07151A] text-[#8FAF9A]'
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#91A6A0]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search title, partner, dept..."
              className="w-full rounded-xl border border-[#294341] bg-[#102A2B] pl-9 pr-3 py-2 text-xs text-[#F7F8F5] placeholder-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-xl border border-[#294341]/60">
          <table className="w-full text-left text-sm text-[#F7F8F5]">
            <thead className="bg-[#102A2B] text-xs uppercase tracking-wider text-[#8FAF9A] border-b border-[#294341]">
              <tr>
                <th className="px-4 py-3 font-semibold">Job Title</th>
                <th className="px-4 py-3 font-semibold">Partner / Company</th>
                <th className="px-4 py-3 font-semibold">Dept & Compensation</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Submitted Date</th>
                <th className="px-4 py-3 text-right font-semibold">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#294341]/50 bg-[#0D2224]">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 w-44 bg-[#102A2B] rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-32 bg-[#102A2B] rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-28 bg-[#102A2B] rounded" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-20 bg-[#102A2B] rounded-full" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-20 bg-[#102A2B] rounded" /></td>
                    <td className="px-4 py-4 text-right"><div className="h-8 w-28 bg-[#102A2B] rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-xs font-medium text-rose-400">
                    Failed to load moderation queue: {error?.message}
                    <div className="mt-2">
                      <button onClick={() => refetch()} className="text-xs text-[#D6A84F] hover:underline">
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F7D5B]/20 border border-[#2F7D5B]/30 text-[#B9D8C4] mb-3">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-bold text-[#F7F8F5]">
                      {currentStatus === JOB_STATUS.PENDING_REVIEW
                        ? 'Queue is Clear! All jobs have been reviewed.'
                        : 'No jobs found in this view.'}
                    </p>
                    <p className="mt-1 text-xs text-[#91A6A0]">
                      Check back later when partners submit new job openings.
                    </p>
                  </td>
                </tr>
              ) : (
                jobs.map((job) => {
                  const isPending = job.status === JOB_STATUS.PENDING_REVIEW
                  const isRejected = job.status === JOB_STATUS.REJECTED

                  return (
                    <tr key={job.id} className="hover:bg-[#102A2B]/50 transition-colors">
                      {/* Job Title & Type */}
                      <td className="px-4 py-4">
                        <div>
                          <Link
                            to={`/admin/moderation/${job.id}`}
                            className="font-bold text-[#F7F8F5] hover:text-[#B9D8C4] line-clamp-1 text-sm transition-colors"
                          >
                            {job.title}
                          </Link>
                          <div className="mt-1 flex items-center gap-2 text-xs text-[#91A6A0]">
                            <span className="capitalize">{job.workplace_type?.replace('_', ' ')}</span>
                            <span>•</span>
                            <span className="capitalize">{job.experience_level}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                          </div>

                          {/* Show reason snippet if rejected */}
                          {isRejected && job.rejection_reason && (
                            <p className="mt-1.5 text-xs text-rose-400 line-clamp-1 italic">
                              Rejection note: "{job.rejection_reason}"
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Partner Name & Logo */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2.5">
                          {job.partner_logo ? (
                            <img
                              src={job.partner_logo}
                              alt=""
                              className="h-8 w-8 rounded-lg object-cover border border-[#294341]"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#102A2B] border border-[#294341] font-bold text-xs text-[#B9D8C4]">
                              {job.partner_name?.charAt(0) || 'P'}
                            </div>
                          )}
                          <span className="font-semibold text-xs text-[#F7F8F5]">{job.partner_name}</span>
                        </div>
                      </td>

                      {/* Department & Compensation */}
                      <td className="px-4 py-4 text-xs">
                        <p className="font-semibold text-[#8FAF9A]">{job.department || 'General'}</p>
                        <p className="mt-0.5 text-[#F7F8F5] font-medium">
                          {formatSalary(job.salary_min, job.salary_max, job.currency)}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <JobStatusBadge status={job.status} />
                      </td>

                      {/* Submitted Date */}
                      <td className="px-4 py-4 text-xs text-[#91A6A0]">
                        {job.created_at ? new Date(job.created_at).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/moderation/${job.id}`}
                            className="inline-flex items-center gap-1 rounded-xl border border-[#294341] bg-[#102A2B] px-3 py-1.5 text-xs font-semibold text-[#8FAF9A] hover:bg-[#153536] hover:text-[#F7F8F5] shadow-sm transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5 text-[#8FAF9A]" />
                            Review
                          </Link>

                          {isPending && (
                            <>
                              <button
                                onClick={() => approveMutation.mutate(job.id)}
                                disabled={approveMutation.isPending}
                                className="inline-flex items-center gap-1 rounded-xl bg-[#2F7D5B] hover:bg-[#246347] border border-[#2F7D5B]/50 px-3 py-1.5 text-xs font-semibold text-white shadow-md disabled:opacity-50 transition-all"
                                title="Approve & Publish"
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                Approve
                              </button>

                              <button
                                onClick={() => setRejectModalJob(job)}
                                disabled={rejectMutation.isPending}
                                className="inline-flex items-center gap-1 rounded-xl border border-rose-800/40 bg-rose-950/40 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-900/50 disabled:opacity-50 transition-colors"
                                title="Reject with Feedback"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Reject
                              </button>
                            </>
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

        {/* Pagination */}
        {meta.total > 0 && (
          <div className="flex items-center justify-between border-t border-[#294341] pt-3 text-xs text-[#91A6A0]">
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
                className="rounded-xl border border-[#294341] bg-[#102A2B] px-3 py-1.5 text-xs font-semibold text-[#8FAF9A] hover:bg-[#153536] hover:text-[#F7F8F5] disabled:opacity-40 transition-colors"
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
                className="rounded-xl border border-[#294341] bg-[#102A2B] px-3 py-1.5 text-xs font-semibold text-[#8FAF9A] hover:bg-[#153536] hover:text-[#F7F8F5] disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reject Feedback Modal */}
      {rejectModalJob && (
        <RejectReasonModal
          open={Boolean(rejectModalJob)}
          onClose={() => setRejectModalJob(null)}
          jobTitle={rejectModalJob.title}
          loading={rejectMutation.isPending}
          onConfirm={(reason) =>
            rejectMutation.mutate({
              id: rejectModalJob.id,
              reason,
            })
          }
        />
      )}
    </div>
  )
}

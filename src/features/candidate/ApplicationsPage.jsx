import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, Link } from 'react-router-dom'
import { format, formatDistanceToNow } from 'date-fns'
import {
  MapPin,
  Building,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  XCircle,
  FileText,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { Button, StatusBadge, EmptyState, ConfirmDialog } from '@/components'
import { fetchMyApplications } from '@/features/public/api/jobs'
import { api } from '@/api/client'
import { APPLICATION_STATUS } from '@/constants'
import clsx from 'clsx'

const PIPELINE_STEPS = [
  { key: APPLICATION_STATUS.APPLIED, label: 'Applied' },
  { key: APPLICATION_STATUS.SHORTLISTED, label: 'Shortlisted' },
  { key: APPLICATION_STATUS.INTERVIEW, label: 'Interview' },
  { key: APPLICATION_STATUS.OFFERED, label: 'Offered' },
  { key: APPLICATION_STATUS.HIRED, label: 'Hired' },
]

async function withdrawApplication(applicationId) {
  const { data } = await api.patch(`/candidate/applications/${applicationId}/withdraw`)
  return data
}

export default function ApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentStatus = searchParams.get('status') || 'all'
  const [page, setPage] = useState(1)
  const toast = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['candidate', 'applications', currentStatus, page],
    queryFn: () =>
      fetchMyApplications({
        status: currentStatus === 'all' ? undefined : currentStatus,
        page,
      }),
  })

  const withdrawMutation = useMutation({
    mutationFn: withdrawApplication,
    onSuccess: () => {
      toast.success('Application withdrawn successfully.')
      queryClient.invalidateQueries({ queryKey: ['candidate', 'applications'] })
      queryClient.invalidateQueries({ queryKey: ['candidate', 'dashboard'] })
    },
    onError: () => toast.error('Failed to withdraw application. Please try again.'),
  })

  const tabs = [
    { id: 'all', label: 'All Applications' },
    { id: APPLICATION_STATUS.APPLIED, label: 'Applied' },
    { id: APPLICATION_STATUS.SHORTLISTED, label: 'Shortlisted' },
    { id: APPLICATION_STATUS.INTERVIEW, label: 'Interview' },
    { id: APPLICATION_STATUS.OFFERED, label: 'Offered' },
    { id: APPLICATION_STATUS.HIRED, label: 'Hired' },
    { id: APPLICATION_STATUS.REJECTED, label: 'Archived' },
    { id: APPLICATION_STATUS.WITHDRAWN, label: 'Withdrawn' },
  ]

  const handleTabChange = (statusId) => {
    setSearchParams(statusId === 'all' ? {} : { status: statusId }, { replace: true })
    setPage(1)
  }

  const applications = data?.data || []
  const total = data?.meta?.total || 0
  const totalPages = data?.meta?.last_page || 1

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Applications
            </h1>
            {!isLoading && (
              <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 py-0.5 px-2.5 rounded-full text-xs font-bold">
                {total} Total
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track real-time candidate review status, recruiter updates, and interview schedules.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Briefcase className="h-4 w-4" />
          <span>Explore More Jobs</span>
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex overflow-x-auto border-b border-slate-200 no-scrollbar">
        <div className="flex gap-1 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={clsx(
                'whitespace-nowrap px-4 py-2.5 text-xs font-semibold border-b-2 transition-all',
                currentStatus === tab.id
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 animate-pulse flex gap-4"
            >
              <div className="w-12 h-12 bg-slate-100 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-slate-100 rounded w-1/3" />
                <div className="h-4 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />
          <h3 className="mt-2 text-sm font-bold text-slate-900">Failed to load applications</h3>
          <p className="mt-1 text-xs text-slate-500">{error?.message || 'Could not fetch your applications.'}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          >
            Retry
          </button>
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications found"
          description={
            currentStatus === 'all'
              ? "You haven't submitted any job applications yet."
              : `No applications currently in status '${currentStatus}'.`
          }
          action={
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm"
            >
              <Briefcase className="h-4 w-4" />
              <span>Browse Active Jobs</span>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onWithdraw={(id) => withdrawMutation.mutate(id)}
              isWithdrawing={withdrawMutation.isPending && withdrawMutation.variables === app.id}
            />
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-200 text-xs">
              <span className="text-slate-500">
                Page <span className="font-semibold text-slate-900">{page}</span> of{' '}
                <span className="font-semibold text-slate-900">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ApplicationCard({ application, onWithdraw, isWithdrawing }) {
  const [timelineExpanded, setTimelineExpanded] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isWithdrawn = application.status === APPLICATION_STATUS.WITHDRAWN
  const isRejected = application.status === APPLICATION_STATUS.REJECTED
  const canWithdraw = application.status === APPLICATION_STATUS.APPLIED

  const job = application.job || {}
  const companyName = job.company_name || 'Hiring Company'
  const companyLogo = job.company_logo || null
  const timeline = application.timeline || []

  // Stepper active index
  const currentStepIndex = PIPELINE_STEPS.findIndex((s) => s.key === application.status)

  return (
    <div
      className={clsx(
        'bg-white rounded-2xl shadow-sm border overflow-hidden transition-all',
        isWithdrawn || isRejected ? 'border-slate-200 opacity-80' : 'border-slate-200 hover:border-slate-300'
      )}
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
          {/* Left: Logo & Job Info */}
          <div className="flex gap-3.5 min-w-0">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                className="h-12 w-12 rounded-xl object-cover shrink-0 border border-slate-100"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-base font-bold text-indigo-600">{companyName[0]}</span>
              </div>
            )}
            <div className="min-w-0">
              <Link
                to={`/jobs/${job.slug || job.id}`}
                className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate block"
              >
                {job.title}
              </Link>
              <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Building className="h-3.5 w-3.5 text-slate-400" />
                  {companyName}
                </span>
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {job.location}
                  </span>
                )}
                {job.workplace_type && (
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize">
                    {job.workplace_type.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Status badge & Date */}
          <div className="flex flex-col items-end gap-1 shrink-0 self-start sm:self-center">
            <StatusBadge status={application.status} />
            {application.applied_at && (
              <span className="text-[11px] text-slate-400">
                Applied{' '}
                {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>

        {/* Pipeline Stepper (Visual for active candidate) */}
        {!isWithdrawn && !isRejected && currentStepIndex !== -1 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-5 gap-1 items-center">
              {PIPELINE_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIndex
                const isCurrent = idx === currentStepIndex

                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div
                      className={clsx(
                        'h-1.5 w-full rounded-full transition-all',
                        isPassed || isCurrent ? 'bg-indigo-600' : 'bg-slate-100'
                      )}
                    />
                    <span
                      className={clsx(
                        'mt-1.5 text-[10px] font-medium transition-colors',
                        isCurrent
                          ? 'font-bold text-indigo-700'
                          : isPassed
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Footer Actions: Timeline Toggle + Withdraw Button */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setTimelineExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <span>{timelineExpanded ? 'Hide History & Notes' : 'View Timeline & Notes'}</span>
            {timelineExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {canWithdraw && (
            <>
              <Button
                variant="danger"
                size="sm"
                loading={isWithdrawing}
                onClick={() => setConfirmOpen(true)}
              >
                Withdraw Application
              </Button>
              <ConfirmDialog
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => {
                  setConfirmOpen(false)
                  onWithdraw(application.id)
                }}
                title="Withdraw Application"
                message="Are you sure you want to withdraw your application? This will stop further consideration for this role."
                confirmText="Yes, Withdraw"
                danger
                loading={isWithdrawing}
              />
            </>
          )}
        </div>
      </div>

      {/* Expanded Timeline Drawer */}
      {timelineExpanded && (
        <div className="bg-slate-50/80 px-6 py-5 border-t border-slate-200">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
            Application Status History
          </h4>
          {timeline.length === 0 ? (
            <p className="text-xs text-slate-500">No milestone details recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {timeline.map((step, idx) => (
                <div key={idx} className="relative pl-6">
                  {idx < timeline.length - 1 && (
                    <div className="absolute left-[9px] top-4 bottom-[-16px] w-0.5 bg-slate-200" />
                  )}
                  <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-slate-900 capitalize">
                        {step.status}
                      </span>
                      {step.changed_at && (
                        <span className="text-[10px] text-slate-400">
                          {format(new Date(step.changed_at), 'MMM dd, yyyy · hh:mm a')}
                        </span>
                      )}
                    </div>
                    {step.note && (
                      <p className="text-xs text-slate-600 mt-1 bg-white p-2.5 rounded-lg border border-slate-200">
                        {step.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F8F5]">
              My Applications
            </h1>
            {!isLoading && (
              <span className="bg-[#102A2B] border border-[#D6A84F]/30 text-[#D6A84F] py-0.5 px-3 rounded-full text-xs font-bold">
                {total} Total
              </span>
            )}
          </div>
          <p className="text-sm text-[#91A6A0] mt-1">
            Track real-time candidate review status, recruiter updates, and interview schedules.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F7D5B] px-4 py-2.5 text-xs font-semibold text-[#F7F8F5] hover:bg-[#25684a] shadow-lg shadow-[#2F7D5B]/20 transition-all self-start sm:self-auto"
        >
          <Briefcase className="h-4 w-4" />
          <span>Explore More Jobs</span>
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex overflow-x-auto border-b border-[#294341] no-scrollbar">
        <div className="flex gap-2 pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={clsx(
                'whitespace-nowrap px-4 py-2.5 text-xs font-semibold border-b-2 transition-all',
                currentStatus === tab.id
                  ? 'border-[#D6A84F] text-[#D6A84F] font-bold'
                  : 'border-transparent text-[#91A6A0] hover:text-[#F7F8F5] hover:border-[#294341]'
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
              className="bg-[#0D2224] p-6 rounded-2xl border border-[#294341] animate-pulse flex gap-4"
            >
              <div className="w-12 h-12 bg-[#102A2B] rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-[#102A2B] rounded w-1/3" />
                <div className="h-4 bg-[#102A2B] rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-[#0D2224] rounded-2xl border border-rose-900/50 p-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-400" />
          <h3 className="mt-2 text-sm font-bold text-[#F7F8F5]">Failed to load applications</h3>
          <p className="mt-1 text-xs text-[#91A6A0]">{error?.message || 'Could not fetch your applications.'}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-xl bg-[#2F7D5B] px-4 py-2 text-xs font-semibold text-[#F7F8F5] hover:bg-[#25684a]"
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F7D5B] px-4 py-2 text-xs font-semibold text-[#F7F8F5] hover:bg-[#25684a]"
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
            <div className="flex justify-between items-center pt-4 border-t border-[#294341] text-xs">
              <span className="text-[#91A6A0]">
                Page <span className="font-semibold text-[#F7F8F5]">{page}</span> of{' '}
                <span className="font-semibold text-[#F7F8F5]">{totalPages}</span>
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
        'bg-[#0D2224] rounded-2xl border overflow-hidden transition-all',
        isWithdrawn || isRejected ? 'border-[#294341] opacity-75' : 'border-[#294341] hover:border-[#2F7D5B]'
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
                className="h-12 w-12 rounded-xl object-cover shrink-0 border border-[#294341]"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-[#102A2B] border border-[#294341] flex items-center justify-center shrink-0">
                <span className="text-base font-bold text-[#D6A84F]">{companyName[0]}</span>
              </div>
            )}
            <div className="min-w-0">
              <Link
                to={`/jobs/${job.slug || job.id}`}
                className="text-sm font-bold text-[#F7F8F5] hover:text-[#D6A84F] transition-colors truncate block"
              >
                {job.title}
              </Link>
              <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs text-[#91A6A0]">
                <span className="flex items-center gap-1 font-medium text-[#F7F8F5]">
                  <Building className="h-3.5 w-3.5 text-[#91A6A0]" />
                  {companyName}
                </span>
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#91A6A0]" />
                    {job.location}
                  </span>
                )}
                {job.workplace_type && (
                  <span className="bg-[#102A2B] border border-[#294341] text-[#B9D8C4] px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize">
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
              <span className="text-[11px] text-[#91A6A0]">
                Applied{' '}
                {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>

        {/* Pipeline Stepper (Visual for active candidate) */}
        {!isWithdrawn && !isRejected && currentStepIndex !== -1 && (
          <div className="mt-5 pt-4 border-t border-[#294341]">
            <div className="grid grid-cols-5 gap-1.5 items-center">
              {PIPELINE_STEPS.map((step, idx) => {
                const isPassed = idx < currentStepIndex
                const isCurrent = idx === currentStepIndex

                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div
                      className={clsx(
                        'h-1.5 w-full rounded-full transition-all',
                        isPassed || isCurrent ? 'bg-[#2F7D5B]' : 'bg-[#102A2B] border border-[#294341]'
                      )}
                    />
                    <span
                      className={clsx(
                        'mt-1.5 text-[10px] font-medium transition-colors',
                        isCurrent
                          ? 'font-bold text-[#E5B866]'
                          : isPassed
                          ? 'text-[#B9D8C4]'
                          : 'text-[#91A6A0]'
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
        <div className="mt-4 pt-3 border-t border-[#294341] flex items-center justify-between">
          <button
            onClick={() => setTimelineExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#D6A84F] hover:text-[#E5B866] transition-colors"
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
        <div className="bg-[#102A2B] px-6 py-5 border-t border-[#294341]">
          <h4 className="text-xs font-bold text-[#F7F8F5] uppercase tracking-wider mb-4">
            Application Status History
          </h4>
          {timeline.length === 0 ? (
            <p className="text-xs text-[#91A6A0]">No milestone details recorded yet.</p>
          ) : (
            <div className="space-y-4">
              {timeline.map((step, idx) => (
                <div key={idx} className="relative pl-6">
                  {idx < timeline.length - 1 && (
                    <div className="absolute left-[9px] top-4 bottom-[-16px] w-0.5 bg-[#294341]" />
                  )}
                  <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-[#0D2224] border-2 border-[#2F7D5B] flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#2F7D5B]" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-[#F7F8F5] capitalize">
                        {step.status}
                      </span>
                      {step.changed_at && (
                        <span className="text-[10px] text-[#91A6A0]">
                          {format(new Date(step.changed_at), 'MMM dd, yyyy · hh:mm a')}
                        </span>
                      )}
                    </div>
                    {step.note && (
                      <p className="text-xs text-[#91A6A0] mt-1 bg-[#0D2224] p-2.5 rounded-lg border border-[#294341]">
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

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams, Link } from 'react-router-dom'
import { format, formatDistanceToNow } from 'date-fns'
import { MapPin, Building, Briefcase } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import { Button, StatusBadge, EmptyState, ConfirmDialog } from '@/components'
import { fetchMyApplications } from '@/features/public/api/jobs'
import { api } from '@/api/client'
import { APPLICATION_STATUS } from '@/constants'
import clsx from 'clsx'

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

  const { data, isLoading } = useQuery({
    queryKey: ['candidate', 'applications', currentStatus, page],
    queryFn: () => fetchMyApplications({ status: currentStatus === 'all' ? undefined : currentStatus, page }),
  })

  const withdrawMutation = useMutation({
    mutationFn: withdrawApplication,
    onSuccess: () => {
      toast.success('Application withdrawn successfully')
      queryClient.invalidateQueries({ queryKey: ['candidate', 'applications'] })
    },
    onError: () => toast.error('Failed to withdraw application'),
  })

  const tabs = [
    { id: 'all', label: 'All' },
    { id: APPLICATION_STATUS.APPLIED, label: 'Applied' },
    { id: APPLICATION_STATUS.SHORTLISTED, label: 'Shortlisted' },
    { id: APPLICATION_STATUS.INTERVIEW, label: 'Interview' },
    { id: APPLICATION_STATUS.OFFERED, label: 'Offered' },
    { id: APPLICATION_STATUS.HIRED, label: 'Hired' },
    { id: APPLICATION_STATUS.REJECTED, label: 'Rejected' },
    { id: APPLICATION_STATUS.WITHDRAWN, label: 'Withdrawn' },
  ]

  const handleTabChange = (statusId) => {
    setSearchParams(statusId === 'all' ? {} : { status: statusId })
    setPage(1)
  }

  const applications = data?.data || []
  const total = data?.meta?.total || 0
  const totalPages = data?.meta?.last_page || 1

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        {!isLoading && (
          <span className="bg-indigo-100 text-indigo-700 py-1 px-2.5 rounded-full text-sm font-semibold">
            {total}
          </span>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex overflow-x-auto border-b border-gray-200">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={clsx(
                'whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                currentStatus === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse flex gap-4"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications found"
          description={
            currentStatus === 'all'
              ? "You haven't applied to any jobs yet."
              : `No applications with status '${currentStatus}'.`
          }
          action={
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Briefcase className="h-4 w-4" />
              Browse Jobs
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

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-4">
              <Button
                variant="secondary"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
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
  const canWithdraw = application.status === APPLICATION_STATUS.APPLIED

  const job = application.job || {}
  const companyName = job.company_name || 'Company'
  const companyLogo = job.company_logo || null
  const timeline = application.timeline || []

  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-sm border overflow-hidden',
        isWithdrawn ? 'border-gray-100 opacity-75' : 'border-gray-200',
      )}
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
          {/* Left: Logo + Info */}
          <div className="flex gap-3">
            {companyLogo ? (
              <img
                src={companyLogo}
                alt={companyName}
                className="h-12 w-12 rounded-lg object-cover shrink-0 border border-gray-100"
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                <span className="text-lg font-bold text-indigo-600">{companyName[0]}</span>
              </div>
            )}
            <div>
              <Link
                to={`/jobs/${job.slug || job.id}`}
                className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {job.title}
              </Link>
              <div className="flex flex-wrap gap-2 mt-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Building className="h-3.5 w-3.5" />
                  {companyName}
                </span>
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                )}
                {job.workplace_type && (
                  <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs capitalize">
                    {job.workplace_type.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Status + date */}
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <StatusBadge status={application.status} />
            {application.applied_at && (
              <span className="text-xs text-gray-400">
                Applied{' '}
                {formatDistanceToNow(new Date(application.applied_at), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>

        {/* Footer: timeline + withdraw */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => setTimelineExpanded((v) => !v)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            {timelineExpanded ? 'Hide timeline' : 'View timeline'}
          </button>

          {canWithdraw && (
            <>
              <Button
                variant="danger"
                size="sm"
                loading={isWithdrawing}
                onClick={() => setConfirmOpen(true)}
              >
                Withdraw
              </Button>
              <ConfirmDialog
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => {
                  setConfirmOpen(false)
                  onWithdraw(application.id)
                }}
                title="Withdraw Application"
                message="Are you sure you want to withdraw your application? This cannot be undone."
                confirmText="Yes, Withdraw"
                danger
                loading={isWithdrawing}
              />
            </>
          )}
        </div>
      </div>

      {/* Timeline */}
      {timelineExpanded && (
        <div className="bg-gray-50 px-5 pb-5 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-4">Application History</h4>
          {timeline.length === 0 ? (
            <p className="text-sm text-gray-500">No timeline data available.</p>
          ) : (
            <div className="space-y-4">
              {timeline.map((step, idx) => (
                <div key={idx} className="relative pl-6">
                  {idx < timeline.length - 1 && (
                    <div className="absolute left-[9px] top-5 bottom-[-16px] w-0.5 bg-gray-200" />
                  )}
                  <div className="absolute left-0 top-1 h-5 w-5 rounded-full bg-white border-2 border-indigo-500 flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {step.status}
                      </span>
                      {step.changed_at && (
                        <span className="text-xs text-gray-400">
                          {format(new Date(step.changed_at), 'MMM dd, yyyy')}
                        </span>
                      )}
                    </div>
                    {step.note && <p className="text-sm text-gray-600 mt-0.5">{step.note}</p>}
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

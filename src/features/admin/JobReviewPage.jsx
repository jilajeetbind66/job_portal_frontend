import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  AlertTriangle,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { clsx } from 'clsx'
import { JOB_STATUS } from '@/constants'
import { fetchJobForReview, approveJob, rejectJob } from './api/moderation'
import RejectReasonModal from './components/RejectReasonModal'
import JobStatusBadge from '@/features/partner/components/JobStatusBadge'

export default function JobReviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [rejectModalOpen, setRejectModalOpen] = useState(false)

  const { data: response, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'moderation', 'job', id],
    queryFn: () => fetchJobForReview(id),
  })

  const job = response?.data

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: () => approveJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation'] })
      navigate('/admin/moderation')
    },
  })

  // Reject Mutation
  const rejectMutation = useMutation({
    mutationFn: (reason) => rejectJob(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'moderation'] })
      setRejectModalOpen(false)
      navigate('/admin/moderation')
    },
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
        <div className="h-6 w-36 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white rounded-2xl border border-slate-200 p-6" />
          <div className="h-72 bg-white rounded-2xl border border-slate-200 p-6" />
        </div>
      </div>
    )
  }

  if (isError || !job) {
    return (
      <div className="mx-auto max-w-xl py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-3">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Job Not Found</h2>
        <p className="mt-1 text-sm text-slate-500">{error?.message || 'The requested job posting could not be loaded.'}</p>
        <div className="mt-4 flex justify-center gap-3">
          <button
            onClick={() => refetch()}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white"
          >
            Retry
          </button>
          <Link
            to="/admin/moderation"
            className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
          >
            Back to Queue
          </Link>
        </div>
      </div>
    )
  }

  const isPending = job.status === JOB_STATUS.PENDING_REVIEW
  const isRejected = job.status === JOB_STATUS.REJECTED
  const isPublished = job.status === JOB_STATUS.PUBLISHED

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Not disclosed'
    const cur = currency === 'INR' ? '₹' : '$'
    if (min && max) return `${cur}${(min / 100000).toFixed(1)}L - ${cur}${(max / 100000).toFixed(1)}L per year`
    return `${cur}${(min / 100000).toFixed(1)}L per year`
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-12">
      {/* Top Navigation */}
      <div>
        <Link
          to="/admin/moderation"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Moderation Queue
        </Link>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{job.title}</h1>
            <JobStatusBadge status={job.status} />
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Specifications Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-slate-500 font-medium">Location</p>
                <p className="font-semibold text-slate-800">{job.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-slate-500 font-medium">Policy & Type</p>
                <p className="font-semibold text-slate-800 capitalize">
                  {job.workplace_type} • {job.employment_type?.replace('_', ' ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-slate-400" />
              <div>
                <p className="text-slate-500 font-medium">Experience</p>
                <p className="font-semibold text-slate-800 capitalize">{job.experience_level}</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Role Overview & Mission
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Requirements Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Key Requirements & Qualifications
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {job.requirements}
            </p>
          </div>

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Identified Core Competencies / Skills
              </h2>
              <div className="flex flex-wrap gap-2 pt-1">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Organization & Moderation Controls */}
        <div className="space-y-6">
          {/* Moderation Controls Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Moderation Status</h3>
              <JobStatusBadge status={job.status} />
            </div>

            {/* If Rejected Banner */}
            {isRejected && job.rejection_reason && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                <span className="font-bold">Previous Rejection Feedback:</span>
                <p className="mt-1">{job.rejection_reason}</p>
              </div>
            )}

            {isPublished && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
                <span className="font-bold">Job is Live & Published:</span>
                <p className="mt-1">Candidates can view and apply for this opening across the public portal.</p>
              </div>
            )}

            {/* Moderation Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending || isPublished}
                className={clsx(
                  'w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors',
                  isPublished
                    ? 'bg-slate-300 cursor-not-allowed text-slate-600'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                )}
              >
                {approveMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                <CheckCircle className="h-4 w-4" />
                {isPublished ? 'Already Approved' : 'Approve & Publish Opening'}
              </button>

              <button
                type="button"
                onClick={() => setRejectModalOpen(true)}
                disabled={rejectMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
              >
                <XCircle className="h-4 w-4" />
                Reject with Feedback
              </button>
            </div>
          </div>

          {/* Partner Info Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
              Publishing Partner
            </h3>

            <div className="flex items-center gap-3">
              {job.partner_logo ? (
                <img
                  src={job.partner_logo}
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover border border-slate-100"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 font-bold text-lg text-indigo-600">
                  {job.partner_name?.charAt(0) || 'P'}
                </div>
              )}
              <div>
                <p className="font-bold text-slate-900 text-sm">{job.partner_name}</p>
                <p className="text-xs text-slate-500">Registered Partner</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Compensation:</span>
                <span className="font-semibold">{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="font-semibold">{job.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deadline:</span>
                <span className="font-semibold">{job.deadline || 'Ongoing'}</span>
              </div>
            </div>

            {job.partner_id && (
              <Link
                to={`/admin/partners/${job.partner_id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:underline pt-2"
              >
                View Full Partner Profile <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      <RejectReasonModal
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        jobTitle={job.title}
        loading={rejectMutation.isPending}
        onConfirm={(reason) => rejectMutation.mutate(reason)}
      />
    </div>
  )
}


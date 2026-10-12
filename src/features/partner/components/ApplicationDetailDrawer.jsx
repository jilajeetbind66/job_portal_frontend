import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Loader2,
  AlertCircle,
  Globe,
} from 'lucide-react'
import { clsx } from 'clsx'
import { APPLICATION_STATUS } from '@/constants'
import { fetchApplicationDetail, updateApplicationStatus } from '../api/applications'
import ApplicationStatusBadge from './ApplicationStatusBadge'
import ResumeViewerModal from './ResumeViewerModal'

// Explicit allowed status transitions
const ALLOWED_TRANSITIONS = {
  [APPLICATION_STATUS.APPLIED]: [
    { target: APPLICATION_STATUS.SHORTLISTED, label: 'Shortlist Candidate', btnClass: 'bg-[#D6A84F] hover:bg-[#E5B866] text-[#07151A]' },
    { target: APPLICATION_STATUS.REJECTED, label: 'Reject Candidate', btnClass: 'bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40' },
  ],
  [APPLICATION_STATUS.SHORTLISTED]: [
    { target: APPLICATION_STATUS.INTERVIEW, label: 'Schedule Interview', btnClass: 'bg-[#D6A84F] hover:bg-[#E5B866] text-[#07151A]' },
    { target: APPLICATION_STATUS.REJECTED, label: 'Reject Candidate', btnClass: 'bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40' },
  ],
  [APPLICATION_STATUS.INTERVIEW]: [
    { target: APPLICATION_STATUS.OFFERED, label: 'Extend Formal Offer', btnClass: 'bg-[#2F7D5B] hover:bg-[#25684a] text-[#F7F8F5]' },
    { target: APPLICATION_STATUS.REJECTED, label: 'Reject After Interview', btnClass: 'bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40' },
  ],
  [APPLICATION_STATUS.OFFERED]: [
    { target: APPLICATION_STATUS.HIRED, label: 'Confirm Hired 🎉', btnClass: 'bg-[#2F7D5B] hover:bg-[#25684a] text-[#F7F8F5]' },
    { target: APPLICATION_STATUS.REJECTED, label: 'Offer Declined / Reject', btnClass: 'bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40' },
  ],
  [APPLICATION_STATUS.REJECTED]: [
    { target: APPLICATION_STATUS.SHORTLISTED, label: 'Reconsider Candidate', btnClass: 'bg-[#102A2B] hover:bg-[#153536] text-[#B9D8C4] border border-[#294341]' },
  ],
  [APPLICATION_STATUS.HIRED]: [],
  [APPLICATION_STATUS.WITHDRAWN]: [],
}

export default function ApplicationDetailDrawer({
  applicationId,
  open,
  onClose,
}) {
  const queryClient = useQueryClient()
  const [selectedNextStatus, setSelectedNextStatus] = useState(null)
  const [transitionNote, setTransitionNote] = useState('')
  const [resumeModalOpen, setResumeModalOpen] = useState(false)

  // Fetch full detail
  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ['partner', 'application', applicationId],
    queryFn: () => fetchApplicationDetail(applicationId),
    enabled: Boolean(applicationId && open),
  })

  const app = response?.data

  useEffect(() => {
    setSelectedNextStatus(null)
    setTransitionNote('')
  }, [applicationId, open])

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Status mutation
  const statusMutation = useMutation({
    mutationFn: ({ status, note }) =>
      updateApplicationStatus(applicationId, { status, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'application', applicationId] })
      queryClient.invalidateQueries({ queryKey: ['partner', 'applications'] })
      setSelectedNextStatus(null)
      setTransitionNote('')
    },
  })

  if (!open) return null

  const candidate = app?.candidate || {}
  const nextOptions = app ? ALLOWED_TRANSITIONS[app.status] || [] : []

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#07151A]/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-2xl bg-[#0D2224] border-l border-[#294341] shadow-2xl flex flex-col text-[#F7F8F5]">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#294341] px-6 py-4 bg-[#102A2B]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#91A6A0]">
                Applicant Profile • ATS
              </p>
              <h2 className="text-lg font-bold text-[#F7F8F5]">
                {candidate.name || 'Application Details'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-[#91A6A0] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-[#102A2B] rounded-2xl" />
                <div className="h-40 bg-[#102A2B] rounded-2xl" />
                <div className="h-40 bg-[#102A2B] rounded-2xl" />
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-rose-900/50 bg-rose-950/40 p-6 text-center text-rose-300">
                <AlertCircle className="mx-auto h-8 w-8 text-rose-400 mb-2" />
                <p className="font-semibold text-sm">Failed to load application details</p>
                <p className="text-xs text-rose-300 mt-1">{error?.message}</p>
              </div>
            ) : app ? (
              <>
                {/* Candidate Overview Card */}
                <div className="rounded-2xl border border-[#294341] bg-[#102A2B] p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0D2224] border border-[#294341] text-[#D6A84F] font-bold text-lg">
                        {candidate.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#F7F8F5]">{candidate.name}</h3>
                        <p className="text-xs text-[#91A6A0]">{candidate.current_title}</p>
                      </div>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </div>

                  {/* Contact & Meta Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-[#91A6A0] border-t border-[#294341]">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#91A6A0]" />
                      <a href={`mailto:${candidate.email}`} className="text-[#D6A84F] hover:underline">
                        {candidate.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#91A6A0]" />
                      <span>{candidate.phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#91A6A0]" />
                      <span>{candidate.location || 'India'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-[#91A6A0]" />
                      <span>{candidate.experience_years} years experience</span>
                    </div>
                  </div>

                  {/* Links / Resume Quick Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#294341]">
                    {candidate.resume_url && (
                      <button
                        onClick={() => setResumeModalOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F7D5B]/20 border border-[#2F7D5B]/30 px-3 py-1.5 text-xs font-semibold text-[#B9D8C4] hover:bg-[#2F7D5B]/30 transition-colors"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Preview Resume
                      </button>
                    )}
                    {candidate.linkedin && (
                      <a
                        href={candidate.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl border border-[#294341] bg-[#0D2224] px-2.5 py-1.5 text-xs font-medium text-[#91A6A0] hover:text-[#F7F8F5]"
                      >
                        <Globe className="h-3.5 w-3.5 text-[#D6A84F]" /> LinkedIn
                      </a>
                    )}
                    {candidate.github && (
                      <a
                        href={candidate.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl border border-[#294341] bg-[#0D2224] px-2.5 py-1.5 text-xs font-medium text-[#91A6A0] hover:text-[#F7F8F5]"
                      >
                        <ExternalLink className="h-3.5 w-3.5 text-[#91A6A0]" /> GitHub
                      </a>
                    )}
                  </div>
                </div>

                {/* Candidate Skills */}
                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="rounded-2xl border border-[#294341] bg-[#102A2B] p-5 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#91A6A0]">
                      Skills & Technologies
                    </h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {candidate.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-[#0D2224] border border-[#294341] px-2.5 py-1 text-xs font-medium text-[#B9D8C4]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover Note / Pitch */}
                {app.cover_letter && (
                  <div className="rounded-2xl border border-[#294341] bg-[#102A2B] p-5 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#91A6A0]">
                      Candidate Pitch / Note
                    </h4>
                    <p className="text-xs text-[#91A6A0] leading-relaxed italic bg-[#0D2224] p-3 rounded-xl border border-[#294341]">
                      &quot;{app.cover_letter}&quot;
                    </p>
                  </div>
                )}

                {/* WORKFLOW ENGINE: Allowed Next Statuses */}
                <div className="rounded-2xl border border-[#2F7D5B]/40 bg-[#102A2B] p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-[#F7F8F5]">
                        Candidate Pipeline Action
                      </h4>
                      <p className="text-xs text-[#91A6A0]">
                        Current Stage: <strong className="capitalize text-[#E5B866]">{app.status}</strong>
                      </p>
                    </div>
                  </div>

                  {nextOptions.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {nextOptions.map((opt) => (
                          <button
                            key={opt.target}
                            type="button"
                            onClick={() => setSelectedNextStatus(opt.target)}
                            className={clsx(
                              'inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition-all',
                              opt.btnClass,
                              selectedNextStatus === opt.target && 'ring-2 ring-[#D6A84F] ring-offset-2 ring-offset-[#0D2224]'
                            )}
                          >
                            <span>{opt.label}</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        ))}
                      </div>

                      {/* If status selected, provide optional note input */}
                      {selectedNextStatus && (
                        <div className="mt-3 rounded-xl bg-[#0D2224] p-3.5 border border-[#294341] space-y-3">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-[#91A6A0]">
                            Add Stage Transition Note (Audit Log):
                          </label>
                          <textarea
                            rows={2}
                            value={transitionNote}
                            onChange={(e) => setTransitionNote(e.target.value)}
                            placeholder={`e.g. Qualified after screening call; moving to ${selectedNextStatus}...`}
                            className="w-full rounded-lg border border-[#294341] bg-[#102A2B] p-2 text-xs text-[#F7F8F5] placeholder:text-[#91A6A0]/50 focus:border-[#2F7D5B] focus:outline-none focus:ring-1 focus:ring-[#2F7D5B]"
                          />

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setSelectedNextStatus(null)}
                              className="px-3 py-1.5 text-xs text-[#91A6A0] hover:text-[#F7F8F5]"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={statusMutation.isPending}
                              onClick={() =>
                                statusMutation.mutate({
                                  status: selectedNextStatus,
                                  note: transitionNote,
                                })
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2F7D5B] px-3.5 py-1.5 text-xs font-bold text-[#F7F8F5] hover:bg-[#25684a] shadow-sm disabled:opacity-50"
                            >
                              {statusMutation.isPending && (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              )}
                              Confirm Transition
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-xl bg-[#0D2224] p-3 text-xs text-[#91A6A0] border border-[#294341]">
                      {app.status === APPLICATION_STATUS.HIRED
                        ? '🎉 Candidate has been successfully hired for this position.'
                        : 'Application is withdrawn or reached terminal state.'}
                    </div>
                  )}
                </div>

                {/* AUDIT LOG: History Timeline */}
                <div className="rounded-2xl border border-[#294341] bg-[#102A2B] p-5 space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#294341] pb-3">
                    <Clock className="h-4 w-4 text-[#D6A84F]" />
                    <h4 className="text-sm font-bold text-[#F7F8F5]">
                      Application History & Audit Trail
                    </h4>
                  </div>

                  <div className="relative pl-6 space-y-6 before:absolute before:bottom-0 before:left-2 before:top-2 before:w-0.5 before:bg-[#294341]">
                    {app.history_timeline?.map((event, idx) => (
                      <div key={event.id || idx} className="relative group">
                        {/* Dot */}
                        <div className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2F7D5B] ring-4 ring-[#102A2B]" />

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <span className="font-bold text-[#F7F8F5] capitalize">
                              {event.to_status}
                            </span>
                            <span className="text-[#91A6A0]">•</span>
                            <span className="text-[#91A6A0]">{event.changed_by}</span>
                            <span className="text-[#91A6A0]">•</span>
                            <span className="text-[#91A6A0]">
                              {new Date(event.timestamp).toLocaleString()}
                            </span>
                          </div>

                          {event.note && (
                            <p className="text-xs text-[#91A6A0] bg-[#0D2224] p-2.5 rounded-lg border border-[#294341] leading-relaxed">
                              {event.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </aside>
      </div>

      {/* Embedded Resume Modal */}
      {candidate.resume_url && (
        <ResumeViewerModal
          open={resumeModalOpen}
          onClose={() => setResumeModalOpen(false)}
          candidateName={candidate.name}
          resumeUrl={candidate.resume_url}
        />
      )}
    </div>,
    document.body
  )
}

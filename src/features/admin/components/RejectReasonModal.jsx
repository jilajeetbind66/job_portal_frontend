import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, X, Loader2 } from 'lucide-react'

export default function RejectReasonModal({
  open,
  onClose,
  onConfirm,
  jobTitle = 'this job',
  loading = false,
}) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setReason('')
      setError('')
    }
  }, [open])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open && !loading) {
        onClose()
      }
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose, loading])

  if (!open) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('Please provide a reason so the partner knows what changes are required.')
      return
    }
    if (reason.trim().length < 10) {
      setError('Please provide a more descriptive reason (at least 10 characters).')
      return
    }
    setError('')
    onConfirm(reason.trim())
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#07151A]/85 backdrop-blur-sm transition-opacity"
        onClick={() => !loading && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0D2224] border border-[#294341] p-6 shadow-2xl transition-all">
        <button
          type="button"
          onClick={() => !loading && onClose()}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-[#91A6A0] hover:bg-[#102A2B] hover:text-[#F7F8F5] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-950/40 border border-rose-800/40 text-rose-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#F7F8F5]">Reject Job Posting</h3>
            <p className="mt-1 text-xs text-[#91A6A0] leading-relaxed">
              Rejecting <strong className="text-[#F7F8F5]">{jobTitle}</strong>. The partner organization will receive your structured feedback to make corrections.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="rejection-reason" className="block text-xs font-semibold text-[#8FAF9A] uppercase tracking-wider mb-2">
              Reason for Rejection <span className="text-rose-400">*</span>
            </label>
            <textarea
              id="rejection-reason"
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError('')
              }}
              placeholder="e.g. Compensation range is missing or ambiguous, educational requirements need clarification, or job description contains prohibited formatting."
              className="block w-full rounded-xl border border-[#294341] bg-[#102A2B] p-3 text-sm text-[#F7F8F5] placeholder-[#91A6A0]/50 shadow-inner focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/30"
              disabled={loading}
              autoFocus
            />
            {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[#294341] bg-[#102A2B] px-4 py-2.5 text-xs font-semibold text-[#8FAF9A] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-700 hover:bg-rose-600 border border-rose-600/30 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}

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
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => !loading && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <button
          type="button"
          onClick={() => !loading && onClose()}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Reject Job Posting</h3>
            <p className="mt-1 text-sm text-slate-500">
              Rejecting <strong className="text-slate-700">{jobTitle}</strong>. The partner will be notified with your feedback to make corrections.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="rejection-reason" className="block text-sm font-medium text-slate-700">
              Reason for Rejection <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="rejection-reason"
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError('')
              }}
              placeholder="e.g. Salary range is unrealistic, missing required educational criteria, or needs clearer description of day-to-day responsibilities."
              className="mt-1.5 block w-full rounded-xl border border-slate-300 p-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              disabled={loading}
              autoFocus
            />
            {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500/20 disabled:opacity-50"
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


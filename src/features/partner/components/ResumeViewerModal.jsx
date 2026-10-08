import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Download, ExternalLink, FileText } from 'lucide-react'

export default function ResumeViewerModal({
  open,
  onClose,
  candidateName = 'Candidate',
  resumeUrl,
}) {
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

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Resume: {candidateName}
              </h3>
              <p className="text-xs text-slate-500">Applicant Curriculum Vitae (PDF)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {resumeUrl && (
              <>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in New Tab
                </a>
                <a
                  href={resumeUrl}
                  download={`${candidateName.replace(/\s+/g, '_')}_Resume.pdf`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </>
            )}
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / PDF Viewer Frame */}
        <div className="flex-1 bg-slate-100 p-2 sm:p-4 overflow-hidden">
          {resumeUrl ? (
            <iframe
              src={resumeUrl}
              title={`Resume of ${candidateName}`}
              className="h-full w-full rounded-xl border border-slate-200 bg-white shadow-inner"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <FileText className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-sm font-semibold text-slate-600">No Resume Uploaded</p>
                <p className="text-xs text-slate-400">The candidate has not attached a resume document.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}


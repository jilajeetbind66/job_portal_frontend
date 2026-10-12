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
        className="fixed inset-0 bg-[#07151A]/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative flex h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-[#0D2224] border border-[#294341] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#294341] px-6 py-4 bg-[#102A2B]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2F7D5B]/20 border border-[#2F7D5B]/30 text-[#B9D8C4]">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F7F8F5]">
                Resume: {candidateName}
              </h3>
              <p className="text-xs text-[#91A6A0]">Applicant Curriculum Vitae (PDF)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {resumeUrl && (
              <>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#294341] bg-[#0D2224] px-3.5 py-1.5 text-xs font-semibold text-[#F7F8F5] hover:border-[#D6A84F] transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-[#D6A84F]" />
                  Open in New Tab
                </a>
                <a
                  href={resumeUrl}
                  download={`${candidateName.replace(/\s+/g, '_')}_Resume.pdf`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F7D5B] px-3.5 py-1.5 text-xs font-semibold text-[#F7F8F5] hover:bg-[#25684a] shadow-lg shadow-[#2F7D5B]/20 transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
              </>
            )}
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-[#91A6A0] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / PDF Viewer Frame */}
        <div className="flex-1 bg-[#07151A] p-2 sm:p-4 overflow-hidden">
          {resumeUrl ? (
            <iframe
              src={resumeUrl}
              title={`Resume of ${candidateName}`}
              className="h-full w-full rounded-xl border border-[#294341] bg-white shadow-inner"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center">
              <div>
                <FileText className="mx-auto h-12 w-12 text-[#91A6A0]/40" />
                <p className="mt-2 text-sm font-semibold text-[#F7F8F5]">No Resume Uploaded</p>
                <p className="text-xs text-[#91A6A0]">The candidate has not attached a resume document.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

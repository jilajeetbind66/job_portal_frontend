import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import clsx from 'clsx'

export default function Modal({ open, onClose, title, children, footer, size = 'md' }) {
  const titleId = useId()
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    panelRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#07151A]/80 backdrop-blur-xs" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={clsx(
          'relative w-full rounded-2xl border border-[#294341] bg-[#0D2224] p-6 text-[#F7F8F5] shadow-2xl focus:outline-none',
          size === 'sm' && 'max-w-sm',
          size === 'md' && 'max-w-lg',
          size === 'lg' && 'max-w-2xl',
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-bold text-[#F7F8F5]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-[#91A6A0] hover:bg-[#153536] hover:text-[#F7F8F5] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="text-sm text-[#91A6A0]">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2.5 pt-4 border-t border-[#294341]">{footer}</div>}
      </div>
    </div>
  )
}

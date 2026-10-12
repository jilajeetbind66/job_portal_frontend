import { useId, useState } from 'react'
import { FileText, UploadCloud } from 'lucide-react'

// accept: ".pdf,.docx", maxSizeMB: 5. progress: 0-100 (upload chalte waqt parent dega)
export default function FileUpload({
  label,
  accept,
  maxSizeMB = 5,
  onSelect,
  progress,
  fileName,
  error,
}) {
  const id = useId()
  const [localError, setLocalError] = useState('')

  const onChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > maxSizeMB * 1024 * 1024) {
      setLocalError(`File ${maxSizeMB} MB se chhoti honi chahiye`)
      e.target.value = ''
      return
    }
    setLocalError('')
    onSelect(file)
  }

  const shownError = error || localError

  return (
    <div>
      {label && <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#91A6A0]">{label}</span>}
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-[#294341] bg-[#0D2224] px-4 py-8 text-center text-sm text-[#F7F8F5] hover:border-[#2F7D5B] hover:bg-[#102A2B] transition-colors"
      >
        {fileName ? (
          <FileText className="h-7 w-7 text-[#2F7D5B]" aria-hidden="true" />
        ) : (
          <UploadCloud className="h-7 w-7 text-[#91A6A0]" aria-hidden="true" />
        )}
        <span className="font-medium text-[#F7F8F5]">{fileName ?? 'Click to choose a file'}</span>
        <span className="text-xs text-[#91A6A0]">
          {accept ? `${accept} · ` : ''}max {maxSizeMB} MB
        </span>
        <input id={id} type="file" accept={accept} onChange={onChange} className="sr-only" />
      </label>
      {typeof progress === 'number' && (
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-[#102A2B] border border-[#294341]"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full bg-[#2F7D5B] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
      {shownError && <p className="mt-1 text-xs text-red-400">{shownError}</p>}
    </div>
  )
}

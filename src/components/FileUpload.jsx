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
      {label && <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>}
      <label
        htmlFor={id}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-600 hover:bg-gray-50"
      >
        {fileName ? (
          <FileText className="h-6 w-6 text-indigo-600" aria-hidden="true" />
        ) : (
          <UploadCloud className="h-6 w-6 text-gray-400" aria-hidden="true" />
        )}
        <span>{fileName ?? 'Click to choose a file'}</span>
        <span className="text-xs text-gray-400">
          {accept ? `${accept} · ` : ''}max {maxSizeMB} MB
        </span>
        <input id={id} type="file" accept={accept} onChange={onChange} className="sr-only" />
      </label>
      {typeof progress === 'number' && (
        <div
          className="mt-2 h-2 overflow-hidden rounded bg-gray-200"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className="h-full bg-indigo-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {shownError && <p className="mt-1 text-sm text-red-600">{shownError}</p>}
    </div>
  )
}

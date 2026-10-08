import { useId, useState } from 'react'
import { X } from 'lucide-react'

// value: string[], onChange: (string[]) => void. Enter ya comma se tag add hota hai.
export default function TagInput({
  label,
  value = [],
  onChange,
  placeholder = 'Type and press Enter',
  error,
}) {
  const id = useId()
  const [text, setText] = useState('')

  const add = (raw) => {
    const tag = raw.trim()
    if (!tag || value.some((t) => t.toLowerCase() === tag.toLowerCase())) return
    onChange([...value, tag])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add(text)
      setText('')
    } else if (e.key === 'Backspace' && !text && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-1.5 rounded-md border border-gray-300 p-2 focus-within:outline-2 focus-within:outline-indigo-600">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-0.5 text-sm text-indigo-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => {
            add(text)
            setText('')
          }}
          placeholder={value.length ? '' : placeholder}
          className="min-w-24 flex-1 border-0 bg-transparent text-sm focus:outline-none"
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

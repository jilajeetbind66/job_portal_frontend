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
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#91A6A0]">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2 rounded-xl border border-[#294341] bg-[#102A2B] p-2.5 transition-colors focus-within:border-[#2F7D5B] focus-within:ring-1 focus-within:ring-[#2F7D5B]">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#153536] border border-[#294341] px-2.5 py-1 text-xs font-medium text-[#B9D8C4]"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
              className="text-[#91A6A0] hover:text-[#F7F8F5]"
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
          className="min-w-24 flex-1 border-0 bg-transparent text-sm text-[#F7F8F5] placeholder-[#91A6A0]/50 focus:outline-none"
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}

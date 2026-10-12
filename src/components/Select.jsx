import { useId } from 'react'
import clsx from 'clsx'

// options: [{ value, label }]
export default function Select({
  label,
  error,
  options = [],
  placeholder,
  id,
  className,
  ref,
  ...props
}) {
  const autoId = useId()
  const selectId = id ?? autoId

  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#91A6A0]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={clsx(
          'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#F7F8F5] transition-colors focus:outline-none focus:ring-1',
          error
            ? 'border-red-500 bg-[#102A2B] focus:border-red-500 focus:ring-red-500'
            : 'border-[#294341] bg-[#102A2B] focus:border-[#2F7D5B] focus:ring-[#2F7D5B]',
        )}
        {...props}
      >
        {placeholder !== undefined && <option value="" className="bg-[#102A2B] text-[#91A6A0]">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#102A2B] text-[#F7F8F5]">
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

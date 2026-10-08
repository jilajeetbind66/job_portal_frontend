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
        <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={clsx(
          'block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-2 focus:outline-indigo-600',
          error ? 'border-red-500' : 'border-gray-300',
        )}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

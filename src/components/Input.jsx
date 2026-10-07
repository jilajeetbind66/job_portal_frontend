import { useId } from 'react'
import clsx from 'clsx'

// React Hook Form ke saath: <Input label="Email" error={errors.email?.message} {...register('email')} />
export default function Input({ label, error, hint, id, className, ref, ...props }) {
  const autoId = useId()
  const inputId = id ?? autoId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={clsx(
          'block w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-2 focus:outline-indigo-600',
          error ? 'border-red-500' : 'border-gray-300',
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${inputId}-hint`} className="mt-1 text-sm text-gray-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

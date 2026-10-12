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
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#91A6A0]">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={clsx(
          'block w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#F7F8F5] placeholder-[#91A6A0]/50 transition-colors focus:outline-none focus:ring-1',
          error
            ? 'border-red-500 bg-[#102A2B] focus:border-red-500 focus:ring-red-500'
            : 'border-[#294341] bg-[#102A2B] focus:border-[#2F7D5B] focus:ring-[#2F7D5B]',
        )}
        {...props}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-400">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${inputId}-hint`} className="mt-1 text-xs text-[#91A6A0]">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

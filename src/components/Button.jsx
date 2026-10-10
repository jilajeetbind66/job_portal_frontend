import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-[#6A8E7F] text-white hover:bg-[#58796B] shadow-xs border border-[#6A8E7F] transition-all duration-200',
  secondary: 'bg-white text-[#2F3542] border border-[#CED6E0] hover:bg-[#F7F8F5] hover:border-[#747D8C] shadow-2xs transition-all duration-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-600 shadow-2xs transition-colors',
  ghost: 'text-[#2F3542] hover:bg-[#BFEDC1]/30 hover:text-[#6A8E7F] transition-colors',
}

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs rounded-lg font-semibold',
  md: 'px-4.5 py-2 text-sm rounded-xl font-semibold',
  lg: 'px-6 py-3 text-base rounded-xl font-semibold',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className,
  children,
  ...props
}) {
  const isButton = Component === 'button'
  const buttonProps = isButton ? { type, disabled: disabled || loading } : {}

  return (
    <Component
      {...buttonProps}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium cursor-pointer select-none transition-all',
        'focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />}
      {children}
    </Component>
  )
}

import clsx from 'clsx'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'bg-[#2F7D5B] text-white hover:bg-[#25684B] shadow-xs border border-[#2F7D5B] transition-all duration-200',
  secondary: 'bg-[#0D2224] text-[#F7F8F5] border border-[#294341] hover:bg-[#102A2B] hover:border-[#8FAF9A] shadow-2xs transition-all duration-200',
  gold: 'bg-[#D6A84F] text-[#172026] hover:bg-[#E5B866] font-bold shadow-md border border-[#D6A84F] transition-all duration-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 border border-rose-600 shadow-2xs transition-colors',
  ghost: 'text-[#F7F8F5] hover:bg-[#102A2B] hover:text-[#B9D8C4] transition-colors',
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

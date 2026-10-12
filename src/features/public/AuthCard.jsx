// Login, signup, forgot/reset password common card - Luxury Dark Palette
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <div className="rounded-2xl border border-[#294341] bg-[#0D2224] p-8 shadow-2xl backdrop-blur-md">
        <h1 className="text-2xl font-bold tracking-tight text-[#F7F8F5]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-xs text-[#8FAF9A]">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <div className="mt-5 text-center text-xs text-[#8FAF9A]">{footer}</div>}
    </div>
  )
}

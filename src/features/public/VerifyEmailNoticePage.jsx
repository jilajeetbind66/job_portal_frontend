import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import AuthCard from './AuthCard'

export default function VerifyEmailNoticePage() {
  return (
    <AuthCard title="Verify Your Email Address">
      <div className="flex flex-col items-center gap-3.5 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F7D5B]/20 border border-[#2F7D5B]/30 text-[#B9D8C4]">
          <MailCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-xs text-[#91A6A0] leading-relaxed">
          We have sent a verification link to your email address. Please verify your email to apply for jobs.
          In the meantime, you can continue browsing opportunities across India.
        </p>
        <Link to="/jobs" className="text-xs font-semibold text-[#D6A84F] hover:text-[#E5B866] underline transition-colors">
          Browse Jobs →
        </Link>
      </div>
    </AuthCard>
  )
}

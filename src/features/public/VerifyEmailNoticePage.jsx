import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import AuthCard from './AuthCard'

export default function VerifyEmailNoticePage() {
  return (
    <AuthCard title="Apna email verify karo">
      <div className="flex flex-col items-center gap-3.5 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F7D5B]/20 border border-[#2F7D5B]/30 text-[#B9D8C4]">
          <MailCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <p className="text-xs text-[#91A6A0] leading-relaxed">
          Humne tumhare email par ek verification link bheja hai. Jobs ke liye apply karne se pehle
          email verify karna zaroori hai. Tab tak tum jobs browse kar sakte ho.
        </p>
        <Link to="/jobs" className="text-xs font-semibold text-[#D6A84F] hover:text-[#E5B866] underline transition-colors">
          Jobs dekho →
        </Link>
      </div>
    </AuthCard>
  )
}

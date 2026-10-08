import { Link } from 'react-router-dom'
import { MailCheck } from 'lucide-react'
import AuthCard from './AuthCard'

// TODO: "Resend email" button tab jodna jab backend ka resend endpoint tay ho jaye
export default function VerifyEmailNoticePage() {
  return (
    <AuthCard title="Apna email verify karo">
      <div className="flex flex-col items-center gap-3 text-center">
        <MailCheck className="h-10 w-10 text-indigo-600" aria-hidden="true" />
        <p className="text-sm text-gray-600">
          Humne tumhare email par ek verification link bheja hai. Jobs ke liye apply karne se pehle
          email verify karna zaroori hai. Tab tak tum jobs browse kar sakte ho.
        </p>
        <Link to="/jobs" className="text-sm font-medium text-indigo-600 hover:underline">
          Jobs dekho
        </Link>
      </div>
    </AuthCard>
  )
}

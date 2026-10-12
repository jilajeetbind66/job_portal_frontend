import { clsx } from 'clsx'
import { APPLICATION_STATUS } from '@/constants'

const STATUS_CONFIG = {
  [APPLICATION_STATUS.APPLIED]: {
    label: 'Applied',
    bg: 'bg-[#2F7D5B]/20 text-[#B9D8C4] border-[#2F7D5B]/40',
    dot: 'bg-[#2F7D5B]',
  },
  [APPLICATION_STATUS.SHORTLISTED]: {
    label: 'Shortlisted',
    bg: 'bg-[#D6A84F]/20 text-[#E5B866] border-[#D6A84F]/40',
    dot: 'bg-[#D6A84F]',
  },
  [APPLICATION_STATUS.INTERVIEW]: {
    label: 'Interviewing',
    bg: 'bg-[#D6A84F]/15 text-[#E5B866] border-[#D6A84F]/30',
    dot: 'bg-[#D6A84F] animate-pulse',
  },
  [APPLICATION_STATUS.OFFERED]: {
    label: 'Offer Extended',
    bg: 'bg-[#2F7D5B]/30 text-[#B9D8C4] border-[#2F7D5B]/50',
    dot: 'bg-[#2F7D5B]',
  },
  [APPLICATION_STATUS.HIRED]: {
    label: 'Hired 🎉',
    bg: 'bg-[#2F7D5B]/40 text-[#F7F8F5] border-[#2F7D5B]',
    dot: 'bg-[#B9D8C4]',
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: 'Rejected',
    bg: 'bg-rose-950/40 text-rose-300 border-rose-800/40',
    dot: 'bg-rose-400',
  },
  [APPLICATION_STATUS.WITHDRAWN]: {
    label: 'Withdrawn',
    bg: 'bg-[#102A2B] text-[#91A6A0] border-[#294341]',
    dot: 'bg-[#91A6A0]',
  },
}

export default function ApplicationStatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    bg: 'bg-[#102A2B] text-[#91A6A0] border-[#294341]',
    dot: 'bg-[#91A6A0]',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide',
        config.bg,
        className
      )}
    >
      <span className={clsx('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}


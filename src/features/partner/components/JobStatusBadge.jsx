import { clsx } from 'clsx'
import { JOB_STATUS } from '@/constants'

const STATUS_CONFIG = {
  [JOB_STATUS.DRAFT]: {
    label: 'Draft',
    bg: 'bg-[#102A2B] text-[#91A6A0] border-[#294341]',
    dot: 'bg-[#91A6A0]',
  },
  [JOB_STATUS.PENDING_REVIEW]: {
    label: 'Under Review',
    bg: 'bg-[#D6A84F]/15 text-[#E5B866] border-[#D6A84F]/30',
    dot: 'bg-[#D6A84F] animate-pulse',
  },
  [JOB_STATUS.PUBLISHED]: {
    label: 'Published',
    bg: 'bg-[#2F7D5B]/20 text-[#B9D8C4] border-[#2F7D5B]/40',
    dot: 'bg-[#2F7D5B]',
  },
  [JOB_STATUS.CLOSED]: {
    label: 'Closed',
    bg: 'bg-[#102A2B] text-[#91A6A0] border-[#294341]',
    dot: 'bg-[#91A6A0]',
  },
  [JOB_STATUS.REJECTED]: {
    label: 'Needs Revision',
    bg: 'bg-rose-950/40 text-rose-300 border-rose-800/40',
    dot: 'bg-rose-400',
  },
}

export default function JobStatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    bg: 'bg-[#102A2B] text-[#91A6A0] border-[#294341]',
    dot: 'bg-[#91A6A0]',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.bg,
        className
      )}
    >
      <span className={clsx('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}


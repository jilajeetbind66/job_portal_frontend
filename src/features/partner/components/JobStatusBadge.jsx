import { clsx } from 'clsx'
import { JOB_STATUS } from '@/constants'

const STATUS_CONFIG = {
  [JOB_STATUS.DRAFT]: {
    label: 'Draft',
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
  },
  [JOB_STATUS.PENDING_REVIEW]: {
    label: 'Under Review',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500 animate-pulse',
  },
  [JOB_STATUS.PUBLISHED]: {
    label: 'Published',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  [JOB_STATUS.CLOSED]: {
    label: 'Closed',
    bg: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    dot: 'bg-zinc-400',
  },
  [JOB_STATUS.REJECTED]: {
    label: 'Needs Revision',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
  },
}

export default function JobStatusBadge({ status, className }) {
  const config = STATUS_CONFIG[status] || {
    label: status || 'Unknown',
    bg: 'bg-gray-100 text-gray-700 border-gray-200',
    dot: 'bg-gray-400',
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


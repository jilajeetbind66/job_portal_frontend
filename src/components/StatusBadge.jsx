import clsx from 'clsx'
import { ACCOUNT_STATUS, APPLICATION_STATUS, JOB_STATUS } from '@/constants'

const styles = {
  gray: 'bg-[#102A2B] text-[#91A6A0] border border-[#294341]',
  yellow: 'bg-[#D6A84F]/15 text-[#E5B866] border border-[#D6A84F]/30',
  green: 'bg-[#2F7D5B]/20 text-[#B9D8C4] border border-[#2F7D5B]/40',
  red: 'bg-red-950/40 text-red-300 border border-red-800/40',
  blue: 'bg-[#2F7D5B]/25 text-[#B9D8C4] border border-[#2F7D5B]/50',
  purple: 'bg-[#D6A84F]/20 text-[#E5B866] border border-[#D6A84F]/40',
}

// Job, application aur account status ke rang ek jagah tay hain
const colorByStatus = {
  [JOB_STATUS.DRAFT]: 'gray',
  [JOB_STATUS.PENDING_REVIEW]: 'yellow',
  [JOB_STATUS.PUBLISHED]: 'green',
  [JOB_STATUS.CLOSED]: 'gray',
  [JOB_STATUS.REJECTED]: 'red',
  [APPLICATION_STATUS.APPLIED]: 'blue',
  [APPLICATION_STATUS.SHORTLISTED]: 'purple',
  [APPLICATION_STATUS.INTERVIEW]: 'yellow',
  [APPLICATION_STATUS.OFFERED]: 'purple',
  [APPLICATION_STATUS.HIRED]: 'green',
  [APPLICATION_STATUS.WITHDRAWN]: 'gray',
  [ACCOUNT_STATUS.ACTIVE]: 'green',
  [ACCOUNT_STATUS.SUSPENDED]: 'red',
}

export function statusLabel(status) {
  return String(status)
    .replace(/_/g, ' ')
    .replace(/^\w/, (c) => c.toUpperCase())
}

export default function StatusBadge({ status, className }) {
  const color = colorByStatus[status] ?? 'gray'
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        styles[color],
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  )
}

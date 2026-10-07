import clsx from 'clsx'
import { ACCOUNT_STATUS, APPLICATION_STATUS, JOB_STATUS } from '@/constants'

const styles = {
  gray: 'bg-gray-100 text-gray-700',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
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

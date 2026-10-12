import React from 'react';
import { clsx } from 'clsx';
import { ACCOUNT_STATUS } from '@/constants';

export default function StatusBadge({ status }) {
  const isActive = status === ACCOUNT_STATUS.ACTIVE;
  const isSuspended = status === ACCOUNT_STATUS.SUSPENDED;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        {
          'bg-[#2F7D5B]/20 text-[#B9D8C4] border-[#2F7D5B]/40': isActive,
          'bg-rose-950/40 text-rose-300 border-rose-800/40': isSuspended,
          'bg-[#102A2B] text-[#91A6A0] border-[#294341]': !isActive && !isSuspended,
        }
      )}
    >
      <span
        className={clsx('w-1.5 h-1.5 rounded-full', {
          'bg-[#2F7D5B]': isActive,
          'bg-rose-400': isSuspended,
          'bg-[#91A6A0]': !isActive && !isSuspended,
        })}
      />
      {isActive ? 'Active' : isSuspended ? 'Suspended' : 'Unknown'}
    </span>
  );
}

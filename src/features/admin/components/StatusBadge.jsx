import React from 'react';
import { clsx } from 'clsx';
import { ACCOUNT_STATUS } from '@/constants';

export default function StatusBadge({ status }) {
  const isActive = status === ACCOUNT_STATUS.ACTIVE;
  const isSuspended = status === ACCOUNT_STATUS.SUSPENDED;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
        {
          'bg-green-100 text-green-800': isActive,
          'bg-red-100 text-red-800': isSuspended,
          'bg-gray-100 text-gray-800': !isActive && !isSuspended,
        }
      )}
    >
      <span
        className={clsx('w-1.5 h-1.5 rounded-full', {
          'bg-green-600': isActive,
          'bg-red-600': isSuspended,
          'bg-gray-600': !isActive && !isSuspended,
        })}
      />
      {isActive ? 'Active' : isSuspended ? 'Suspended' : 'Unknown'}
    </span>
  );
}

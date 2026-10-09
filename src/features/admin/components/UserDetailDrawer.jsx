import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Shield,
  ShieldCheck,
  Briefcase,
  AlertCircle,
  UserCheck,
  UserX,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import { clsx } from 'clsx'
import { ROLES, ACCOUNT_STATUS } from '@/constants'
import { fetchUserDetail, toggleUserStatus } from '../api/users'

export default function UserDetailDrawer({
  userId,
  open,
  onClose,
  onEditRole,
  onDeleteUser,
}) {
  const queryClient = useQueryClient()

  const { data: response, isLoading, isError, error } = useQuery({
    queryKey: ['admin', 'user', userId],
    queryFn: () => fetchUserDetail(userId),
    enabled: Boolean(userId && open),
  })

  const user = response?.data

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && open) {
        onClose()
      }
    }
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // Status toggle mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => toggleUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'user', userId] })
    },
  })

  if (!open) return null

  const getRoleConfig = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return { label: 'Platform Super Admin', color: 'text-rose-700 bg-rose-50 border-rose-200', icon: Shield }
      case ROLES.PARTNER_ADMIN:
        return { label: 'Partner Administrator', color: 'text-purple-700 bg-purple-50 border-purple-200', icon: ShieldCheck }
      case ROLES.PARTNER_RECRUITER:
        return { label: 'Partner Recruiter', color: 'text-indigo-700 bg-indigo-50 border-indigo-200', icon: Briefcase }
      default:
        return { label: 'Candidate', color: 'text-blue-700 bg-blue-50 border-blue-200', icon: User }
    }
  }

  const roleConfig = user ? getRoleConfig(user.role) : {}
  const RoleIcon = roleConfig.icon || User
  const isActive = user?.status === ACCOUNT_STATUS.ACTIVE

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-xl bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                User Details • Administration
              </p>
              <h2 className="text-lg font-bold text-slate-900">
                {user?.name || 'User Profile'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-slate-100 rounded-2xl" />
                <div className="h-40 bg-slate-100 rounded-2xl" />
                <div className="h-32 bg-slate-100 rounded-2xl" />
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700">
                <AlertCircle className="mx-auto h-8 w-8 text-rose-600 mb-2" />
                <p className="font-semibold text-sm">Failed to load user details</p>
                <p className="text-xs mt-1">{error?.message}</p>
              </div>
            ) : user ? (
              <>
                {/* User Header Profile Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 font-bold text-xl">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
                          {user.is_protected && (
                            <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                              Root Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20'
                          : 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20'
                      )}
                    >
                      <span
                        className={clsx(
                          'h-1.5 w-1.5 rounded-full',
                          isActive ? 'bg-emerald-500' : 'bg-rose-500'
                        )}
                      />
                      <span className="capitalize">{user.status}</span>
                    </span>
                  </div>

                  {/* Role Tag & Partner Info */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={clsx(
                          'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-bold',
                          roleConfig.color
                        )}
                      >
                        <RoleIcon className="h-3.5 w-3.5" />
                        {roleConfig.label}
                      </span>
                    </div>

                    {!user.is_protected && (
                      <button
                        onClick={() => {
                          onEditRole(user)
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline"
                      >
                        Change Role →
                      </button>
                    )}
                  </div>
                </div>

                {/* Contact & Association Info */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Account & Contact Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <a href={`mailto:${user.email}`} className="text-indigo-600 hover:underline">
                        {user.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>{user.phone || 'Not provided'}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                      <Building2 className="h-4 w-4 text-slate-400" />
                      <span>
                        Partner Organization:{' '}
                        {user.partner_name ? (
                          <strong className="text-slate-900">{user.partner_name}</strong>
                        ) : (
                          <span className="text-slate-400 italic">None (Independent Candidate / System Admin)</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span>
                        Registered on: {user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity & Metrics Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Platform Activity Summary
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    {user.role === ROLES.CANDIDATE ? (
                      <>
                        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                          <p className="text-[11px] font-medium text-slate-500">Applications Submitted</p>
                          <p className="text-xl font-bold text-slate-900 mt-1">{user.applications_count || 0}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                          <p className="text-[11px] font-medium text-slate-500">Candidate Profile</p>
                          <p className="text-xs font-semibold text-indigo-600 mt-2">Active Job Seeker</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                          <p className="text-[11px] font-medium text-slate-500">Jobs Posted / Managed</p>
                          <p className="text-xl font-bold text-slate-900 mt-1">{user.jobs_count || 0}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                          <p className="text-[11px] font-medium text-slate-500">Partner Tenant</p>
                          <p className="text-xs font-semibold text-slate-800 mt-2 line-clamp-1">
                            {user.partner_name || 'System'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Administrative Actions */}
                {!user.is_protected && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Administrative Actions
                    </h4>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {/* Suspend / Unsuspend */}
                      <button
                        onClick={() =>
                          statusMutation.mutate({
                            id: user.id,
                            status: isActive ? ACCOUNT_STATUS.SUSPENDED : ACCOUNT_STATUS.ACTIVE,
                          })
                        }
                        disabled={statusMutation.isPending}
                        className={clsx(
                          'inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold shadow-sm transition-colors',
                          isActive
                            ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                        )}
                      >
                        {isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        {isActive ? 'Suspend User Access' : 'Reactivate Account'}
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => {
                          onClose()
                          onDeleteUser(user)
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 shadow-sm transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete User Account
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </aside>
      </div>
    </div>,
    document.body
  )
}


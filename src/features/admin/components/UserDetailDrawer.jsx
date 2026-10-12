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
        return { label: 'Platform Super Admin', color: 'text-rose-400 bg-rose-950/40 border-rose-800/40', icon: Shield }
      case ROLES.PARTNER_ADMIN:
        return { label: 'Partner Administrator', color: 'text-[#E5B866] bg-[#D6A84F]/15 border-[#D6A84F]/30', icon: ShieldCheck }
      case ROLES.PARTNER_RECRUITER:
        return { label: 'Partner Recruiter', color: 'text-[#B9D8C4] bg-[#2F7D5B]/20 border-[#2F7D5B]/30', icon: Briefcase }
      default:
        return { label: 'Candidate', color: 'text-[#8FAF9A] bg-[#102A2B] border-[#294341]', icon: User }
    }
  }

  const roleConfig = user ? getRoleConfig(user.role) : {}
  const RoleIcon = roleConfig.icon || User
  const isActive = user?.status === ACCOUNT_STATUS.ACTIVE

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#07151A]/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <aside className="w-screen max-w-xl bg-[#0D2224] border-l border-[#294341] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#294341] px-6 py-4 bg-[#102A2B]/40">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8FAF9A]">
                User Details • Administration
              </p>
              <h2 className="text-lg font-bold text-[#F7F8F5]">
                {user?.name || 'User Profile'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-[#91A6A0] hover:bg-[#102A2B] hover:text-[#F7F8F5] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-[#102A2B] rounded-2xl" />
                <div className="h-40 bg-[#102A2B] rounded-2xl" />
                <div className="h-32 bg-[#102A2B] rounded-2xl" />
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-rose-800/40 bg-rose-950/40 p-6 text-center text-rose-300">
                <AlertCircle className="mx-auto h-8 w-8 text-rose-400 mb-2" />
                <p className="font-semibold text-sm">Failed to load user details</p>
                <p className="text-xs mt-1 text-[#91A6A0]">{error?.message}</p>
              </div>
            ) : user ? (
              <>
                {/* User Header Profile Card */}
                <div className="rounded-2xl border border-[#294341] bg-[#102A2B] p-5 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0D2224] border border-[#294341] text-[#B9D8C4] font-bold text-xl">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#F7F8F5]">{user.name}</h3>
                          {user.is_protected && (
                            <span className="rounded-full bg-rose-950/40 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-800/40">
                              Root Admin
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#91A6A0] mt-0.5">{user.email}</p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={clsx(
                        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border',
                        isActive
                          ? 'bg-[#2F7D5B]/20 text-[#B9D8C4] border-[#2F7D5B]/40'
                          : 'bg-rose-950/40 text-rose-400 border-rose-800/40'
                      )}
                    >
                      <span
                        className={clsx(
                          'h-1.5 w-1.5 rounded-full',
                          isActive ? 'bg-[#2F7D5B]' : 'bg-rose-400'
                        )}
                      />
                      <span className="capitalize">{user.status}</span>
                    </span>
                  </div>

                  {/* Role Tag & Partner Info */}
                  <div className="pt-3 border-t border-[#294341] flex flex-wrap items-center justify-between gap-2">
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
                        className="text-xs font-semibold text-[#D6A84F] hover:text-[#E5B866] underline transition-colors"
                      >
                        Change Role →
                      </button>
                    )}
                  </div>
                </div>

                {/* Contact & Association Info */}
                <div className="rounded-2xl border border-[#294341] bg-[#102A2B] p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8FAF9A]">
                    Account & Contact Information
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#91A6A0]">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#8FAF9A]" />
                      <a href={`mailto:${user.email}`} className="text-[#B9D8C4] hover:underline">
                        {user.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#8FAF9A]" />
                      <span className="text-[#F7F8F5]">{user.phone || 'Not provided'}</span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                      <Building2 className="h-4 w-4 text-[#8FAF9A]" />
                      <span>
                        Partner Organization:{' '}
                        {user.partner_name ? (
                          <strong className="text-[#F7F8F5]">{user.partner_name}</strong>
                        ) : (
                          <span className="text-[#91A6A0]/60 italic">None (Independent Candidate / System Admin)</span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 sm:col-span-2">
                      <Calendar className="h-4 w-4 text-[#8FAF9A]" />
                      <span>
                        Registered on: {user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity & Metrics Card */}
                <div className="rounded-2xl border border-[#294341] bg-[#102A2B] p-5 shadow-sm space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#8FAF9A]">
                    Platform Activity Summary
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    {user.role === ROLES.CANDIDATE ? (
                      <>
                        <div className="rounded-xl bg-[#0D2224] p-3.5 border border-[#294341]">
                          <p className="text-[11px] font-medium text-[#8FAF9A]">Applications Submitted</p>
                          <p className="text-xl font-bold text-[#F7F8F5] mt-1">{user.applications_count || 0}</p>
                        </div>
                        <div className="rounded-xl bg-[#0D2224] p-3.5 border border-[#294341]">
                          <p className="text-[11px] font-medium text-[#8FAF9A]">Candidate Status</p>
                          <p className="text-xs font-semibold text-[#B9D8C4] mt-2">Active Job Seeker</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-xl bg-[#0D2224] p-3.5 border border-[#294341]">
                          <p className="text-[11px] font-medium text-[#8FAF9A]">Jobs Posted / Managed</p>
                          <p className="text-xl font-bold text-[#F7F8F5] mt-1">{user.jobs_count || 0}</p>
                        </div>
                        <div className="rounded-xl bg-[#0D2224] p-3.5 border border-[#294341]">
                          <p className="text-[11px] font-medium text-[#8FAF9A]">Partner Tenant</p>
                          <p className="text-xs font-semibold text-[#F7F8F5] mt-2 line-clamp-1">
                            {user.partner_name || 'System'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Administrative Actions */}
                {!user.is_protected && (
                  <div className="rounded-2xl border border-[#294341] bg-[#102A2B] p-5 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8FAF9A]">
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
                          'inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold border shadow-sm transition-colors',
                          isActive
                            ? 'bg-[#D6A84F]/15 text-[#E5B866] border-[#D6A84F]/30 hover:bg-[#D6A84F]/25'
                            : 'bg-[#2F7D5B]/20 text-[#B9D8C4] border-[#2F7D5B]/40 hover:bg-[#2F7D5B]/30'
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
                        className="inline-flex items-center gap-1.5 rounded-xl border border-rose-800/40 bg-rose-950/40 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-900/50 shadow-sm transition-colors"
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

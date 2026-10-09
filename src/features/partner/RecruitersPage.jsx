import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UserPlus,
  Users,
  Search,
  ShieldCheck,
  Briefcase,
  MoreVertical,
  Trash2,
  UserCheck,
  UserX,
  AlertCircle,
  Building,
} from 'lucide-react'
import { clsx } from 'clsx'
import { ROLES, ACCOUNT_STATUS } from '@/constants'
import { useAuth } from '@/auth/useAuth'
import {
  fetchRecruiters,
  toggleRecruiterStatus,
  deleteRecruiter,
} from './api/recruiters'
import InviteRecruiterModal from './components/InviteRecruiterModal'
import ChangeRoleModal from './components/ChangeRoleModal'
import { useDebounce } from '@/hooks/useDebounce'

export default function RecruitersPage() {
  const { role: currentUserRole, can } = useAuth()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  const canManageRecruiters = can ? can('recruiters.manage') : currentUserRole === ROLES.PARTNER_ADMIN

  const searchParam = searchParams.get('search') || ''
  const roleFilter = searchParams.get('role') || 'all'
  const statusFilter = searchParams.get('status') || 'all'
  const pageParam = parseInt(searchParams.get('page') || '1', 10)

  const [searchInput, setSearchInput] = useState(searchParam)
  const debouncedSearch = useDebounce(searchInput, 400)

  // Modals state
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [editingRoleRecruiter, setEditingRoleRecruiter] = useState(null)
  const [deletingRecruiter, setDeletingRecruiter] = useState(null)

  // Sync debounced search to URL without loop
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const current = prev.get('search') || ''
        if (debouncedSearch === current) return prev

        const next = new URLSearchParams(prev)
        if (debouncedSearch) {
          next.set('search', debouncedSearch)
          next.set('page', '1')
        } else {
          next.delete('search')
        }
        return next
      },
      { replace: true }
    )
  }, [debouncedSearch, setSearchParams])

  // Query recruiters
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['partner', 'recruiters', { search: debouncedSearch, role: roleFilter, status: statusFilter, page: pageParam }],
    queryFn: () =>
      fetchRecruiters({
        search: debouncedSearch,
        role: roleFilter,
        status: statusFilter,
        page: pageParam,
      }),
  })

  // Toggle status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => toggleRecruiterStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'recruiters'] })
    },
  })

  // Delete recruiter mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteRecruiter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'recruiters'] })
      setDeletingRecruiter(null)
    },
  })

  const recruiters = data?.data || []
  const meta = data?.meta || { current_page: 1, last_page: 1, total: 0 }
  const counts = meta.counts || { total: 0, admins: 0, recruiters: 0, active: 0 }

  const handleRoleTab = (selectedRole) => {
    const params = new URLSearchParams(searchParams)
    if (selectedRole === 'all') {
      params.delete('role')
    } else {
      params.set('role', selectedRole)
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Recruiters & Team Members
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your hiring organization, assign recruitment permissions, and invite team members.
          </p>
        </div>

        {canManageRecruiters ? (
          <button
            onClick={() => setInviteModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Invite Team Member
          </button>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800">
            View-only access (Contact a Partner Admin to invite or manage members)
          </div>
        )}
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Total Team Members', count: counts.total || 0, icon: Users, color: 'text-slate-700 bg-slate-50' },
          { label: 'Partner Admins', count: counts.admins || 0, icon: ShieldCheck, color: 'text-purple-700 bg-purple-50' },
          { label: 'Active Recruiters', count: counts.recruiters || 0, icon: Briefcase, color: 'text-indigo-700 bg-indigo-50' },
          { label: 'Active Status', count: counts.active || 0, icon: UserCheck, color: 'text-emerald-700 bg-emerald-50' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900">{stat.count}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filter and Table Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Role tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-2 sm:border-b-0 sm:pb-0">
            {[
              { id: 'all', label: 'All Members' },
              { id: ROLES.PARTNER_ADMIN, label: 'Admins' },
              { id: ROLES.PARTNER_RECRUITER, label: 'Recruiters' },
            ].map((tab) => {
              const active = roleFilter === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleRoleTab(tab.id)}
                  className={clsx(
                    'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  )}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, department..."
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Team Member</th>
                <th className="px-4 py-3 font-semibold">Department</th>
                <th className="px-4 py-3 font-semibold">Role & Access</th>
                <th className="px-4 py-3 font-semibold">Account Status</th>
                <th className="px-4 py-3 font-semibold">Joined On</th>
                {canManageRecruiters && (
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 w-40 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-28 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-24 bg-slate-200 rounded-full" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-16 bg-slate-200 rounded-full" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
                    {canManageRecruiters && (
                      <td className="px-4 py-4 text-right"><div className="h-8 w-16 bg-slate-200 rounded ml-auto" /></td>
                    )}
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={canManageRecruiters ? 6 : 5} className="py-12 text-center text-rose-600">
                    Failed to load recruiters: {error?.message}
                    <div className="mt-2">
                      <button onClick={() => refetch()} className="text-xs text-indigo-600 underline">
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : recruiters.length === 0 ? (
                <tr>
                  <td colSpan={canManageRecruiters ? 6 : 5} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="text-base font-semibold text-slate-800">No team members found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {debouncedSearch || roleFilter !== 'all'
                        ? 'Try clearing search filters.'
                        : 'Invite recruiters to collaborate on jobs and candidate tracking.'}
                    </p>
                  </td>
                </tr>
              ) : (
                recruiters.map((recruiter) => {
                  const isAdmin = recruiter.role === ROLES.PARTNER_ADMIN
                  const isActive = recruiter.status === ACCOUNT_STATUS.ACTIVE

                  return (
                    <tr key={recruiter.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Avatar */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={clsx(
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm',
                              isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'
                            )}
                          >
                            {recruiter.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{recruiter.name}</span>
                              {recruiter.is_owner && (
                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                  Primary Owner
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">{recruiter.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-4 py-4 text-xs text-slate-700 font-medium">
                        {recruiter.department || 'General Talent'}
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-4">
                        <span
                          className={clsx(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                            isAdmin
                              ? 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20'
                              : 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20'
                          )}
                        >
                          {isAdmin ? <ShieldCheck className="h-3.5 w-3.5" /> : <Briefcase className="h-3.5 w-3.5" />}
                          {isAdmin ? 'Partner Admin' : 'Recruiter'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-4">
                        <span
                          className={clsx(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                            isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          )}
                        >
                          <span
                            className={clsx(
                              'h-1.5 w-1.5 rounded-full',
                              isActive ? 'bg-emerald-500' : 'bg-rose-500'
                            )}
                          />
                          <span className="capitalize">{recruiter.status}</span>
                        </span>
                      </td>

                      {/* Added Date */}
                      <td className="px-4 py-4 text-xs text-slate-500">
                        {recruiter.created_at ? new Date(recruiter.created_at).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      {canManageRecruiters && (
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Change Role Button */}
                            {!recruiter.is_owner && (
                              <button
                                onClick={() => setEditingRoleRecruiter(recruiter)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                                title="Change Permissions Role"
                              >
                                <ShieldCheck className="h-4 w-4" />
                              </button>
                            )}

                            {/* Suspend / Reactivate */}
                            {!recruiter.is_owner && (
                              <button
                                onClick={() =>
                                  statusMutation.mutate({
                                    id: recruiter.id,
                                    status: isActive ? ACCOUNT_STATUS.SUSPENDED : ACCOUNT_STATUS.ACTIVE,
                                  })
                                }
                                disabled={statusMutation.isPending}
                                className={clsx(
                                  'rounded-lg p-1.5 transition-colors',
                                  isActive
                                    ? 'text-slate-400 hover:bg-amber-50 hover:text-amber-600'
                                    : 'text-emerald-600 hover:bg-emerald-50'
                                )}
                                title={isActive ? 'Suspend Access' : 'Reactivate Access'}
                              >
                                {isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </button>
                            )}

                            {/* Delete Button */}
                            {!recruiter.is_owner && (
                              <button
                                onClick={() => setDeletingRecruiter(recruiter)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                title="Remove Team Member"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {meta.total > 0 && (
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <p>
              Showing page <span className="font-semibold text-slate-700">{meta.current_page}</span> of{' '}
              <span className="font-semibold text-slate-700">{meta.last_page}</span> ({meta.total} members)
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={meta.current_page <= 1}
                onClick={() => {
                  const p = new URLSearchParams(searchParams)
                  p.set('page', String(meta.current_page - 1))
                  setSearchParams(p)
                }}
                className="rounded-lg border border-slate-200 px-2.5 py-1 font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={meta.current_page >= meta.last_page}
                onClick={() => {
                  const p = new URLSearchParams(searchParams)
                  p.set('page', String(meta.current_page + 1))
                  setSearchParams(p)
                }}
                className="rounded-lg border border-slate-200 px-2.5 py-1 font-medium hover:bg-slate-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      <InviteRecruiterModal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />

      {/* Change Role Modal */}
      {editingRoleRecruiter && (
        <ChangeRoleModal
          recruiter={editingRoleRecruiter}
          open={Boolean(editingRoleRecruiter)}
          onClose={() => setEditingRoleRecruiter(null)}
        />
      )}

      {/* Remove Confirmation Dialog */}
      {deletingRecruiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setDeletingRecruiter(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 border border-slate-100">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Remove Team Member?</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-900">{deletingRecruiter.name}</strong> from your organization? They will immediately lose access to your jobs and applicant pipelines.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-6">
              <button
                onClick={() => setDeletingRecruiter(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingRecruiter.id)}
                disabled={deleteMutation.isPending}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 shadow-sm disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Removing...' : 'Confirm Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

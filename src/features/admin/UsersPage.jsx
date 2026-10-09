import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  Briefcase,
  User,
  UserCheck,
  UserX,
  Trash2,
  Eye,
  AlertCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from 'lucide-react'
import { clsx } from 'clsx'
import { ROLES, ACCOUNT_STATUS } from '@/constants'
import { fetchUsers, toggleUserStatus, deleteUser } from './api/users'
import UserDetailDrawer from './components/UserDetailDrawer'
import EditUserRoleModal from './components/EditUserRoleModal'

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

export default function UsersPage() {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  const searchParam = searchParams.get('search') || ''
  const roleFilter = searchParams.get('role') || 'all'
  const statusFilter = searchParams.get('status') || 'all'
  const pageParam = parseInt(searchParams.get('page') || '1', 10)

  const [searchInput, setSearchInput] = useState(searchParam)
  const debouncedSearch = useDebounce(searchInput, 400)

  // Drawer & Modal States
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [roleModalUser, setRoleModalUser] = useState(null)
  const [deletingUser, setDeletingUser] = useState(null)

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

  // Fetch users
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['admin', 'users', { search: debouncedSearch, role: roleFilter, status: statusFilter, page: pageParam }],
    queryFn: () =>
      fetchUsers({
        search: debouncedSearch,
        role: roleFilter,
        status: statusFilter,
        page: pageParam,
      }),
  })

  // Toggle status mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => toggleUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      setDeletingUser(null)
    },
  })

  const users = data?.data || []
  const meta = data?.meta || { current_page: 1, last_page: 1, total: 0 }
  const counts = meta.counts || {
    total: 0,
    candidates: 0,
    partner_admins: 0,
    partner_recruiters: 0,
    super_admins: 0,
    active: 0,
    suspended: 0,
  }

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

  const handleStatusFilter = (e) => {
    const val = e.target.value
    const params = new URLSearchParams(searchParams)
    if (val === 'all') {
      params.delete('status')
    } else {
      params.set('status', val)
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const getRoleBadge = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return {
          label: 'Super Admin',
          icon: Shield,
          color: 'bg-rose-50 text-rose-700 ring-rose-600/20',
          avatarBg: 'bg-rose-100 text-rose-700',
        }
      case ROLES.PARTNER_ADMIN:
        return {
          label: 'Partner Admin',
          icon: ShieldCheck,
          color: 'bg-purple-50 text-purple-700 ring-purple-600/20',
          avatarBg: 'bg-purple-100 text-purple-700',
        }
      case ROLES.PARTNER_RECRUITER:
        return {
          label: 'Recruiter',
          icon: Briefcase,
          color: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
          avatarBg: 'bg-indigo-100 text-indigo-700',
        }
      default:
        return {
          label: 'Candidate',
          icon: User,
          color: 'bg-blue-50 text-blue-700 ring-blue-600/20',
          avatarBg: 'bg-blue-100 text-blue-700',
        }
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            User Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Oversee registered candidates, partner recruitment staff, and platform administrators.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: 'Total Platform Users',
            count: counts.total || 0,
            icon: Users,
            color: 'text-slate-700 bg-slate-50',
          },
          {
            label: 'Candidates',
            count: counts.candidates || 0,
            icon: User,
            color: 'text-blue-700 bg-blue-50',
          },
          {
            label: 'Partner Staff',
            count: (counts.partner_admins || 0) + (counts.partner_recruiters || 0),
            icon: Briefcase,
            color: 'text-purple-700 bg-purple-50',
          },
          {
            label: 'Super Admins',
            count: counts.super_admins || 0,
            icon: Shield,
            color: 'text-rose-700 bg-rose-50',
          },
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

      {/* Main Filter & Table Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        {/* Navigation Tabs & Search Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Role Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-2 sm:border-b-0 sm:pb-0">
            {[
              { id: 'all', label: 'All Users' },
              { id: ROLES.CANDIDATE, label: 'Candidates' },
              { id: ROLES.PARTNER_ADMIN, label: 'Partner Admins' },
              { id: ROLES.PARTNER_RECRUITER, label: 'Recruiters' },
              { id: ROLES.SUPER_ADMIN, label: 'Super Admins' },
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

          {/* Status Filter & Search Box */}
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-xs text-slate-800 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="all">All Statuses</option>
              <option value={ACCOUNT_STATUS.ACTIVE}>Active</option>
              <option value={ACCOUNT_STATUS.SUSPENDED}>Suspended</option>
            </select>

            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, email..."
                className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">User Details</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Partner Tenant</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Registered</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 w-44 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-24 bg-slate-200 rounded-full" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4"><div className="h-6 w-16 bg-slate-200 rounded-full" /></td>
                    <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded" /></td>
                    <td className="px-4 py-4 text-right"><div className="h-8 w-20 bg-slate-200 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-medium text-rose-600">
                    Failed to load users: {error?.message}
                    <div className="mt-2">
                      <button onClick={() => refetch()} className="text-xs text-indigo-600 underline">
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-3">
                      <Users className="h-6 w-6" />
                    </div>
                    <p className="text-base font-semibold text-slate-800">No users found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try clearing search keywords or role/status filters.
                    </p>
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const roleConfig = getRoleBadge(user.role)
                  const RoleIcon = roleConfig.icon
                  const isActive = user.status === ACCOUNT_STATUS.ACTIVE

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => setSelectedUserId(user.id)}
                    >
                      {/* User Identity */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={clsx(
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm',
                              roleConfig.avatarBg
                            )}
                          >
                            {user.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900 hover:text-indigo-600">
                                {user.name}
                              </span>
                              {user.is_protected && (
                                <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                                  Root Admin
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="px-4 py-4">
                        <span
                          className={clsx(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
                            roleConfig.color
                          )}
                        >
                          <RoleIcon className="h-3.5 w-3.5" />
                          {roleConfig.label}
                        </span>
                      </td>

                      {/* Partner Tenant */}
                      <td className="px-4 py-4 text-xs font-medium text-slate-700">
                        {user.partner_name ? (
                          <div className="flex items-center gap-1.5 text-slate-800">
                            <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            <span>{user.partner_name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Account Status */}
                      <td className="px-4 py-4">
                        <span
                          className={clsx(
                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                            isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
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
                      </td>

                      {/* Registered Date */}
                      <td className="px-4 py-4 text-xs text-slate-500">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            onClick={() => setSelectedUserId(user.id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            title="View Full Profile"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Role Change Modal */}
                          {!user.is_protected && (
                            <button
                              onClick={() => setRoleModalUser(user)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                              title="Edit Role & Permissions"
                            >
                              <ShieldCheck className="h-4 w-4" />
                            </button>
                          )}

                          {/* Suspend / Reactivate Toggle */}
                          {!user.is_protected && (
                            <button
                              onClick={() =>
                                statusMutation.mutate({
                                  id: user.id,
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
                              title={isActive ? 'Suspend User Access' : 'Reactivate User Account'}
                            >
                              {isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                            </button>
                          )}

                          {/* Delete Account */}
                          {!user.is_protected && (
                            <button
                              onClick={() => setDeletingUser(user)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                              title="Delete User Account"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
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
              <span className="font-semibold text-slate-700">{meta.last_page}</span> ({meta.total} platform users)
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

      {/* Slide-over Detail Drawer */}
      <UserDetailDrawer
        userId={selectedUserId}
        open={Boolean(selectedUserId)}
        onClose={() => setSelectedUserId(null)}
        onEditRole={(user) => setRoleModalUser(user)}
        onDeleteUser={(user) => setDeletingUser(user)}
      />

      {/* Edit Role Modal */}
      {roleModalUser && (
        <EditUserRoleModal
          user={roleModalUser}
          open={Boolean(roleModalUser)}
          onClose={() => setRoleModalUser(null)}
        />
      )}

      {/* Delete User Confirm Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setDeletingUser(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl z-10 border border-slate-100">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Delete User Account?</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-slate-900">{deletingUser.name}</strong> ({deletingUser.email})? All active sessions and permissions will be revoked immediately.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-6">
              <button
                onClick={() => setDeletingUser(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingUser.id)}
                disabled={deleteMutation.isPending}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 shadow-sm disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

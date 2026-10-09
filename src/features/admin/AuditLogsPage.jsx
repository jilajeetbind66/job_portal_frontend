import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Building2,
  Briefcase,
  Users,
  Clock,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Info,
  Terminal,
  Activity,
  UserCog,
  FileCheck,
  UserX,
  LogIn,
} from 'lucide-react'
import { clsx } from 'clsx'
import { useDebounce } from '@/hooks/useDebounce'
import { fetchAuditLogs } from './api/auditLogs'

// Action metadata mapping for badges and icons
const ACTION_CONFIG = {
  job_approved: {
    label: 'Job Approved',
    icon: CheckCircle2,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  job_rejected: {
    label: 'Job Rejected',
    icon: XCircle,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    iconColor: 'text-rose-600',
  },
  job_submitted: {
    label: 'Job Submitted',
    icon: Briefcase,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600',
  },
  partner_created: {
    label: 'Partner Provisioned',
    icon: Building2,
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconColor: 'text-indigo-600',
  },
  partner_suspended: {
    label: 'Partner Suspended',
    icon: AlertTriangle,
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    iconColor: 'text-amber-600',
  },
  user_role_changed: {
    label: 'Role Updated',
    icon: UserCog,
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600',
  },
  user_suspended: {
    label: 'User Suspended',
    icon: UserX,
    color: 'bg-rose-50 text-rose-700 border-rose-200',
    iconColor: 'text-rose-600',
  },
  company_profile_updated: {
    label: 'Company Profile Updated',
    icon: FileCheck,
    color: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    iconColor: 'text-cyan-600',
  },
  recruiter_invited: {
    label: 'Recruiter Invited',
    icon: Users,
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    iconColor: 'text-sky-600',
  },
  auth_login: {
    label: 'Super Admin Login',
    icon: LogIn,
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    iconColor: 'text-slate-600',
  },
}

function formatDateTime(isoString) {
  if (!isoString) return '—'
  const date = new Date(isoString)
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

function formatRelativeTime(isoString) {
  if (!isoString) return ''
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / (1000 * 60))
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function AuditLogsPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [actionFilter, setActionFilter] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 10

  const { data: logsResponse, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'audit-logs', { search: debouncedSearch, action: actionFilter, page, perPage }],
    queryFn: () =>
      fetchAuditLogs({
        search: debouncedSearch,
        action: actionFilter,
        page,
        perPage,
      }),
  })

  const logs = logsResponse?.data || []
  const meta = logsResponse?.meta || { current_page: 1, last_page: 1, total: 0 }

  const handleResetFilters = () => {
    setSearch('')
    setActionFilter('all')
    setPage(1)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Platform Audit Logs
            </h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              Compliance & Security
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Immutable record of administrative actions, moderation decisions, security events, and tenant modifications.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isLoading || isFetching}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={clsx('h-3.5 w-3.5', isFetching && 'animate-spin text-indigo-600')} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search by actor name, email, target entity, or notes..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Action Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
              <select
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value)
                  setPage(1)
                }}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
              >
                <option value="all">All Action Types</option>
                <option value="job_approved">Job Approved</option>
                <option value="job_rejected">Job Rejected</option>
                <option value="job_submitted">Job Submitted</option>
                <option value="partner_created">Partner Provisioned</option>
                <option value="partner_suspended">Partner Suspended</option>
                <option value="user_role_changed">Role Updated</option>
                <option value="user_suspended">User Suspended</option>
                <option value="company_profile_updated">Company Profile Updated</option>
                <option value="recruiter_invited">Recruiter Invited</option>
                <option value="auth_login">Super Admin Login</option>
              </select>
            </div>
          </div>

          {(search || actionFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors self-start md:self-center"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-10 w-10 rounded-xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 rounded bg-slate-100" />
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                </div>
                <div className="h-6 w-24 rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto h-8 w-8 text-rose-500" />
          <h3 className="mt-2 text-sm font-bold text-rose-900">Failed to load audit logs</h3>
          <p className="mt-1 text-xs text-rose-700">
            {error?.message || 'A network error occurred while retrieving system audit records.'}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 shadow-sm transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <ShieldAlert className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-slate-900">No audit logs found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {search || actionFilter !== 'all'
              ? 'No audit entries matched your active search query or filter criteria.'
              : 'The audit logging trail is currently empty.'}
          </p>
          {(search || actionFilter !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
            >
              Clear Search & Filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Timestamp
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Actor
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Action Event
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Target Resource
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Audit Note & IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {logs.map((log) => {
                  const actionMeta = ACTION_CONFIG[log.action] || {
                    label: log.action,
                    icon: Activity,
                    color: 'bg-slate-100 text-slate-700 border-slate-200',
                    iconColor: 'text-slate-500',
                  }
                  const ActionIcon = actionMeta.icon

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/75 transition-colors group"
                    >
                      {/* Timestamp */}
                      <td className="whitespace-nowrap px-5 py-4 text-slate-900">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <div>
                            <p className="font-semibold">{formatDateTime(log.created_at)}</p>
                            <p className="text-[10px] text-slate-400">
                              {formatRelativeTime(log.created_at)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Actor */}
                      <td className="px-5 py-4 text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 font-bold text-indigo-700 text-xs shrink-0">
                            {log.actor_name ? log.actor_name[0].toUpperCase() : 'A'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{log.actor_name}</p>
                            <p className="text-[11px] text-slate-500">{log.actor_email}</p>
                            <span className="inline-block mt-0.5 rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-semibold text-slate-600">
                              {log.actor_role}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Action Event */}
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={clsx(
                            'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold shadow-2xs',
                            actionMeta.color
                          )}
                        >
                          <ActionIcon className={clsx('h-3.5 w-3.5', actionMeta.iconColor)} />
                          <span>{actionMeta.label}</span>
                        </span>
                      </td>

                      {/* Target Resource */}
                      <td className="px-5 py-4">
                        <div className="max-w-xs">
                          <span className="inline-block rounded bg-indigo-50/80 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700 mb-1">
                            {log.target_type} #{log.target_id}
                          </span>
                          <p className="text-xs font-semibold text-slate-900 truncate">
                            {log.target_name}
                          </p>
                        </div>
                      </td>

                      {/* Audit Note & IP */}
                      <td className="px-5 py-4 text-slate-600">
                        <div className="max-w-md">
                          <p className="text-xs text-slate-700 leading-relaxed font-normal">
                            {log.note || 'No additional note provided.'}
                          </p>
                          {log.ip_address && (
                            <div className="mt-1 flex items-center gap-1 text-[10px] font-mono text-slate-400">
                              <Terminal className="h-3 w-3" />
                              <span>{log.ip_address}</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/50 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-slate-500">
              Showing <span className="font-semibold text-slate-800">{logs.length}</span> of{' '}
              <span className="font-semibold text-slate-800">{meta.total}</span> audit records
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white shadow-2xs transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <span className="px-2 text-xs font-semibold text-slate-600">
                Page {meta.current_page} of {meta.last_page}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                disabled={page >= meta.last_page}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white shadow-2xs transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

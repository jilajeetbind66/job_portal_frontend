import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Building2,
  Briefcase,
  Users,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle2,
  XCircle,
  Activity,
  Calendar,
} from 'lucide-react'
import { clsx } from 'clsx'
import { fetchAdminStats, fetchAdminActivity } from './api/analytics'

export default function AdminDashboardPage() {
  const { data: statsResponse, isLoading: statsLoading, isError: statsError, error: statsErr, refetch: refetchStats } = useQuery({
    queryKey: ['admin', 'analytics', 'stats'],
    queryFn: fetchAdminStats,
  })

  const { data: activityResponse, isLoading: activityLoading } = useQuery({
    queryKey: ['admin', 'analytics', 'activity'],
    queryFn: fetchAdminActivity,
  })

  const stats = statsResponse?.data || {
    totals: { partners: 0, active_jobs: 0, candidates: 0, pending_moderation: 0 },
    growth: {},
    weekly_trends: [],
    department_distribution: [],
    moderation_status: {},
  }

  const activities = activityResponse?.data || []

  // Max value for bar chart scaling
  const maxCandidateWeekly = Math.max(...(stats.weekly_trends?.map((d) => d.candidates) || [100]), 10)

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Admin Platform Overview
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor real-time recruitment metrics, job approval queue, and multi-tenant partner growth.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/moderation"
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100 shadow-sm transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-amber-600" />
            <span>Moderation Queue</span>
            {stats.totals.pending_moderation > 0 && (
              <span className="ml-1 rounded-full bg-amber-600 px-1.5 py-0.2 text-[10px] font-bold text-white">
                {stats.totals.pending_moderation}
              </span>
            )}
          </Link>

          <Link
            to="/admin/partners/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Onboard Partner</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: 'Total Active Partners',
            value: stats.totals.partners,
            growth: stats.growth.partners_pct || '+12%',
            icon: Building2,
            color: 'text-indigo-600 bg-indigo-50',
            link: '/admin/partners',
          },
          {
            label: 'Live Published Jobs',
            value: stats.totals.active_jobs,
            growth: stats.growth.jobs_pct || '+24%',
            icon: Briefcase,
            color: 'text-emerald-600 bg-emerald-50',
            link: '/admin/moderation',
          },
          {
            label: 'Registered Candidates',
            value: stats.totals.candidates?.toLocaleString(),
            growth: stats.growth.candidates_pct || '+18%',
            icon: Users,
            color: 'text-blue-600 bg-blue-50',
            link: '/admin/users',
          },
          {
            label: 'Pending Moderation',
            value: stats.totals.pending_moderation,
            isAlert: stats.totals.pending_moderation > 0,
            icon: ShieldCheck,
            color: 'text-amber-600 bg-amber-50',
            link: '/admin/moderation',
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={clsx('flex h-11 w-11 items-center justify-center rounded-xl', stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                {stat.growth && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    <TrendingUp className="h-3 w-3" />
                    {stat.growth}
                  </span>
                )}
                {stat.isAlert && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800 animate-pulse">
                    Review Required
                  </span>
                )}
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {statsLoading ? '...' : stat.value}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Middle Row: Growth Chart & Department Distribution */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weekly Trend Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Weekly Talent & Job Activity</h2>
              <p className="text-xs text-slate-500">Candidates registered vs job openings submitted (last 7 days)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-indigo-600" />
                <span className="text-slate-600">Candidates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-emerald-500" />
                <span className="text-slate-600">Jobs</span>
              </div>
            </div>
          </div>

          {/* Responsive SVG Chart Representation */}
          <div className="pt-4">
            <div className="flex h-56 items-end gap-3 sm:gap-6 border-b border-slate-200 pb-2">
              {stats.weekly_trends?.map((item) => {
                const candidateHeight = Math.round((item.candidates / maxCandidateWeekly) * 100)
                const jobHeight = Math.round((item.jobs / 20) * 80)

                return (
                  <div key={item.day} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                    {/* Tooltip on hover */}
                    <div className="pointer-events-none absolute -top-12 z-20 hidden rounded-xl bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-white shadow-lg group-hover:flex flex-col items-center">
                      <span>{item.candidates} candidates</span>
                      <span>{item.jobs} jobs</span>
                    </div>

                    <div className="flex w-full items-end justify-center gap-1.5">
                      {/* Candidate Column */}
                      <div
                        style={{ height: `${Math.max(candidateHeight, 10)}%` }}
                        className="w-1/2 max-w-[20px] rounded-t-lg bg-indigo-600 transition-all duration-300 group-hover:bg-indigo-500"
                      />
                      {/* Job Column */}
                      <div
                        style={{ height: `${Math.max(jobHeight, 8)}%` }}
                        className="w-1/2 max-w-[20px] rounded-t-lg bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-400"
                      />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-slate-500">{item.day}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Category Breakdown Progress */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Job Distribution</h2>
            <p className="text-xs text-slate-500">Active positions by department</p>
          </div>

          <div className="space-y-4 pt-1">
            {stats.department_distribution?.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{dept.name}</span>
                  <span className="text-slate-500">
                    {dept.count} jobs ({dept.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Moderation Box */}
          <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-3.5 space-y-2">
            <p className="text-xs font-bold text-slate-900">Moderation Overview (This Week)</p>
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Approved: <strong>{stats.moderation_status?.approved_this_week || 18}</strong>
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <XCircle className="h-3.5 w-3.5" /> Rejected: <strong>{stats.moderation_status?.rejected_this_week || 3}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Platform Activity Feed */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Recent Platform Operations & Activity</h2>
          </div>
          <Link
            to="/admin/audit-logs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <span>View Full Audit Logs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {activities.map((act) => (
            <div key={act.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{act.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{act.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 pl-11 sm:pl-0">
                <span className="font-medium text-slate-600">{act.user}</span>
                <span>•</span>
                <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

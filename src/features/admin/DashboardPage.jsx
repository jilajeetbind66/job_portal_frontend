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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F8F5]">
            Admin Platform Overview
          </h1>
          <p className="mt-1 text-sm text-[#91A6A0]">
            Monitor real-time recruitment metrics, job approval queue, and multi-tenant partner growth.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/moderation"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D6A84F]/30 bg-[#102A2B] px-3.5 py-2 text-xs font-semibold text-[#D6A84F] hover:bg-[#153536] shadow-sm transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-[#D6A84F]" />
            <span>Moderation Queue</span>
            {stats.totals.pending_moderation > 0 && (
              <span className="ml-1 rounded-full bg-[#D6A84F] px-1.5 py-0.2 text-[10px] font-bold text-[#07151A]">
                {stats.totals.pending_moderation}
              </span>
            )}
          </Link>

          <Link
            to="/admin/partners/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F7D5B] px-4 py-2 text-xs font-semibold text-[#F7F8F5] hover:bg-[#25684a] shadow-lg shadow-[#2F7D5B]/20 transition-all"
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
            color: 'text-[#B9D8C4] bg-[#2F7D5B]/20 border border-[#2F7D5B]/30',
            link: '/admin/partners',
          },
          {
            label: 'Live Published Jobs',
            value: stats.totals.active_jobs,
            growth: stats.growth.jobs_pct || '+24%',
            icon: Briefcase,
            color: 'text-[#B9D8C4] bg-[#2F7D5B]/20 border border-[#2F7D5B]/30',
            link: '/admin/moderation',
          },
          {
            label: 'Registered Candidates',
            value: stats.totals.candidates?.toLocaleString(),
            growth: stats.growth.candidates_pct || '+18%',
            icon: Users,
            color: 'text-[#E5B866] bg-[#D6A84F]/20 border border-[#D6A84F]/30',
            link: '/admin/users',
          },
          {
            label: 'Pending Moderation',
            value: stats.totals.pending_moderation,
            isAlert: stats.totals.pending_moderation > 0,
            icon: ShieldCheck,
            color: 'text-[#E5B866] bg-[#D6A84F]/15 border border-[#D6A84F]/30',
            link: '/admin/moderation',
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              to={stat.link}
              className="group rounded-2xl border border-[#294341] bg-[#0D2224] p-5 hover:border-[#2F7D5B] hover:bg-[#102A2B] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={clsx('flex h-11 w-11 items-center justify-center rounded-xl', stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                {stat.growth && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#2F7D5B]/20 border border-[#2F7D5B]/30 px-2.5 py-0.5 text-xs font-semibold text-[#B9D8C4]">
                    <TrendingUp className="h-3 w-3" />
                    {stat.growth}
                  </span>
                )}
                {stat.isAlert && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#D6A84F]/20 border border-[#D6A84F]/30 px-2 py-0.5 text-xs font-bold text-[#E5B866] animate-pulse">
                    Review Required
                  </span>
                )}
              </div>

              <div className="mt-4">
                <p className="text-xs font-medium text-[#91A6A0]">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-[#F7F8F5] group-hover:text-[#D6A84F] transition-colors">
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
        <div className="lg:col-span-2 rounded-2xl border border-[#294341] bg-[#0D2224] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#294341] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#F7F8F5]">Weekly Talent & Job Activity</h2>
              <p className="text-xs text-[#91A6A0]">Candidates registered vs job openings submitted (last 7 days)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-[#2F7D5B]" />
                <span className="text-[#91A6A0]">Candidates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-md bg-[#D6A84F]" />
                <span className="text-[#91A6A0]">Jobs</span>
              </div>
            </div>
          </div>

          {/* Responsive SVG Chart Representation */}
          <div className="pt-4">
            <div className="flex h-56 items-end gap-3 sm:gap-6 border-b border-[#294341] pb-2">
              {stats.weekly_trends?.map((item) => {
                const candidateHeight = Math.round((item.candidates / maxCandidateWeekly) * 100)
                const jobHeight = Math.round((item.jobs / 20) * 80)

                return (
                  <div key={item.day} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                    {/* Tooltip on hover */}
                    <div className="pointer-events-none absolute -top-12 z-20 hidden rounded-xl bg-[#102A2B] border border-[#294341] px-2.5 py-1 text-[11px] font-medium text-[#F7F8F5] shadow-lg group-hover:flex flex-col items-center">
                      <span>{item.candidates} candidates</span>
                      <span>{item.jobs} jobs</span>
                    </div>

                    <div className="flex w-full items-end justify-center gap-1.5">
                      {/* Candidate Column */}
                      <div
                        style={{ height: `${Math.max(candidateHeight, 10)}%` }}
                        className="w-1/2 max-w-[20px] rounded-t-lg bg-[#2F7D5B] transition-all duration-300 group-hover:bg-[#25684a]"
                      />
                      {/* Job Column */}
                      <div
                        style={{ height: `${Math.max(jobHeight, 8)}%` }}
                        className="w-1/2 max-w-[20px] rounded-t-lg bg-[#D6A84F] transition-all duration-300 group-hover:bg-[#E5B866]"
                      />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-[#91A6A0]">{item.day}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Category Breakdown Progress */}
        <div className="rounded-2xl border border-[#294341] bg-[#0D2224] p-6 space-y-4">
          <div className="border-b border-[#294341] pb-3">
            <h2 className="text-base font-bold text-[#F7F8F5]">Job Distribution</h2>
            <p className="text-xs text-[#91A6A0]">Active positions by department</p>
          </div>

          <div className="space-y-4 pt-1">
            {stats.department_distribution?.map((dept) => (
              <div key={dept.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#F7F8F5]">{dept.name}</span>
                  <span className="text-[#91A6A0]">
                    {dept.count} jobs ({dept.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#102A2B] border border-[#294341]">
                  <div
                    className="h-full rounded-full bg-[#2F7D5B] transition-all duration-500"
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Moderation Box */}
          <div className="mt-6 rounded-xl border border-[#294341] bg-[#102A2B] p-3.5 space-y-2">
            <p className="text-xs font-bold text-[#F7F8F5]">Moderation Overview (This Week)</p>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="flex items-center gap-1 text-[#B9D8C4]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#2F7D5B]" /> Approved: <strong className="text-[#F7F8F5]">{stats.moderation_status?.approved_this_week || 18}</strong>
              </span>
              <span className="flex items-center gap-1 text-rose-300">
                <XCircle className="h-3.5 w-3.5 text-rose-400" /> Rejected: <strong className="text-[#F7F8F5]">{stats.moderation_status?.rejected_this_week || 3}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Platform Activity Feed */}
      <div className="rounded-2xl border border-[#294341] bg-[#0D2224] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#294341] pb-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#2F7D5B]" />
            <h2 className="text-base font-bold text-[#F7F8F5]">Recent Platform Operations & Activity</h2>
          </div>
          <Link
            to="/admin/audit-logs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#D6A84F] hover:text-[#E5B866]"
          >
            <span>View Full Audit Logs</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-[#294341]">
          {activities.map((act) => (
            <div key={act.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-2">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#102A2B] border border-[#294341] text-[#D6A84F]">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#F7F8F5]">{act.title}</p>
                  <p className="text-xs text-[#91A6A0] mt-0.5">{act.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#91A6A0] pl-11 sm:pl-0">
                <span className="font-medium text-[#F7F8F5]">{act.user}</span>
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

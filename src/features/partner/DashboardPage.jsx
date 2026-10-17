import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Briefcase,
  Users,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  FileText,
  UserCheck,
  UserPlus,
} from 'lucide-react'
import { clsx } from 'clsx'
import { APPLICATION_STATUS, ROLES } from '@/constants'
import { useAuth } from '@/auth/useAuth'
import { fetchPartnerDashboard } from './api/dashboard'

const STAGE_CONFIG = {
  [APPLICATION_STATUS.APPLIED]: {
    label: 'Applied',
    color: 'bg-[#102A2B] text-[#B9D8C4] border-[#294341]',
    barColor: 'bg-[#8FAF9A]',
  },
  [APPLICATION_STATUS.SHORTLISTED]: {
    label: 'Shortlisted',
    color: 'bg-[#102A2B] text-[#D6A84F] border-[#294341]',
    barColor: 'bg-[#D6A84F]',
  },
  [APPLICATION_STATUS.INTERVIEW]: {
    label: 'Interviewing',
    color: 'bg-[#102A2B] text-[#E5B866] border-[#294341]',
    barColor: 'bg-[#E5B866]',
  },
  [APPLICATION_STATUS.OFFERED]: {
    label: 'Offer Extended',
    color: 'bg-[#102A2B] text-[#2F7D5B] border-[#294341]',
    barColor: 'bg-[#2F7D5B]',
  },
  [APPLICATION_STATUS.HIRED]: {
    label: 'Hired',
    color: 'bg-[#102A2B] text-[#B9D8C4] border-[#294341]',
    barColor: 'bg-[#B9D8C4]',
  },
  [APPLICATION_STATUS.REJECTED]: {
    label: 'Archived / Rejected',
    color: 'bg-[#102A2B] text-[#91A6A0] border-[#294341]',
    barColor: 'bg-[#91A6A0]',
  },
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

export default function PartnerDashboardPage() {
  const { role } = useAuth()
  const isPartnerAdmin = role === ROLES.PARTNER_ADMIN
  const { data: dashboardResponse, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['partner', 'dashboard'],
    queryFn: fetchPartnerDashboard,
  })

  const dashboard = dashboardResponse?.data || {
    company_name: 'Partner Workspace',
    metrics: {
      open_jobs: 0,
      total_applicants: 0,
      new_applicants_this_week: 0,
      pending_review_jobs: 0,
      needs_revision_jobs: 0,
      active_recruiters: 0,
    },
    pipeline_stages: {},
    recent_applicants: [],
    alerts: [],
  }

  const { metrics, pipeline_stages, recent_applicants, alerts, company_name } = dashboard

  // Calculate total applicants in pipeline stages for percentage calculations
  const totalInPipeline = Object.values(pipeline_stages || {}).reduce((acc, count) => acc + count, 0) || 1

  return (
    <div className="space-y-6 pb-12 text-[#F7F8F5]">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#F7F8F5]">
              {isPartnerAdmin ? 'Partner Recruitment Dashboard' : 'Recruiter Dashboard'}
            </h1>
            <span className="rounded-full bg-[#102A2B] border border-[#294341] px-3 py-0.5 text-xs font-semibold text-[#B9D8C4]">
              {company_name}
            </span>
          </div>
          <p className="mt-1 text-sm text-[#91A6A0]">
            {isPartnerAdmin
              ? 'Real-time candidate pipeline overview, active vacancies, and hiring team activities.'
              : 'Manage your vacancies, review applicants, and move candidates through your hiring pipeline.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#294341] bg-[#102A2B] px-3 py-2 text-xs font-semibold text-[#F7F8F5] hover:bg-[#153536] shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={clsx('h-3.5 w-3.5', isFetching && 'animate-spin text-[#D6A84F]')} />
            <span>Refresh</span>
          </button>

          <Link
            to="/partner/jobs/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#D6A84F] hover:bg-[#E5B866] px-4 py-2 text-xs font-bold text-[#172026] shadow-md transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Post a New Job</span>
          </Link>
        </div>
      </div>

      {/* Action Required Alert Banners */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex flex-col gap-3 rounded-2xl border border-[#D6A84F]/40 bg-[#102A2B] p-4 sm:flex-row sm:items-center sm:justify-between shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-[#0D2224] p-2 text-[#D6A84F] border border-[#294341] shrink-0">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F7F8F5]">{alert.title}</h4>
                  <p className="mt-0.5 text-xs text-[#91A6A0]">{alert.message}</p>
                </div>
              </div>
              {alert.link && (
                <Link
                  to={alert.link}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#D6A84F] hover:bg-[#E5B866] px-3.5 py-1.5 text-xs font-bold text-[#172026] shrink-0 shadow-sm transition-all"
                >
                  <span>Resolve Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl border border-[#294341] bg-[#0D2224] p-5 animate-pulse" />
            ))}
          </div>
          <div className="h-64 rounded-2xl border border-[#294341] bg-[#0D2224] p-6 animate-pulse" />
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-900/50 bg-[#102A2B] p-8 text-center shadow-md">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-400" />
          <h3 className="mt-2 text-sm font-bold text-rose-300">Failed to load partner dashboard</h3>
          <p className="mt-1 text-xs text-[#91A6A0]">
            {error?.message || 'Unable to connect to the recruitment analytics service.'}
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 shadow-sm transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : (
        <>
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              {
                label: 'Active Job Openings',
                value: metrics.open_jobs,
                subtext: 'Published on board',
                icon: Briefcase,
                color: 'text-[#B9D8C4] bg-[#102A2B] border border-[#294341]',
                link: '/partner/jobs',
              },
              {
                label: 'Total Applicants',
                value: metrics.total_applicants,
                subtext: 'All time applications',
                icon: Users,
                color: 'text-[#8FAF9A] bg-[#102A2B] border border-[#294341]',
                link: '/partner/jobs',
              },
              {
                label: 'New This Week',
                value: metrics.new_applicants_this_week,
                subtext: 'Applications received this week',
                icon: TrendingUp,
                color: 'text-[#2F7D5B] bg-[#102A2B] border border-[#294341]',
                link: '/partner/jobs',
              },
              {
                label: 'Moderation Queue',
                value: (metrics.pending_review_jobs || 0) + (metrics.needs_revision_jobs || 0),
                subtext: `${metrics.pending_review_jobs || 0} in review · ${metrics.needs_revision_jobs || 0} revision`,
                icon: AlertCircle,
                color: metrics.needs_revision_jobs > 0 ? 'text-[#D6A84F] bg-[#102A2B] border border-[#294341]' : 'text-[#91A6A0] bg-[#102A2B] border border-[#294341]',
                link: '/partner/jobs',
              },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <Link
                  key={stat.label}
                  to={stat.link}
                  className="group rounded-2xl border border-[#294341] bg-[#0D2224] p-5 shadow-sm hover:border-[#8FAF9A] hover:bg-[#102A2B] hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className={clsx('flex h-11 w-11 items-center justify-center rounded-xl', stat.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {stat.badge && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-[#102A2B] border border-[#294341] px-2 py-0.5 text-xs font-bold text-[#2F7D5B]">
                        <TrendingUp className="h-3 w-3" />
                        {stat.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-[#91A6A0]">{stat.label}</p>
                    <p className="mt-1 text-2xl font-extrabold tracking-tight text-[#F7F8F5] group-hover:text-[#B9D8C4] transition-colors">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] text-[#91A6A0]/80">{stat.subtext}</p>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Quick Actions Bar */}
          <div className={clsx('grid grid-cols-1 gap-4', isPartnerAdmin ? 'sm:grid-cols-3' : 'sm:grid-cols-2')}>
            <Link
              to="/partner/jobs/new"
              className="flex items-center gap-3.5 rounded-2xl border border-[#294341] bg-[#0D2224] p-4 shadow-sm hover:border-[#8FAF9A] hover:bg-[#102A2B] transition-all group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102A2B] text-[#D6A84F] border border-[#294341] group-hover:bg-[#D6A84F] group-hover:text-[#172026] transition-colors">
                <Plus className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#F7F8F5] truncate">Post a New Vacancy</h4>
                <p className="text-[11px] text-[#91A6A0]">Draft or publish a job role</p>
              </div>
              <ChevronRight className="h-4 w-4 text-[#91A6A0] group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {isPartnerAdmin ? (
              <>
                <Link
                  to="/partner/recruiters"
                  className="flex items-center gap-3.5 rounded-2xl border border-[#294341] bg-[#0D2224] p-4 shadow-sm hover:border-[#8FAF9A] hover:bg-[#102A2B] transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102A2B] text-[#8FAF9A] border border-[#294341] group-hover:bg-[#2F7D5B] group-hover:text-white transition-colors">
                    <UserPlus className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#F7F8F5] truncate">Manage Recruiter Team</h4>
                    <p className="text-[11px] text-[#91A6A0]">{metrics.active_recruiters || 0} active team members</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#91A6A0] group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/partner/company"
                  className="flex items-center gap-3.5 rounded-2xl border border-[#294341] bg-[#0D2224] p-4 shadow-sm hover:border-[#8FAF9A] hover:bg-[#102A2B] transition-all group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102A2B] text-[#B9D8C4] border border-[#294341] group-hover:bg-[#2F7D5B] group-hover:text-white transition-colors">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#F7F8F5] truncate">Company Profile</h4>
                    <p className="text-[11px] text-[#91A6A0]">Branding, perks &amp; locations</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#91A6A0] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </>
            ) : (
              <Link
                to="/partner/applicants"
                className="flex items-center gap-3.5 rounded-2xl border border-[#294341] bg-[#0D2224] p-4 shadow-sm hover:border-[#8FAF9A] hover:bg-[#102A2B] transition-all group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102A2B] text-[#B9D8C4] border border-[#294341] group-hover:bg-[#2F7D5B] group-hover:text-white transition-colors">
                  <Users className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#F7F8F5] truncate">Review Applicants</h4>
                  <p className="text-[11px] text-[#91A6A0]">Open your candidate pipeline</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#91A6A0] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>

          {/* Hiring Pipeline Funnel & Stage Breakdown */}
          <div className="rounded-2xl border border-[#294341] bg-[#0D2224] p-6 shadow-xl">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-[#294341] pb-4">
              <div>
                <h3 className="text-sm font-bold text-[#F7F8F5]">Recruitment Pipeline Funnel</h3>
                <p className="text-xs text-[#91A6A0]">Distribution of active candidates across all open positions</p>
              </div>
              <Link
                to="/partner/jobs"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#D6A84F] hover:text-[#E5B866] transition-colors"
              >
                <span>Open ATS</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {[
                APPLICATION_STATUS.APPLIED,
                APPLICATION_STATUS.SHORTLISTED,
                APPLICATION_STATUS.INTERVIEW,
                APPLICATION_STATUS.OFFERED,
                APPLICATION_STATUS.HIRED,
                APPLICATION_STATUS.REJECTED,
              ].map((stageKey) => {
                const stageMeta = STAGE_CONFIG[stageKey] || {
                  label: stageKey,
                  color: 'bg-[#102A2B] text-[#91A6A0] border-[#294341]',
                  barColor: 'bg-[#91A6A0]',
                }
                const count = pipeline_stages?.[stageKey] || 0
                const percentage = Math.round((count / totalInPipeline) * 100)

                return (
                  <div
                    key={stageKey}
                    className="flex flex-col justify-between rounded-xl border border-[#294341] bg-[#102A2B] p-4 transition-all hover:border-[#8FAF9A]"
                  >
                    <div>
                      <span className={clsx('inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold', stageMeta.color)}>
                        {stageMeta.label}
                      </span>
                      <p className="mt-3 text-2xl font-extrabold text-[#F7F8F5]">{count}</p>
                    </div>

                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full bg-[#0D2224] border border-[#294341] overflow-hidden">
                        <div
                          className={clsx('h-full rounded-full transition-all duration-500', stageMeta.barColor)}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[10px] font-medium text-[#91A6A0] text-right">{percentage}% of pool</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Candidate Applications Preview */}
          <div className="overflow-hidden rounded-2xl border border-[#294341] bg-[#0D2224] shadow-xl">
            <div className="flex items-center justify-between border-b border-[#294341] px-6 py-4">
              <div>
                <h3 className="text-sm font-bold text-[#F7F8F5]">Recent Candidate Applications</h3>
                <p className="text-xs text-[#91A6A0]">Newly received applications requiring initial screening or interview scheduling</p>
              </div>
              <Link
                to="/partner/jobs"
                className="text-xs font-bold text-[#D6A84F] hover:text-[#E5B866] transition-colors"
              >
                View all candidates
              </Link>
            </div>

            {recent_applicants && recent_applicants.length > 0 ? (
              <div className="divide-y divide-[#294341]">
                {recent_applicants.map((applicant) => {
                  const stageMeta = STAGE_CONFIG[applicant.status] || {
                    label: applicant.status,
                    color: 'bg-[#102A2B] text-[#91A6A0] border-[#294341]',
                  }

                  return (
                    <div
                      key={applicant.id}
                      className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between hover:bg-[#102A2B]/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102A2B] border border-[#294341] text-sm font-bold text-[#B9D8C4] shrink-0">
                          {applicant.candidate_name ? applicant.candidate_name[0] : 'C'}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#F7F8F5]">{applicant.candidate_name}</h4>
                          <p className="text-[11px] text-[#91A6A0]">{applicant.candidate_email}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-[11px] font-medium text-[#91A6A0]">
                              Applied for: <span className="font-semibold text-[#F7F8F5]">{applicant.job_title}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:self-center">
                        <span
                          className={clsx(
                            'inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold',
                            stageMeta.color
                          )}
                        >
                          {stageMeta.label}
                        </span>

                        <span className="text-[11px] text-[#91A6A0] whitespace-nowrap">
                          {formatRelativeTime(applicant.applied_at)}
                        </span>

                        <Link
                          to="/partner/jobs"
                          className="inline-flex items-center gap-1 rounded-lg border border-[#294341] bg-[#102A2B] px-2.5 py-1 text-xs font-semibold text-[#F7F8F5] hover:bg-[#153536] shadow-sm transition-colors"
                        >
                          <span>Review</span>
                          <ChevronRight className="h-3.5 w-3.5 text-[#91A6A0]" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-[#91A6A0]">
                No recent candidate applications received yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

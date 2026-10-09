import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Bookmark,
  FileText,
  CheckCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  ArrowRight,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { useAuth } from '@/auth/useAuth'
import { StatusBadge, EmptyState } from '@/components'
import { fetchCandidateDashboard } from '@/features/public/api/jobs'

export default function CandidateDashboardPage() {
  const { user } = useAuth()
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['candidate', 'dashboard'],
    queryFn: fetchCandidateDashboard,
  })

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse max-w-7xl mx-auto pb-16">
        <div className="h-8 bg-slate-200 rounded-xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-100 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-slate-100 rounded-2xl" />
      </div>
    )
  }

  const rawData = dashboardData?.data || dashboardData || {}
  const statsRaw = rawData.stats || {}
  const stats = {
    total_applications: statsRaw.total_applications ?? 0,
    shortlisted: statsRaw.shortlisted ?? 0,
    interviews: statsRaw.interviews ?? 0,
    saved_jobs: statsRaw.saved_jobs ?? 0,
  }
  const recentApplications = rawData.recent_applications || []
  const profileCompletion = rawData.profile_completion || 85
  const recommendedJobs = rawData.recommended_jobs || []

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto pb-16">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {getGreeting()}, {user?.name || 'Candidate'}! 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is what is happening with your job applications and recruitment pipeline today.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm transition-colors self-start sm:self-auto"
        >
          <Briefcase className="h-4 w-4" />
          <span>Find Jobs</span>
        </Link>
      </div>

      {/* Profile Completeness Alert (if < 100%) */}
      {profileCompletion < 100 && (
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/50 p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="rounded-xl bg-indigo-600 p-2 text-white shadow-2xs shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-slate-900">
                    Your Profile is {profileCompletion}% Complete
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.2 rounded-full">
                    Recruiter Visibility +75%
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Profiles with verified resume and comprehensive skills get 3x more interview invitations.
                </p>
              </div>
            </div>

            <Link
              to="/candidate/profile"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors whitespace-nowrap self-start sm:self-center"
            >
              <span>Complete Profile Now</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/candidate/applications"
          className="group bg-white rounded-2xl shadow-2xs p-5 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
              View All →
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-3">Total Applications</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            {stats.total_applications}
          </p>
        </Link>

        <Link
          to="/candidate/applications?status=shortlisted"
          className="group bg-white rounded-2xl shadow-2xs p-5 border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-purple-600 transition-colors">
              Active →
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-3">Shortlisted</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            {stats.shortlisted}
          </p>
        </Link>

        <Link
          to="/candidate/applications?status=interview"
          className="group bg-white rounded-2xl shadow-2xs p-5 border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-600 transition-colors">
              Rounds →
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-3">Interviews Scheduled</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            {stats.interviews}
          </p>
        </Link>

        <Link
          to="/candidate/saved-jobs"
          className="group bg-white rounded-2xl shadow-2xs p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <Bookmark className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
              Bookmarks →
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 mt-3">Saved Jobs</p>
          <p className="text-2xl font-bold tracking-tight text-slate-900 mt-0.5">
            {stats.saved_jobs}
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
              <p className="text-xs text-slate-500">Track your most recent job submissions</p>
            </div>
            <Link
              to="/candidate/applications"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              View all ({stats.total_applications}) →
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="bg-white shadow-2xs rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/75 transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {app.job?.company_logo ? (
                      <img
                        src={app.job.company_logo}
                        alt={app.job?.company_name}
                        className="h-10 w-10 rounded-xl object-cover shrink-0 border border-slate-100"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-indigo-600">
                          {(app.job?.company_name || 'C')[0]}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <Link
                        to={`/jobs/${app.job?.slug || app.job?.id}`}
                        className="text-xs font-bold text-slate-900 hover:text-indigo-600 truncate block transition-colors"
                      >
                        {app.job?.title}
                      </Link>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {app.job?.company_name} · {app.job?.location || 'Remote'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={app.status} />
                    {app.applied_at && (
                      <span className="text-[10px] text-slate-400">
                        {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active applications"
              description="You have not submitted applications yet. Browse published jobs to get started."
              action={
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Browse Jobs</span>
                </Link>
              }
            />
          )}

          {/* Recommended Jobs */}
          {recommendedJobs.length > 0 && (
            <div className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-900">Recommended Roles For You</h3>
                </div>
                <Link
                  to="/jobs"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  See all matches →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendedJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.slug || job.id}`}
                    className="group bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-2xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {job.title}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1 truncate">{job.company_name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{job.location}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full capitalize">
                        {job.workplace_type || 'Hybrid'}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Links Column (1 col) */}
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Quick Links</h2>
            <p className="text-xs text-slate-500">Fast shortcuts to candidate tools</p>
          </div>

          <div className="bg-white shadow-2xs rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {[
              {
                to: '/candidate/profile',
                title: 'Complete Your Profile',
                desc: 'Add experience & resume',
              },
              {
                to: '/jobs',
                title: 'Explore Live Vacancies',
                desc: 'Search tech & product roles',
              },
              {
                to: '/candidate/applications',
                title: 'Track Applications',
                desc: 'Check interview progress',
              },
              {
                to: '/candidate/saved-jobs',
                title: 'Saved Job Bookmarks',
                desc: 'Review shortlisted roles',
              },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="p-4 flex items-center justify-between group hover:bg-slate-50/75 transition-colors"
              >
                <div>
                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{link.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

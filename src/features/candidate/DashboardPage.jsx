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
        <div className="h-8 bg-[#102A2B] rounded-xl w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-[#0D2224] border border-[#294341] rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-[#0D2224] border border-[#294341] rounded-2xl" />
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F7F8F5]">
            {getGreeting()}, {user?.name || 'Candidate'}! 👋
          </h1>
          <p className="text-sm text-[#91A6A0] mt-1">
            Track your job applications, interviews, and career opportunities across India.
          </p>
        </div>

        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2F7D5B] px-5 py-2.5 text-xs font-semibold text-[#F7F8F5] hover:bg-[#25684a] shadow-lg shadow-[#2F7D5B]/20 transition-all self-start sm:self-auto"
        >
          <Briefcase className="h-4 w-4" />
          <span>Find Jobs</span>
        </Link>
      </div>

      {/* Profile Completeness Alert (if < 100%) */}
      {profileCompletion < 100 && (
        <div className="rounded-2xl border border-[#294341] bg-[#0D2224] p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="rounded-xl bg-[#2F7D5B]/20 border border-[#2F7D5B]/40 p-2.5 text-[#B9D8C4] shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-sm font-bold text-[#F7F8F5]">
                    Your Profile is {profileCompletion}% Complete
                  </h3>
                  <span className="text-[10px] font-bold text-[#D6A84F] bg-[#102A2B] px-2.5 py-0.5 rounded-full border border-[#D6A84F]/30">
                    Recruiter Visibility +75%
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#91A6A0]">
                  Profiles with verified resumes and comprehensive skills get 3x more interview invitations.
                </p>
              </div>
            </div>

            <Link
              to="/candidate/profile"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D6A84F] hover:text-[#E5B866] transition-colors whitespace-nowrap self-start sm:self-center"
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
          className="group bg-[#0D2224] rounded-2xl p-5 border border-[#294341] hover:border-[#2F7D5B] hover:bg-[#102A2B] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#2F7D5B]/20 text-[#B9D8C4] border border-[#2F7D5B]/30">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-[#91A6A0] group-hover:text-[#D6A84F] transition-colors">
              View All →
            </span>
          </div>
          <p className="text-xs font-medium text-[#91A6A0] mt-3">Total Applications</p>
          <p className="text-2xl font-bold tracking-tight text-[#F7F8F5] mt-0.5">
            {stats.total_applications}
          </p>
        </Link>

        <Link
          to="/candidate/applications?status=shortlisted"
          className="group bg-[#0D2224] rounded-2xl p-5 border border-[#294341] hover:border-[#D6A84F] hover:bg-[#102A2B] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#D6A84F]/20 text-[#E5B866] border border-[#D6A84F]/30">
              <CheckCircle className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-[#91A6A0] group-hover:text-[#D6A84F] transition-colors">
              Active →
            </span>
          </div>
          <p className="text-xs font-medium text-[#91A6A0] mt-3">Shortlisted</p>
          <p className="text-2xl font-bold tracking-tight text-[#F7F8F5] mt-0.5">
            {stats.shortlisted}
          </p>
        </Link>

        <Link
          to="/candidate/applications?status=interview"
          className="group bg-[#0D2224] rounded-2xl p-5 border border-[#294341] hover:border-[#D6A84F] hover:bg-[#102A2B] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#D6A84F]/15 text-[#E5B866] border border-[#D6A84F]/30">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-[#91A6A0] group-hover:text-[#D6A84F] transition-colors">
              Rounds →
            </span>
          </div>
          <p className="text-xs font-medium text-[#91A6A0] mt-3">Interviews Scheduled</p>
          <p className="text-2xl font-bold tracking-tight text-[#F7F8F5] mt-0.5">
            {stats.interviews}
          </p>
        </Link>

        <Link
          to="/candidate/saved-jobs"
          className="group bg-[#0D2224] rounded-2xl p-5 border border-[#294341] hover:border-[#2F7D5B] hover:bg-[#102A2B] transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-[#2F7D5B]/20 text-[#B9D8C4] border border-[#2F7D5B]/30">
              <Bookmark className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold text-[#91A6A0] group-hover:text-[#D6A84F] transition-colors">
              Bookmarks →
            </span>
          </div>
          <p className="text-xs font-medium text-[#91A6A0] mt-3">Saved Jobs</p>
          <p className="text-2xl font-bold tracking-tight text-[#F7F8F5] mt-0.5">
            {stats.saved_jobs}
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#F7F8F5]">Recent Applications</h2>
              <p className="text-xs text-[#91A6A0]">Track your most recent job submissions</p>
            </div>
            <Link
              to="/candidate/applications"
              className="text-xs font-semibold text-[#D6A84F] hover:text-[#E5B866] transition-colors"
            >
              View all ({stats.total_applications}) →
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="bg-[#0D2224] rounded-2xl border border-[#294341] divide-y divide-[#294341] overflow-hidden">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-4 flex items-center justify-between gap-4 hover:bg-[#102A2B] transition-colors"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {app.job?.company_logo ? (
                      <img
                        src={app.job.company_logo}
                        alt={app.job?.company_name}
                        className="h-10 w-10 rounded-xl object-cover shrink-0 border border-[#294341]"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-[#102A2B] border border-[#294341] flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-[#D6A84F]">
                          {(app.job?.company_name || 'C')[0]}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <Link
                        to={`/jobs/${app.job?.slug || app.job?.id}`}
                        className="text-xs font-bold text-[#F7F8F5] hover:text-[#D6A84F] truncate block transition-colors"
                      >
                        {app.job?.title}
                      </Link>
                      <p className="text-[11px] text-[#91A6A0] truncate mt-0.5">
                        {app.job?.company_name} · {app.job?.location || 'Remote'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={app.status} />
                    {app.applied_at && (
                      <span className="text-[10px] text-[#91A6A0]">
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
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#2F7D5B] px-4 py-2 text-xs font-semibold text-[#F7F8F5] hover:bg-[#25684a]"
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
                  <Sparkles className="h-4 w-4 text-[#D6A84F]" />
                  <h3 className="text-sm font-bold text-[#F7F8F5]">Recommended Roles For You</h3>
                </div>
                <Link
                  to="/jobs"
                  className="text-xs font-semibold text-[#D6A84F] hover:text-[#E5B866]"
                >
                  See all matches →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommendedJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.slug || job.id}`}
                    className="group bg-[#0D2224] p-4 rounded-xl border border-[#294341] hover:border-[#2F7D5B] hover:bg-[#102A2B] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-[#F7F8F5] group-hover:text-[#D6A84F] transition-colors line-clamp-1">
                        {job.title}
                      </p>
                      <p className="text-[11px] text-[#91A6A0] mt-1 truncate">{job.company_name}</p>
                      <p className="text-[10px] text-[#91A6A0]/70 mt-0.5">{job.location}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#294341] flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#B9D8C4] bg-[#102A2B] px-2 py-0.5 rounded-full capitalize border border-[#294341]">
                        {job.workplace_type || 'Hybrid'}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-[#91A6A0] group-hover:translate-x-0.5 transition-transform" />
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
            <h2 className="text-base font-bold text-[#F7F8F5]">Quick Links</h2>
            <p className="text-xs text-[#91A6A0]">Fast shortcuts to candidate tools</p>
          </div>

          <div className="bg-[#0D2224] rounded-2xl border border-[#294341] divide-y divide-[#294341] overflow-hidden">
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
                className="p-4 flex items-center justify-between group hover:bg-[#102A2B] transition-colors"
              >
                <div>
                  <h3 className="text-xs font-bold text-[#F7F8F5] group-hover:text-[#D6A84F] transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-[11px] text-[#91A6A0] mt-0.5">{link.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-[#91A6A0] group-hover:text-[#D6A84F] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

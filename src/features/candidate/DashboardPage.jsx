import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Briefcase, Bookmark, FileText, CheckCircle, Clock, ChevronRight } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '@/auth/useAuth'
import { StatusBadge, EmptyState } from '@/components'
import { fetchCandidateDashboard } from '@/features/public/api/jobs'

export default function DashboardPage() {
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
      <div className="p-6 space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded" />
      </div>
    )
  }

  const statsRaw = dashboardData?.data?.stats || dashboardData?.stats || {}
  const stats = {
    total_applications: statsRaw.total_applications ?? 0,
    shortlisted: statsRaw.shortlisted ?? 0,
    interviews: statsRaw.interviews ?? 0,
    saved_jobs: statsRaw.saved_jobs ?? 0,
  }
  const recentApplications =
    dashboardData?.data?.recent_applications || dashboardData?.recent_applications || []

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.name || 'Candidate'}!
        </h1>
        <p className="text-gray-500 mt-1">Here is what&apos;s happening with your job search.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          count={stats.total_applications}
          icon={FileText}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Shortlisted"
          count={stats.shortlisted}
          icon={CheckCircle}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Interviews"
          count={stats.interviews}
          icon={Clock}
          color="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Saved Jobs"
          count={stats.saved_jobs}
          icon={Bookmark}
          color="bg-green-100 text-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
            <Link
              to="/candidate/applications"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View all →
            </Link>
          </div>

          {recentApplications.length > 0 ? (
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 divide-y divide-gray-100">
              {recentApplications.map((app) => (
                <div key={app.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {app.job?.company_logo ? (
                      <img
                        src={app.job.company_logo}
                        alt={app.job?.company_name}
                        className="h-10 w-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-indigo-600">
                          {(app.job?.company_name || 'C')[0]}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <Link
                        to={`/jobs/${app.job?.slug || app.job?.id}`}
                        className="font-medium text-gray-900 hover:text-indigo-600 truncate block"
                      >
                        {app.job?.title}
                      </Link>
                      <p className="text-sm text-gray-500 truncate">{app.job?.company_name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status={app.status} />
                    {app.applied_at && (
                      <span className="text-xs text-gray-400">
                        {format(new Date(app.applied_at), 'MMM dd, yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No applications yet"
              description="You haven't applied to any jobs yet."
              action={
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  <Briefcase className="h-4 w-4" />
                  Browse Jobs
                </Link>
              }
            />
          )}
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Quick Links</h2>
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 flex flex-col">
            {[
              { to: '/candidate/profile', title: 'Complete Your Profile', desc: 'Stand out to recruiters' },
              { to: '/jobs', title: 'Browse Jobs', desc: 'Find your next role' },
              { to: '/candidate/applications', title: 'My Applications', desc: 'Track your progress' },
              { to: '/candidate/saved-jobs', title: 'Saved Jobs', desc: 'Jobs you bookmarked' },
            ].map((link, i) => (
              <Link
                key={link.to}
                to={link.to}
                className={`p-4 flex items-center justify-between group hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-100' : ''}`}
              >
                <div>
                  <h3 className="font-medium text-gray-900">{link.title}</h3>
                  <p className="text-sm text-gray-500">{link.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, count, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  )
}

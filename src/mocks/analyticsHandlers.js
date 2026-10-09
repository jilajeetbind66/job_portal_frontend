import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const analyticsHandlers = [
  // Admin stats & trends
  http.get(`${API}/api/v1/admin/analytics/stats`, () => {
    return HttpResponse.json({
      data: {
        totals: {
          partners: 14,
          active_jobs: 52,
          candidates: 1280,
          pending_moderation: 4,
          total_applications: 3420,
        },
        growth: {
          partners_pct: '+16.5%',
          jobs_pct: '+24.0%',
          candidates_pct: '+18.2%',
          applications_pct: '+31.4%',
        },
        weekly_trends: [
          { day: 'Mon', jobs: 6, candidates: 34 },
          { day: 'Tue', jobs: 9, candidates: 48 },
          { day: 'Wed', jobs: 12, candidates: 56 },
          { day: 'Thu', jobs: 8, candidates: 42 },
          { day: 'Fri', jobs: 15, candidates: 70 },
          { day: 'Sat', jobs: 4, candidates: 25 },
          { day: 'Sun', jobs: 3, candidates: 20 },
        ],
        department_distribution: [
          { name: 'Engineering', count: 24, percentage: 46 },
          { name: 'Product & Design', count: 12, percentage: 23 },
          { name: 'Sales & Marketing', count: 9, percentage: 17 },
          { name: 'Operations & HR', count: 7, percentage: 14 },
        ],
        moderation_status: {
          pending: 4,
          approved_this_week: 18,
          rejected_this_week: 3,
        },
      },
    })
  }),

  // Admin recent activity
  http.get(`${API}/api/v1/admin/analytics/activity`, () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          type: 'moderation_pending',
          title: 'New Job submitted for moderation',
          description: 'TechCorp submitted "Senior DevOps Engineer"',
          timestamp: '2026-10-09T09:45:00Z',
          user: 'TechCorp Admin',
        },
        {
          id: 2,
          type: 'partner_created',
          title: 'New Partner Onboarded',
          description: 'Tata Consultancy Services registered successfully',
          timestamp: '2026-10-09T08:30:00Z',
          user: 'Demo Admin',
        },
        {
          id: 3,
          type: 'job_approved',
          title: 'Job Posting Approved',
          description: '"Full Stack React Developer" published to public portal',
          timestamp: '2026-10-08T16:15:00Z',
          user: 'Demo Admin',
        },
        {
          id: 4,
          type: 'user_registered',
          title: 'High Candidate Inflow',
          description: '50+ new candidate registrations in last 24 hours',
          timestamp: '2026-10-08T14:00:00Z',
          user: 'System',
        },
        {
          id: 5,
          type: 'moderation_rejected',
          title: 'Job Posting Rejected',
          description: 'Returned "Junior Sales Exec" for salary clarity',
          timestamp: '2026-10-08T11:20:00Z',
          user: 'Demo Admin',
        },
      ],
    })
  }),
]


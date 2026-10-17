import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const analyticsHandlers = [
  http.get(`${API}/api/v1/admin/analytics`, () => {
    return HttpResponse.json({
      data: {
        partners: {
          total: 14,
          by_status: { active: 12, suspended: 2 },
        },
        jobs: {
          total: 62,
          by_status: {
            draft: 2,
            pending_review: 4,
            published: 52,
            closed: 1,
            rejected: 3,
          },
        },
        candidates: 1280,
        applications: {
          total: 3420,
          by_status: {
            applied: 1900,
            shortlisted: 700,
            interview: 400,
            offered: 120,
            hired: 80,
            rejected: 180,
            withdrawn: 40,
          },
        },
        signups_per_day: [
          { date: '2026-10-03', total: 34 },
          { date: '2026-10-04', total: 48 },
          { date: '2026-10-05', total: 56 },
          { date: '2026-10-06', total: 42 },
          { date: '2026-10-07', total: 70 },
          { date: '2026-10-08', total: 25 },
          { date: '2026-10-09', total: 20 },
        ],
      },
    })
  }),
]


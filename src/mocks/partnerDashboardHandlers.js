import { http, HttpResponse } from 'msw'
import { APPLICATION_STATUS, JOB_STATUS } from '@/constants'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export const partnerDashboardHandlers = [
  http.get(`${API}/api/v1/partner/dashboard`, () => {
    return HttpResponse.json({
      data: {
        company_name: 'TechCorp Solutions',
        metrics: {
          open_jobs: 6,
          total_applicants: 38,
          new_applicants_this_week: 14,
          pending_review_jobs: 2,
          needs_revision_jobs: 1,
          active_recruiters: 3,
        },
        pipeline_stages: {
          [APPLICATION_STATUS.APPLIED]: 12,
          [APPLICATION_STATUS.SHORTLISTED]: 10,
          [APPLICATION_STATUS.INTERVIEW]: 6,
          [APPLICATION_STATUS.OFFERED]: 3,
          [APPLICATION_STATUS.HIRED]: 4,
          [APPLICATION_STATUS.REJECTED]: 3,
        },
        recent_applicants: [
          {
            id: 101,
            candidate_name: 'Aditya Sharma',
            candidate_email: 'aditya.sharma@example.com',
            job_title: 'Senior Full Stack Engineer',
            status: APPLICATION_STATUS.INTERVIEW,
            applied_at: '2026-10-08T14:30:00Z',
          },
          {
            id: 102,
            candidate_name: 'Neha Gupta',
            candidate_email: 'neha.gupta@example.com',
            job_title: 'Product Manager (B2B SaaS)',
            status: APPLICATION_STATUS.SHORTLISTED,
            applied_at: '2026-10-08T11:15:00Z',
          },
          {
            id: 103,
            candidate_name: 'Siddharth Rao',
            candidate_email: 'siddharth.r@example.com',
            job_title: 'Senior DevOps & Cloud Architect',
            status: APPLICATION_STATUS.OFFERED,
            applied_at: '2026-10-07T16:00:00Z',
          },
          {
            id: 104,
            candidate_name: 'Kavita Nair',
            candidate_email: 'kavita.nair@example.com',
            job_title: 'Lead UI/UX Product Designer',
            status: APPLICATION_STATUS.APPLIED,
            applied_at: '2026-10-07T09:20:00Z',
          },
        ],
        alerts: [
          {
            id: 1,
            type: 'needs_revision',
            title: 'Action Required: 1 Job Posting Needs Revision',
            message: 'Moderator returned "Junior DevOps Engineer" with feedback: Add clear workplace policy (Hybrid/Onsite).',
            link: '/partner/jobs',
          },
        ],
      },
    })
  }),
]


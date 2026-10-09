import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const auditLogs = [
  {
    id: 1,
    action: 'job_approved',
    actor_name: 'Demo Admin',
    actor_email: 'admin@example.com',
    actor_role: 'super_admin',
    target_type: 'Job',
    target_name: 'Senior Full Stack Engineer (React & Node)',
    target_id: 1,
    ip_address: '192.168.1.101',
    note: 'Approved job submission. Ready for public candidate discovery.',
    created_at: '2026-10-09T09:15:00Z',
  },
  {
    id: 2,
    action: 'job_rejected',
    actor_name: 'Demo Admin',
    actor_email: 'admin@example.com',
    actor_role: 'super_admin',
    target_type: 'Job',
    target_name: 'Frontend Developer Intern',
    target_id: 4,
    ip_address: '192.168.1.101',
    note: 'Rejected: Stipend structure was ambiguous and missing office location.',
    created_at: '2026-10-08T16:30:00Z',
  },
  {
    id: 3,
    action: 'partner_created',
    actor_name: 'Demo Admin',
    actor_email: 'admin@example.com',
    actor_role: 'super_admin',
    target_type: 'Partner',
    target_name: 'Tata Consultancy Services',
    target_id: 2,
    ip_address: '192.168.1.101',
    note: 'Provisioned new enterprise partner tenant and sent admin invitation.',
    created_at: '2026-10-08T14:20:00Z',
  },
  {
    id: 4,
    action: 'user_role_changed',
    actor_name: 'Demo Admin',
    actor_email: 'admin@example.com',
    actor_role: 'super_admin',
    target_type: 'User',
    target_name: 'Priya Sharma (priya.recruiter@example.com)',
    target_id: 8,
    ip_address: '192.168.1.101',
    note: 'Promoted user from candidate to partner_recruiter.',
    created_at: '2026-10-08T11:45:00Z',
  },
  {
    id: 5,
    action: 'user_suspended',
    actor_name: 'Demo Admin',
    actor_email: 'admin@example.com',
    actor_role: 'super_admin',
    target_type: 'User',
    target_name: 'Rajesh Koothrappali (rajesh.k@example.com)',
    target_id: 10,
    ip_address: '192.168.1.101',
    note: 'Temporarily suspended user account due to repeated policy alerts.',
    created_at: '2026-10-07T15:10:00Z',
  },
  {
    id: 6,
    action: 'partner_suspended',
    actor_name: 'Demo Admin',
    actor_email: 'admin@example.com',
    actor_role: 'super_admin',
    target_type: 'Partner',
    target_name: 'Apex Recruiting Partners',
    target_id: 5,
    ip_address: '192.168.1.101',
    note: 'Suspended partner company during compliance document audit.',
    created_at: '2026-10-06T10:00:00Z',
  },
  {
    id: 7,
    action: 'company_profile_updated',
    actor_name: 'Demo Partner Admin',
    actor_email: 'partner@example.com',
    actor_role: 'partner_admin',
    target_type: 'Company',
    target_name: 'TechCorp Solutions',
    target_id: 1,
    ip_address: '49.207.182.44',
    note: 'Updated branding logo, employee perks, and headquarters address.',
    created_at: '2026-10-05T13:20:00Z',
  },
  {
    id: 8,
    action: 'job_submitted',
    actor_name: 'Demo Recruiter',
    actor_email: 'recruiter@example.com',
    actor_role: 'partner_recruiter',
    target_type: 'Job',
    target_name: 'Cloud Security Architect',
    target_id: 7,
    ip_address: '49.207.182.45',
    note: 'Draft finalized and submitted for admin moderation review.',
    created_at: '2026-10-04T09:35:00Z',
  },
  {
    id: 9,
    action: 'recruiter_invited',
    actor_name: 'Demo Partner Admin',
    actor_email: 'partner@example.com',
    actor_role: 'partner_admin',
    target_type: 'User',
    target_name: 'Karan Mehra (karan.m@example.com)',
    target_id: 12,
    ip_address: '49.207.182.44',
    note: 'Sent invitation email for Talent Acquisition Recruiter.',
    created_at: '2026-10-03T16:50:00Z',
  },
  {
    id: 10,
    action: 'auth_login',
    actor_name: 'Demo Admin',
    actor_email: 'admin@example.com',
    actor_role: 'super_admin',
    target_type: 'Session',
    target_name: 'Admin Session Token',
    target_id: 4,
    ip_address: '192.168.1.101',
    note: 'Successful dashboard authentication from Windows desktop.',
    created_at: '2026-10-03T08:00:00Z',
  },
]

export const auditLogHandlers = [
  http.get(`${API}/api/v1/admin/audit-logs`, ({ request }) => {
    const url = new URL(request.url)
    const search = (url.searchParams.get('search') || '').toLowerCase().trim()
    const action = url.searchParams.get('action')
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const perPage = parseInt(url.searchParams.get('per_page') || '10', 10)

    let filtered = [...auditLogs]

    if (search) {
      filtered = filtered.filter(
        (log) =>
          log.actor_name.toLowerCase().includes(search) ||
          log.actor_email.toLowerCase().includes(search) ||
          log.target_name.toLowerCase().includes(search) ||
          (log.note && log.note.toLowerCase().includes(search))
      )
    }

    if (action && action !== 'all') {
      filtered = filtered.filter((log) => log.action === action)
    }

    const total = filtered.length
    const lastPage = Math.max(1, Math.ceil(total / perPage))
    const start = (page - 1) * perPage
    const paginated = filtered.slice(start, start + perPage)

    return HttpResponse.json({
      data: paginated,
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total,
      },
    })
  }),
]


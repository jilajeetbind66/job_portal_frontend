import { http, HttpResponse } from 'msw'
import { ROLES, ACCOUNT_STATUS } from '@/constants'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

let users = [
  {
    id: 4,
    name: 'Demo Admin',
    email: 'admin@example.com',
    role: ROLES.SUPER_ADMIN,
    status: ACCOUNT_STATUS.ACTIVE,
    partner_id: null,
    partner_name: null,
    phone: '+91 99999 00001',
    created_at: '2026-01-10T08:00:00Z',
    applications_count: 0,
    jobs_count: 0,
    is_protected: true, // Super admin cannot delete or demote primary root admin
  },
  {
    id: 11,
    name: 'Sarah Jenkins',
    email: 'sarah.admin@example.com',
    role: ROLES.SUPER_ADMIN,
    status: ACCOUNT_STATUS.ACTIVE,
    partner_id: null,
    partner_name: null,
    phone: '+91 99999 00002',
    created_at: '2026-03-15T10:30:00Z',
    applications_count: 0,
    jobs_count: 0,
    is_protected: false,
  },
  {
    id: 2,
    name: 'Demo Partner Admin',
    email: 'partner@example.com',
    role: ROLES.PARTNER_ADMIN,
    status: ACCOUNT_STATUS.ACTIVE,
    partner_id: 1,
    partner_name: 'Infosys Technologies',
    phone: '+91 98765 43210',
    created_at: '2026-04-01T09:15:00Z',
    applications_count: 0,
    jobs_count: 14,
    is_protected: false,
  },
  {
    id: 3,
    name: 'Demo Recruiter',
    email: 'recruiter@example.com',
    role: ROLES.PARTNER_RECRUITER,
    status: ACCOUNT_STATUS.ACTIVE,
    partner_id: 1,
    partner_name: 'Infosys Technologies',
    phone: '+91 91234 56789',
    created_at: '2026-04-10T11:45:00Z',
    applications_count: 0,
    jobs_count: 8,
    is_protected: false,
  },
  {
    id: 9,
    name: 'Vikram Singhania',
    email: 'vikram.admin@example.com',
    role: ROLES.PARTNER_ADMIN,
    status: ACCOUNT_STATUS.ACTIVE,
    partner_id: 2,
    partner_name: 'Tata Consultancy Services',
    phone: '+91 98222 33445',
    created_at: '2026-05-12T14:20:00Z',
    applications_count: 0,
    jobs_count: 22,
    is_protected: false,
  },
  {
    id: 8,
    name: 'Priya Sharma',
    email: 'priya.recruiter@example.com',
    role: ROLES.PARTNER_RECRUITER,
    status: ACCOUNT_STATUS.ACTIVE,
    partner_id: 2,
    partner_name: 'Tata Consultancy Services',
    phone: '+91 98111 22334',
    created_at: '2026-05-20T16:00:00Z',
    applications_count: 0,
    jobs_count: 12,
    is_protected: false,
  },
  {
    id: 10,
    name: 'Rajesh Koothrappali',
    email: 'rajesh.k@example.com',
    role: ROLES.PARTNER_RECRUITER,
    status: ACCOUNT_STATUS.SUSPENDED,
    partner_id: 3,
    partner_name: 'Wipro Limited',
    phone: '+91 97777 88888',
    created_at: '2026-06-05T13:10:00Z',
    applications_count: 0,
    jobs_count: 3,
    is_protected: false,
  },
  {
    id: 1,
    name: 'Demo Candidate',
    email: 'candidate@example.com',
    role: ROLES.CANDIDATE,
    status: ACCOUNT_STATUS.ACTIVE,
    partner_id: null,
    partner_name: null,
    phone: '+91 90000 12345',
    created_at: '2026-06-15T10:00:00Z',
    applications_count: 4,
    jobs_count: 0,
    is_protected: false,
  },
  {
    id: 5,
    name: 'Aditya Sharma',
    email: 'aditya.sharma@example.com',
    role: ROLES.CANDIDATE,
    status: ACCOUNT_STATUS.ACTIVE,
    partner_id: null,
    partner_name: null,
    phone: '+91 98765 43210',
    created_at: '2026-07-02T11:25:00Z',
    applications_count: 6,
    jobs_count: 0,
    is_protected: false,
  },
  {
    id: 6,
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    role: ROLES.CANDIDATE,
    status: ACCOUNT_STATUS.ACTIVE,
    partner_id: null,
    partner_name: null,
    phone: '+91 98333 44556',
    created_at: '2026-07-18T15:40:00Z',
    applications_count: 2,
    jobs_count: 0,
    is_protected: false,
  },
  {
    id: 7,
    name: 'Rohan Mehta',
    email: 'rohan.mehta@example.com',
    role: ROLES.CANDIDATE,
    status: ACCOUNT_STATUS.SUSPENDED,
    partner_id: null,
    partner_name: null,
    phone: '+91 98444 55667',
    created_at: '2026-08-01T09:30:00Z',
    applications_count: 1,
    jobs_count: 0,
    is_protected: false,
  },
]

export const userHandlers = [
  // List Users
  http.get(`${API}/api/v1/admin/users`, ({ request }) => {
    const url = new URL(request.url)
    const search = (url.searchParams.get('search') || '').toLowerCase().trim()
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')
    const partnerId = url.searchParams.get('partner_id')
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const perPage = parseInt(url.searchParams.get('per_page') || '10', 10)

    let filtered = [...users]

    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          (u.phone && u.phone.includes(search)) ||
          (u.partner_name && u.partner_name.toLowerCase().includes(search))
      )
    }

    if (role && role !== 'all') {
      filtered = filtered.filter((u) => u.role === role)
    }

    if (status && status !== 'all') {
      filtered = filtered.filter((u) => u.status === status)
    }

    if (partnerId && partnerId !== 'all') {
      filtered = filtered.filter((u) => String(u.partner_id) === String(partnerId))
    }

    const total = filtered.length
    const lastPage = Math.max(1, Math.ceil(total / perPage))
    const start = (page - 1) * perPage
    const paginated = filtered.slice(start, start + perPage)

    // Summary metrics
    const counts = {
      total: users.length,
      candidates: users.filter((u) => u.role === ROLES.CANDIDATE).length,
      partner_admins: users.filter((u) => u.role === ROLES.PARTNER_ADMIN).length,
      partner_recruiters: users.filter((u) => u.role === ROLES.PARTNER_RECRUITER).length,
      super_admins: users.filter((u) => u.role === ROLES.SUPER_ADMIN).length,
      active: users.filter((u) => u.status === ACCOUNT_STATUS.ACTIVE).length,
      suspended: users.filter((u) => u.status === ACCOUNT_STATUS.SUSPENDED).length,
    }

    return HttpResponse.json({
      data: paginated,
      meta: {
        current_page: page,
        last_page: lastPage,
        per_page: perPage,
        total,
        counts,
      },
    })
  }),

  // User Detail
  http.get(`${API}/api/v1/admin/users/:id`, ({ params }) => {
    const { id } = params
    const user = users.find((u) => String(u.id) === String(id))

    if (!user) {
      return HttpResponse.json({ message: 'User not found.' }, { status: 404 })
    }

    return HttpResponse.json({ data: user })
  }),

  // Change Role
  http.patch(`${API}/api/v1/admin/users/:id/role`, async ({ params, request }) => {
    const { id } = params
    const { role } = await request.json()

    const user = users.find((u) => String(u.id) === String(id))
    if (!user) {
      return HttpResponse.json({ message: 'User not found.' }, { status: 404 })
    }

    if (user.is_protected) {
      return HttpResponse.json(
        { message: 'Primary root Super Admin role cannot be modified.' },
        { status: 403 }
      )
    }

    user.role = role
    // If converted to candidate or super admin, clear partner
    if (role === ROLES.CANDIDATE || role === ROLES.SUPER_ADMIN) {
      user.partner_id = null
      user.partner_name = null
    }

    return HttpResponse.json({
      message: `User role updated to ${role}.`,
      data: user,
    })
  }),

  // Toggle Account Status
  http.patch(`${API}/api/v1/admin/users/:id/status`, async ({ params, request }) => {
    const { id } = params
    const { status } = await request.json()

    const user = users.find((u) => String(u.id) === String(id))
    if (!user) {
      return HttpResponse.json({ message: 'User not found.' }, { status: 404 })
    }

    if (user.is_protected) {
      return HttpResponse.json(
        { message: 'Primary root Super Admin cannot be suspended.' },
        { status: 403 }
      )
    }

    user.status = status
    return HttpResponse.json({
      message: `User account is now ${status}.`,
      data: user,
    })
  }),

  // Delete User
  http.delete(`${API}/api/v1/admin/users/:id`, ({ params }) => {
    const { id } = params
    const user = users.find((u) => String(u.id) === String(id))

    if (!user) {
      return HttpResponse.json({ message: 'User not found.' }, { status: 404 })
    }

    if (user.is_protected) {
      return HttpResponse.json(
        { message: 'Cannot delete primary root Super Admin.' },
        { status: 403 }
      )
    }

    users = users.filter((u) => String(u.id) !== String(id))
    return HttpResponse.json({ message: 'User successfully deleted.' }, { status: 200 })
  }),
]


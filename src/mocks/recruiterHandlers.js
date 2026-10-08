import { http, HttpResponse } from 'msw'
import { ROLES, ACCOUNT_STATUS } from '@/constants'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

let recruiters = [
  {
    id: 1,
    name: 'Vikas Pandey',
    email: 'partner@example.com',
    role: ROLES.PARTNER_ADMIN,
    status: ACCOUNT_STATUS.ACTIVE,
    avatar: null,
    phone: '+91 98765 43210',
    department: 'Talent Acquisition',
    created_at: '2026-08-15T09:00:00Z',
    is_owner: true,
  },
  {
    id: 2,
    name: 'Tanzeem Ahmad',
    email: 'recruiter@example.com',
    role: ROLES.PARTNER_RECRUITER,
    status: ACCOUNT_STATUS.ACTIVE,
    avatar: null,
    phone: '+91 91234 56789',
    department: 'Engineering Hiring',
    created_at: '2026-09-01T11:30:00Z',
    is_owner: false,
  },
  {
    id: 3,
    name: 'Priya Sharma',
    email: 'priya.recruiter@example.com',
    role: ROLES.PARTNER_RECRUITER,
    status: ACCOUNT_STATUS.ACTIVE,
    avatar: null,
    phone: '+91 98111 22334',
    department: 'Product & Design',
    created_at: '2026-09-10T14:15:00Z',
    is_owner: false,
  },
  {
    id: 4,
    name: 'Rahul Verma',
    email: 'rahul.v@example.com',
    role: ROLES.PARTNER_RECRUITER,
    status: ACCOUNT_STATUS.SUSPENDED,
    avatar: null,
    phone: '+91 99887 76655',
    department: 'Sales & Ops',
    created_at: '2026-09-18T16:00:00Z',
    is_owner: false,
  },
]

export const recruiterHandlers = [
  // List Recruiters
  http.get(`${API}/api/v1/partner/recruiters`, ({ request }) => {
    const url = new URL(request.url)
    const search = (url.searchParams.get('search') || '').toLowerCase().trim()
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const perPage = parseInt(url.searchParams.get('per_page') || '10', 10)

    let filtered = [...recruiters]

    if (search) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(search) ||
          r.email.toLowerCase().includes(search) ||
          (r.department && r.department.toLowerCase().includes(search))
      )
    }

    if (role && role !== 'all') {
      filtered = filtered.filter((r) => r.role === role)
    }

    if (status && status !== 'all') {
      filtered = filtered.filter((r) => r.status === status)
    }

    const total = filtered.length
    const lastPage = Math.max(1, Math.ceil(total / perPage))
    const start = (page - 1) * perPage
    const paginated = filtered.slice(start, start + perPage)

    // Summary counts
    const counts = {
      total: recruiters.length,
      admins: recruiters.filter((r) => r.role === ROLES.PARTNER_ADMIN).length,
      recruiters: recruiters.filter((r) => r.role === ROLES.PARTNER_RECRUITER).length,
      active: recruiters.filter((r) => r.status === ACCOUNT_STATUS.ACTIVE).length,
      suspended: recruiters.filter((r) => r.status === ACCOUNT_STATUS.SUSPENDED).length,
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

  // Invite Recruiter
  http.post(`${API}/api/v1/partner/recruiters/invite`, async ({ request }) => {
    const payload = await request.json()
    const { name, email, role = ROLES.PARTNER_RECRUITER, department = 'General' } = payload

    if (!name || !email) {
      return HttpResponse.json(
        { message: 'Validation failed', errors: { email: ['Name and email are required.'] } },
        { status: 422 }
      )
    }

    const existing = recruiters.find((r) => r.email.toLowerCase() === email.toLowerCase())
    if (existing) {
      return HttpResponse.json(
        { message: 'This email is already a team member.', errors: { email: ['Member with this email already exists.'] } },
        { status: 422 }
      )
    }

    const newRecruiter = {
      id: Date.now(),
      name,
      email,
      role,
      status: ACCOUNT_STATUS.ACTIVE,
      avatar: null,
      department,
      created_at: new Date().toISOString(),
      is_owner: false,
    }

    recruiters.unshift(newRecruiter)

    return HttpResponse.json(
      {
        message: `Invitation successfully sent to ${email}`,
        data: newRecruiter,
      },
      { status: 201 }
    )
  }),

  // Update Role
  http.patch(`${API}/api/v1/partner/recruiters/:id/role`, async ({ params, request }) => {
    const { id } = params
    const { role } = await request.json()

    const recruiter = recruiters.find((r) => String(r.id) === String(id))
    if (!recruiter) {
      return HttpResponse.json({ message: 'Recruiter not found.' }, { status: 404 })
    }

    if (recruiter.is_owner) {
      return HttpResponse.json({ message: 'Primary account owner role cannot be changed.' }, { status: 403 })
    }

    recruiter.role = role
    return HttpResponse.json({
      message: 'Role updated successfully.',
      data: recruiter,
    })
  }),

  // Toggle Status
  http.patch(`${API}/api/v1/partner/recruiters/:id/status`, async ({ params, request }) => {
    const { id } = params
    const { status } = await request.json()

    const recruiter = recruiters.find((r) => String(r.id) === String(id))
    if (!recruiter) {
      return HttpResponse.json({ message: 'Recruiter not found.' }, { status: 404 })
    }

    if (recruiter.is_owner) {
      return HttpResponse.json({ message: 'Primary account owner cannot be suspended.' }, { status: 403 })
    }

    recruiter.status = status
    return HttpResponse.json({
      message: `User status changed to ${status}.`,
      data: recruiter,
    })
  }),

  // Remove Recruiter
  http.delete(`${API}/api/v1/partner/recruiters/:id`, ({ params }) => {
    const { id } = params
    const recruiter = recruiters.find((r) => String(r.id) === String(id))

    if (!recruiter) {
      return HttpResponse.json({ message: 'Recruiter not found.' }, { status: 404 })
    }

    if (recruiter.is_owner) {
      return HttpResponse.json({ message: 'Cannot remove primary partner owner.' }, { status: 403 })
    }

    recruiters = recruiters.filter((r) => String(r.id) !== String(id))
    return HttpResponse.json({ message: 'Recruiter removed from organization.' }, { status: 200 })
  }),
]


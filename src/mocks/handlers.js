import { http, HttpResponse } from 'msw'
import { ROLES } from '@/constants'
import { partnerHandlers } from './partnerHandlers'
import { jobHandlers } from './jobHandlers'
import { applicantHandlers } from './applicantHandlers'
import { recruiterHandlers } from './recruiterHandlers'
import { companyHandlers } from './companyHandlers'
import { publicHandlers } from './publicHandlers'

// Backend ready na ho to ye fake auth API chalti hai (VITE_USE_MOCKS=true).
// Login: email "candidate@", "partner@", "recruiter@" ya "admin@" se shuru ho, password "password".
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

const usersByRole = {
  [ROLES.CANDIDATE]: {
    id: 1,
    name: 'Demo Candidate',
    email: 'candidate@example.com',
    partner_id: null,
  },
  [ROLES.PARTNER_ADMIN]: {
    id: 2,
    name: 'Demo Partner Admin',
    email: 'partner@example.com',
    partner_id: 1,
  },
  [ROLES.PARTNER_RECRUITER]: {
    id: 3,
    name: 'Demo Recruiter',
    email: 'recruiter@example.com',
    partner_id: 1,
  },
  [ROLES.SUPER_ADMIN]: { id: 4, name: 'Demo Admin', email: 'admin@example.com', partner_id: null },
}

const permissionsByRole = {
  [ROLES.CANDIDATE]: [],
  [ROLES.PARTNER_ADMIN]: ['jobs.create', 'jobs.publish', 'applications.view', 'recruiters.manage'],
  [ROLES.PARTNER_RECRUITER]: ['jobs.create', 'applications.view'],
  [ROLES.SUPER_ADMIN]: ['partners.manage', 'jobs.moderate', 'users.manage', 'analytics.view'],
}

const roleByEmailPrefix = {
  candidate: ROLES.CANDIDATE,
  partner: ROLES.PARTNER_ADMIN,
  recruiter: ROLES.PARTNER_RECRUITER,
  admin: ROLES.SUPER_ADMIN,
}

let currentRole = null

// Tests me seedha "is role se logged in" set karne ke liye
export function setMockRole(role) {
  currentRole = role
}

const validationError = (field, message) =>
  HttpResponse.json({ message, errors: { [field]: [message] } }, { status: 422 })

export const handlers = [
  http.get(`${API}/sanctum/csrf-cookie`, () => new HttpResponse(null, { status: 204 })),

  http.get(`${API}/api/v1/auth/me`, () => {
    if (!currentRole) return HttpResponse.json({ message: 'Unauthenticated.' }, { status: 401 })
    return HttpResponse.json({
      data: {
        user: { ...usersByRole[currentRole], role: currentRole },
        role: currentRole,
        permissions: permissionsByRole[currentRole],
      },
    })
  }),

  http.post(`${API}/api/v1/auth/login`, async ({ request }) => {
    const { email = '', password } = await request.json()
    const role = roleByEmailPrefix[email.split('@')[0]]
    if (!role || password !== 'password') {
      return validationError('email', 'These credentials do not match our records.')
    }
    currentRole = role
    return HttpResponse.json({ message: 'Logged in' })
  }),

  http.post(`${API}/api/v1/auth/logout`, () => {
    currentRole = null
    return new HttpResponse(null, { status: 204 })
  }),

  http.post(`${API}/api/v1/auth/register`, async ({ request }) => {
    const { email } = await request.json()
    if (email === 'taken@example.com') {
      return validationError('email', 'The email has already been taken.')
    }
    currentRole = ROLES.CANDIDATE
    return HttpResponse.json({ message: 'Registered' }, { status: 201 })
  }),

  http.post(`${API}/api/v1/auth/forgot-password`, () =>
    HttpResponse.json({ message: 'We have emailed your password reset link.' }),
  ),

  http.post(`${API}/api/v1/auth/reset-password`, async ({ request }) => {
    const { token } = await request.json()
    if (token === 'expired')
      return validationError('email', 'This password reset token is invalid.')
    return HttpResponse.json({ message: 'Your password has been reset.' })
  }),
  ...partnerHandlers,
  ...jobHandlers,
  ...applicantHandlers,
  ...recruiterHandlers,
  ...companyHandlers,
  ...publicHandlers,
]

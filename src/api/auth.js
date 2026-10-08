import { api, getCsrfCookie } from './client'

// /auth/me ka response { data: { user, role, permissions } } ya seedha { user, role, permissions }
// ho sakta hai. Backend ka final shape aane par sirf yahi function badlega.
function normalizeSession(body) {
  const payload = body?.data ?? body
  const user = payload?.user ?? payload
  return {
    user,
    role: payload?.role ?? user?.role ?? null,
    permissions: payload?.permissions ?? user?.permissions ?? [],
  }
}

export async function fetchMe() {
  const { data } = await api.get('/auth/me')
  return normalizeSession(data)
}

export async function loginRequest(credentials) {
  await getCsrfCookie()
  await api.post('/auth/login', credentials)
}

export async function registerRequest(payload) {
  await getCsrfCookie()
  await api.post('/auth/register', payload)
}

export async function logoutRequest() {
  await api.post('/auth/logout')
}

export async function forgotPasswordRequest(email) {
  await getCsrfCookie()
  await api.post('/auth/forgot-password', { email })
}

export async function resetPasswordRequest(payload) {
  await getCsrfCookie()
  await api.post('/auth/reset-password', payload)
}

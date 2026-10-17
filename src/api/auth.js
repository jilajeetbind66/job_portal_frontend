import { api, clearCsrfCookieCache, getCsrfCookie } from './client'

let pendingSessionRequest = null

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
  if (!pendingSessionRequest) {
    pendingSessionRequest = api
      .get('/auth/me')
      .then(({ data }) => normalizeSession(data))
      .finally(() => {
        pendingSessionRequest = null
      })
  }

  return pendingSessionRequest
}

export async function loginRequest(credentials) {
  await getCsrfCookie()
  const { data } = await api.post('/auth/login', credentials)
  return normalizeSession(data)
}

export async function registerRequest(payload) {
  await getCsrfCookie()
  const { data } = await api.post('/auth/register', payload)
  return normalizeSession(data)
}

export async function logoutRequest() {
  try {
    await api.post('/auth/logout')
  } finally {
    clearCsrfCookieCache()
  }
}

export async function forgotPasswordRequest(email) {
  await getCsrfCookie()
  await api.post('/auth/forgot-password', { email })
}

export async function resetPasswordRequest(payload) {
  await getCsrfCookie()
  await api.post('/auth/reset-password', payload)
}

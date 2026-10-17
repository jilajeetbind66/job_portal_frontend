import axios from 'axios'

export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const CSRF_COOKIE_CACHE_MS = 5 * 60 * 1000
let csrfCookiePromise = null
let csrfCookieExpiresAt = 0

export const api = axios.create({
  baseURL: `${API_BASE}/api/v1`,
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
})

// Sanctum SPA login se pehle ek baar CSRF cookie leni padti hai
export function clearCsrfCookieCache() {
  csrfCookieExpiresAt = 0
}

export function getCsrfCookie({ forceRefresh = false } = {}) {
  if (csrfCookiePromise) {
    return csrfCookiePromise
  }

  if (!forceRefresh && Date.now() < csrfCookieExpiresAt) {
    return Promise.resolve()
  }

  csrfCookiePromise = axios
    .get(`${API_BASE}/sanctum/csrf-cookie`, {
      withCredentials: true,
    })
    .then((response) => {
      csrfCookieExpiresAt = Date.now() + CSRF_COOKIE_CACHE_MS
      return response
    })
    .catch((error) => {
      csrfCookieExpiresAt = 0
      throw error
    })
    .finally(() => {
      csrfCookiePromise = null
    })

  return csrfCookiePromise
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const config = error.config

    // 419: CSRF token expire. Cookie dobara lo aur request ek baar retry karo
    if (status === 419 && config && !config._retried) {
      config._retried = true
      await getCsrfCookie({ forceRefresh: true })
      return api(config)
    }

    // 401: session khatam. AuthProvider sunta hai aur user ko logout kar deta hai.
    // /auth/me ka 401 normal hai (login nahi hai), usse event nahi bhejte.
    if (status === 401 && !config?.url?.endsWith('/auth/me')) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }

    return Promise.reject(error)
  },
)

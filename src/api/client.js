import axios from 'axios'

export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,
  withXSRFToken: true,
  headers: { Accept: 'application/json' },
})

// Sanctum SPA login se pehle ek baar CSRF cookie leni padti hai
export function getCsrfCookie() {
  return axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  })
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const config = error.config

    // 419: CSRF token expire. Cookie dobara lo aur request ek baar retry karo
    if (status === 419 && config && !config._retried) {
      config._retried = true
      await getCsrfCookie()
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

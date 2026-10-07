import axios from 'axios'

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
  (error) => {
    const status = error.response?.status
    // TODO(auth step): 401 par login page, 403 par "access nahi hai", 419 par CSRF dobara lena
    if (status === 401 || status === 403 || status === 419) {
      console.warn(`API ${status}`)
    }
    return Promise.reject(error)
  },
)

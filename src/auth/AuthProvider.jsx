import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchMe, loginRequest, logoutRequest, registerRequest } from '@/api/auth'
import { UNAUTHORIZED_EVENT } from '@/api/client'
import { AuthContext } from './useAuth'

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // App khulte hi pata karo ki cookie se koi logged in hai ya nahi
  useEffect(() => {
    let active = true
    fetchMe()
      .then((s) => active && setSession(s))
      .catch(() => active && setSession(null))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [])

  // Kisi bhi API call par 401 aaye to user ko logged out maan lo
  useEffect(() => {
    const onUnauthorized = () => setSession(null)
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
  }, [])

  const refresh = useCallback(async () => {
    try {
      const s = await fetchMe()
      setSession(s)
      return s
    } catch {
      setSession(null)
      return null
    }
  }, [])

  const login = useCallback(
    async (credentials) => {
      await loginRequest(credentials)
      return refresh()
    },
    [refresh],
  )

  const register = useCallback(
    async (payload) => {
      await registerRequest(payload)
      // Backend register ke baad login kara de to session mil jayega, warna null
      return refresh()
    },
    [refresh],
  )

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      setSession(null)
    }
  }, [])

  const value = useMemo(() => {
    const permissions = session?.permissions ?? []
    return {
      user: session?.user ?? null,
      role: session?.role ?? null,
      permissions,
      loading,
      isAuthenticated: Boolean(session?.user),
      // UI me buttons chhupane ke liye. Asli check backend karta hai.
      can: (permission) => permissions.includes(permission),
      login,
      register,
      logout,
      refresh,
    }
  }, [session, loading, login, register, logout, refresh])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

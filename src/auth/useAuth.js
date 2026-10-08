import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

// { user, role, permissions, loading, isAuthenticated, can(permission),
//   login(credentials), register(payload), logout(), refresh() }
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth ko AuthProvider ke andar use karo')
  return ctx
}

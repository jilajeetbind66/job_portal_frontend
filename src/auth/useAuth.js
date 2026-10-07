import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

// TODO(auth step): user, role, can(permission), login(), logout()
export function useAuth() {
  return useContext(AuthContext)
}

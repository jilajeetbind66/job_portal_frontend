import { AuthContext } from './useAuth'

// TODO(auth step): GET /auth/me se user, role aur permissions load karna
export default function AuthProvider({ children }) {
  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>
}

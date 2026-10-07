import { Outlet } from 'react-router-dom'

// TODO(auth step): login nahi to /login, galat role to apne portal par
export default function RequireRole() {
  return <Outlet />
}

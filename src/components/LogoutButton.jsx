import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/auth/useAuth'
import Button from './Button'

// Kisi bhi layout ke header/sidebar me daal sakte ho
export default function LogoutButton({ variant = 'ghost', size = 'sm', children = 'Logout' }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  const onClick = async () => {
    setBusy(true)
    try {
      await logout()
    } finally {
      setBusy(false)
      navigate('/login', { replace: true })
    }
  }

  return (
    <Button variant={variant} size={size} onClick={onClick} loading={busy}>
      <LogOut className="h-4 w-4" aria-hidden="true" />
      {children}
    </Button>
  )
}

import { useContext } from 'react'
import { ToastContext } from '@/components/toastContext'

// const toast = useToast(); toast.success('Saved'); toast.error('Failed')
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast ko ToastProvider ke andar use karo')
  return ctx
}

import { useCallback, useMemo, useState } from 'react'
import clsx from 'clsx'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { ToastContext } from './toastContext'

const icons = { success: CheckCircle2, error: XCircle, info: Info }
const colors = {
  success: 'border-green-300 bg-green-50 text-green-900',
  error: 'border-red-300 bg-red-50 text-red-900',
  info: 'border-blue-300 bg-blue-50 text-blue-900',
}

let nextId = 1

export default function ToastProvider({ children, duration = 4000 }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const show = useCallback(
    (type, message) => {
      const id = nextId++
      setToasts((list) => [...list, { id, type, message }])
      setTimeout(() => dismiss(id), duration)
    },
    [dismiss, duration],
  )

  const api = useMemo(
    () => ({
      success: (m) => show('success', m),
      error: (m) => show('error', m),
      info: (m) => show('info', m),
    }),
    [show],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="fixed right-4 top-4 z-[60] flex w-80 flex-col gap-2"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const Icon = icons[t.type]
          return (
            <div
              key={t.id}
              className={clsx(
                'flex items-start gap-2 rounded-md border p-3 text-sm',
                colors[t.type],
              )}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <p className="flex-1">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss">
                <X className="h-4 w-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

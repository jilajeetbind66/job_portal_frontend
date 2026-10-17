import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api/client'
import { useAuth } from '@/auth/useAuth'

export default function NotificationBell({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const unreadQuery = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const { data } = await api.get('/notifications/unread-count')
      return data.unread_count
    },
    enabled: isAuthenticated,
    refetchInterval: 60_000,
  })

  const notificationsQuery = useQuery({
    queryKey: ['notifications', 'list'],
    queryFn: async () => {
      const { data } = await api.get('/notifications')
      return data
    },
    enabled: isAuthenticated && isOpen,
  })

  const markReadMutation = useMutation({
    mutationFn: (notificationId) => api.patch(`/notifications/${notificationId}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  })

  const unreadCount = unreadQuery.data ?? 0
  const notifications = notificationsQuery.data?.data ?? []

  const handleToggle = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setIsOpen((open) => !open)
  }

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read_at) {
        await markReadMutation.mutateAsync(notification.id)
      }
    } catch {
      return
    }

    setIsOpen(false)
    if (notification.data?.url) {
      navigate(notification.data.url)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        className={`relative rounded-xl p-2 text-[#91A6A0] transition-colors hover:bg-[#102A2B] hover:text-[#F7F8F5] ${className}`}
        aria-label={unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={handleToggle}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-[#D6A84F] px-1 text-center text-[10px] font-bold leading-4 text-[#172026]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && isAuthenticated && (
        <section
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-[#294341] bg-[#0D2224] shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-[#294341] px-4 py-3">
            <h2 className="text-sm font-bold text-[#F7F8F5]">Notifications</h2>
            <span className="text-xs text-[#91A6A0]">{unreadCount} unread</span>
          </div>

          {notificationsQuery.isLoading ? (
            <p className="px-4 py-6 text-center text-sm text-[#91A6A0]">Loading notifications...</p>
          ) : notificationsQuery.isError ? (
            <p className="px-4 py-6 text-center text-sm text-rose-300">Notifications are unavailable.</p>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[#91A6A0]">You’re all caught up.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <button
                    type="button"
                    className={`w-full border-b border-[#294341] px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[#102A2B] ${notification.read_at ? '' : 'bg-[#102A2B]/60'}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <span className="flex items-start gap-2">
                      {!notification.read_at && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#D6A84F]" />}
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-[#F7F8F5]">
                          {notification.data?.title ?? 'Notification'}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-[#91A6A0]">
                          {notification.data?.message ?? ''}
                        </span>
                        {notification.created_at && (
                          <span className="mt-1 block text-[11px] text-[#91A6A0]/75">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
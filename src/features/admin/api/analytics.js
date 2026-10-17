import { api } from '@/api/client'

/**
 * Fetch platform-wide analytics and statistics for Super Admin
 */
export async function fetchAdminStats() {
  const { data } = await api.get('/admin/analytics')
  return data
}

/**
 * Fetch recent activity feed for Admin Dashboard
 */
export async function fetchAdminActivity() {
  const { data } = await api.get('/admin/audit-logs', {
    params: { per_page: 5 },
  })
  return data
}


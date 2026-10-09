import { api } from '@/api/client'

/**
 * Fetch platform-wide analytics and statistics for Super Admin
 */
export async function fetchAdminStats() {
  const { data } = await api.get('/admin/analytics/stats')
  return data
}

/**
 * Fetch recent activity feed for Admin Dashboard
 */
export async function fetchAdminActivity() {
  const { data } = await api.get('/admin/analytics/activity')
  return data
}


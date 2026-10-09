import { api } from '@/api/client'

/**
 * Fetch overview dashboard metrics, recent candidates, and moderation notices for the current partner
 */
export async function fetchPartnerDashboard() {
  const { data } = await api.get('/partner/dashboard')
  return data
}


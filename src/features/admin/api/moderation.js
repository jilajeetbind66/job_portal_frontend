import { api } from '@/api/client'

/**
 * Fetch jobs in the moderation queue
 */
export async function fetchModerationQueue({ status = 'pending_review', search = '', page = 1, perPage = 10 } = {}) {
  const { data } = await api.get('/admin/jobs', {
    params: {
      status: status === 'all' ? undefined : status,
      search: search || undefined,
      page,
      per_page: perPage,
    },
  })
  return data
}

/**
 * Fetch detailed job review data including partner info
 */
export async function fetchJobForReview(id) {
  const { data } = await api.get(`/admin/jobs/${id}`)
  return data
}

/**
 * Approve and publish a job
 */
export async function approveJob(id) {
  const { data } = await api.patch(`/admin/jobs/${id}/approve`)
  return data
}

/**
 * Reject a job with a mandatory rejection reason
 */
export async function rejectJob(id, { reason }) {
  const { data } = await api.patch(`/admin/jobs/${id}/reject`, { reason })
  return data
}


import { api } from '@/api/client'

/**
 * Fetch partner's jobs list with filters and pagination
 */
export async function fetchPartnerJobs({ status = '', search = '', page = 1, perPage = 10 } = {}) {
  const { data } = await api.get('/partner/jobs', {
    params: {
      status: status && status !== 'all' ? status : undefined,
      search: search || undefined,
      page,
      per_page: perPage,
    },
  })
  return data
}

/**
 * Fetch single job details
 */
export async function fetchPartnerJob(id) {
  const { data } = await api.get(`/partner/jobs/${id}`)
  return data
}

/**
 * Create a new job (Draft or Pending Review)
 * NOTE: partner_id is NEVER sent in the payload (enforced per multi-tenant scoping)
 */
export async function createPartnerJob(payload) {
  const { data } = await api.post('/partner/jobs', payload)
  return data
}

/**
 * Submit a saved draft job for moderation review
 */
export async function submitPartnerJobForReview(id) {
  const { data } = await api.post(`/partner/jobs/${id}/submit-review`)
  return data
}

/**
 * Update an existing job
 */
export async function updatePartnerJob(id, payload) {
  const { data } = await api.put(`/partner/jobs/${id}`, payload)
  return data
}

/**
 * Change status of a job (e.g. close, reopen to draft, or submit for review)
 */
export async function updatePartnerJobStatus(id, status) {
  const { data } = await api.patch(`/partner/jobs/${id}/status`, { status })
  return data
}

/**
 * Delete a draft job
 */
export async function deletePartnerJob(id) {
  const { data } = await api.delete(`/partner/jobs/${id}`)
  return data
}


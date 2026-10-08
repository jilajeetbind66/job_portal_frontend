import { api } from '@/api/client'

/**
 * Fetch applications list with filters
 */
export async function fetchApplications({ jobId, status = '', search = '', page = 1, perPage = 10 } = {}) {
  const { data } = await api.get('/partner/applications', {
    params: {
      job_id: jobId || undefined,
      status: status === 'all' ? undefined : status || undefined,
      search: search || undefined,
      page,
      per_page: perPage,
    },
  })
  return data
}

/**
 * Fetch application details with candidate profile, resume, and timeline
 */
export async function fetchApplicationDetail(id) {
  const { data } = await api.get(`/partner/applications/${id}`)
  return data
}

/**
 * Update application status with workflow validation and audit note
 */
export async function updateApplicationStatus(id, { status, note = '' }) {
  const { data } = await api.patch(`/partner/applications/${id}/status`, {
    status,
    note: note.trim() || undefined,
  })
  return data
}


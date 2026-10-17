import { api } from '@/api/client'

/**
 * Fetch recruiters for the current partner
 */
export async function fetchRecruiters({ search = '', role = '', status = '', page = 1, perPage = 10 } = {}) {
  const { data } = await api.get('/partner/recruiters', {
    params: {
      search: search || undefined,
      role: role && role !== 'all' ? role : undefined,
      status: status && status !== 'all' ? status : undefined,
      page,
      per_page: perPage,
    },
  })
  return data
}

/**
 * Invite a new recruiter / admin to the partner team
 */
export async function inviteRecruiter({ name, email, role, department }) {
  const { data } = await api.post('/partner/recruiters/invite', {
    name,
    email,
    role,
    department,
  })
  return data
}

/**
 * Update recruiter role (partner_admin <-> partner_recruiter)
 */
export async function updateRecruiterRole(id, role) {
  const { data } = await api.patch(`/partner/recruiters/${id}/role`, {
    role,
  })
  return data
}

/**
 * Toggle recruiter active/suspended status
 */
export async function toggleRecruiterStatus(id, status) {
  const { data } = await api.patch(`/partner/recruiters/${id}/status`, {
    status,
  })
  return data
}

/**
 * Remove recruiter from partner team
 */
export async function deleteRecruiter(id) {
  const { data } = await api.delete(`/partner/recruiters/${id}`)
  return data
}


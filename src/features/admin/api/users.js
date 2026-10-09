import { api } from '@/api/client'

/**
 * Fetch platform users with search, role, status, and partner filters
 */
export async function fetchUsers({
  search = '',
  role = '',
  status = '',
  partnerId = '',
  page = 1,
  perPage = 10,
} = {}) {
  const { data } = await api.get('/admin/users', {
    params: {
      search: search || undefined,
      role: role && role !== 'all' ? role : undefined,
      status: status && status !== 'all' ? status : undefined,
      partner_id: partnerId && partnerId !== 'all' ? partnerId : undefined,
      page,
      per_page: perPage,
    },
  })
  return data
}

/**
 * Fetch detailed user information
 */
export async function fetchUserDetail(id) {
  const { data } = await api.get(`/admin/users/${id}`)
  return data
}

/**
 * Change a user's role (candidate, partner_recruiter, partner_admin, super_admin)
 */
export async function updateUserRole(id, role) {
  const { data } = await api.patch(`/admin/users/${id}/role`, {
    role,
  })
  return data
}

/**
 * Toggle user account status (active, suspended)
 */
export async function toggleUserStatus(id, status) {
  const { data } = await api.patch(`/admin/users/${id}/status`, {
    status,
  })
  return data
}

/**
 * Delete a user account from the platform
 */
export async function deleteUser(id) {
  const { data } = await api.delete(`/admin/users/${id}`)
  return data
}


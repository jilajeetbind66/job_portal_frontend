import { api } from '@/api/client'

/**
 * Fetch platform audit logs with search, action type, and date filters
 */
export async function fetchAuditLogs({
  search = '',
  action = '',
  actor = '',
  dateRange = 'all',
  page = 1,
  perPage = 10,
} = {}) {
  const { data } = await api.get('/admin/audit-logs', {
    params: {
      search: search || undefined,
      action: action && action !== 'all' ? action : undefined,
      actor: actor || undefined,
      date_range: dateRange && dateRange !== 'all' ? dateRange : undefined,
      page,
      per_page: perPage,
    },
  })
  return data
}


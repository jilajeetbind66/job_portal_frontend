import { api } from '@/api/client'

/**
 * Fetch current partner's company profile
 */
export async function fetchCompanyProfile() {
  const { data } = await api.get('/partner/company')
  return data
}

/**
 * Update partner's company profile
 */
export async function updateCompanyProfile(payload) {
  const { data } = await api.put('/partner/company', payload)
  return data
}

/**
 * Upload company logo
 */
export async function uploadCompanyLogo(file) {
  const formData = new FormData()
  formData.append('logo', file)
  const { data } = await api.post('/partner/company/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}


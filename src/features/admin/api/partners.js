import { api } from '@/api/client';

export const fetchPartners = async ({ search = '', status = '', page = 1, perPage = 15 } = {}) => {
  const { data } = await api.get('/admin/partners', {
    params: { search, status: status === 'ALL' ? undefined : status, page, per_page: perPage },
  });
  return data;
};

export const fetchPartner = async (id) => {
  const { data } = await api.get(`/admin/partners/${id}`);
  return data;
};

const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  });
  return formData;
};

export const createPartner = async (data) => {
  let payload = data;
  if (!(data instanceof FormData) && (data.logo instanceof File || data.logo instanceof Blob)) {
    payload = createFormData(data);
  }
  const response = await api.post('/admin/partners', payload);
  return response.data;
};

export const updatePartner = async (id, data) => {
  if (data instanceof FormData) {
    if (!data.has('_method')) {
      data.append('_method', 'PUT');
    }
    const response = await api.post(`/admin/partners/${id}`, data);
    return response.data;
  }

  if (data.logo instanceof File || data.logo instanceof Blob) {
    const payload = createFormData(data);
    payload.append('_method', 'PUT');
    const response = await api.post(`/admin/partners/${id}`, payload);
    return response.data;
  }

  const response = await api.put(`/admin/partners/${id}`, data);
  return response.data;
};

export const toggleSuspendPartner = async (id) => {
  const { data } = await api.patch(`/admin/partners/${id}/suspend`);
  return data;
};

export const createPartnerAdmin = async (partnerId, data) => {
  const response = await api.post(`/admin/partners/${partnerId}/admin-user`, data);
  return response.data;
};

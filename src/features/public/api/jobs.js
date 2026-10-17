import { api } from '@/api/client';

export const fetchJobs = async (params) => {
  const { data } = await api.get('/public/jobs', { params });
  return data;
};

export const fetchJobBySlug = async (slug) => {
  const { data } = await api.get(`/public/jobs/${slug}`);
  return data.data;
};

export const fetchCompanyBySlug = async (slug, params) => {
  const { data } = await api.get(`/public/companies/${slug}`, { params });
  return data.data;
};

export const fetchCompanies = async (params) => {
  const { data } = await api.get('/public/companies', { params });
  return data;
};

export const saveJob = async (jobId) => {
  const { data } = await api.post('/candidate/saved-jobs', { job_id: jobId });
  return data;
};

export const unsaveJob = async (jobId) => {
  const { data } = await api.delete(`/candidate/saved-jobs/${jobId}`);
  return data;
};

export const applyToJob = async (jobId, payload) => {
  const { data } = await api.post(`/candidate/jobs/${jobId}/apply`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

export const fetchSavedJobs = async (params) => {
  const { data } = await api.get('/candidate/saved-jobs', { params });
  return data;
};

export const fetchMyApplications = async (params) => {
  const { data } = await api.get('/candidate/applications', { params });
  return data;
};

export const fetchProfile = async () => {
  const { data } = await api.get('/candidate/profile');
  return data.data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put('/candidate/profile', payload);
  return data.data;
};

export const uploadResume = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('resume', file);
  const { data } = await api.post('/candidate/profile/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return data;
};

export const fetchCandidateDashboard = async () => {
  const { data } = await api.get('/candidate/dashboard');
  return data.data;
};


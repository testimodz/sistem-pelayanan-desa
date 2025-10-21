import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor untuk menambahkan token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Surat API
export const suratAPI = {
  // Get all surat
  getAll: (params) => api.get('/surat', { params }),
  
  // Get surat by ID
  getById: (id) => api.get(`/surat/${id}`),
  
  // Create surat
  create: (data) => api.post('/surat', data),
  
  // Update surat
  update: (id, data) => api.put(`/surat/${id}`, data),
  
  // Delete surat
  delete: (id) => api.delete(`/surat/${id}`),
  
  // Ajukan surat
  ajukan: (id) => api.patch(`/surat/${id}/ajukan`),
  
  // Proses surat (petugas)
  proses: (id) => api.patch(`/surat/${id}/proses`),
  
  // Selesaikan surat (petugas)
  selesai: (id, data) => api.patch(`/surat/${id}/selesai`, data),
  
  // Tolak surat (petugas)
  tolak: (id, data) => api.patch(`/surat/${id}/tolak`, data),
  
  // Get statistik
  getStats: () => api.get('/surat/stats/all'),
};

export default api;

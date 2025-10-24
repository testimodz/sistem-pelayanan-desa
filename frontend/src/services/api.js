import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  register: async (userData) => {
    return api.post('/auth/register', userData);
  },
  
  getProfile: async () => {
    return api.get('/auth/profile');
  },
  
  updateProfile: async (userData) => {
    return api.put('/auth/profile', userData);
  },
  
  changePassword: async (passwords) => {
    return api.put('/auth/change-password', passwords);
  },
};

// ==================== USER API ====================
export const userAPI = {
  getAll: async (params = {}) => {
    return api.get('/users', { params });
  },
  
  getById: async (id) => {
    return api.get(`/users/${id}`);
  },
  
  create: async (userData) => {
    return api.post('/users', userData);
  },
  
  update: async (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },
  
  delete: async (id) => {
    return api.delete(`/users/${id}`);
  },
  
  updateRole: async (id, role) => {
    return api.patch(`/users/${id}/role`, { role });
  },
};

// ==================== SURAT API ====================
export const suratAPI = {
  // Get all surat with filters & pagination
  getAll: async (params = {}) => {
    return api.get('/surat', { params });
  },
  
  // Get surat by ID
  getById: async (id) => {
    return api.get(`/surat/${id}`);
  },
  
  // Create new surat (petugas input manual data pemohon)
  create: async (suratData) => {
    return api.post('/surat', suratData);
  },
  
  // Update surat
  update: async (id, suratData) => {
    return api.put(`/surat/${id}`, suratData);
  },
  
  // Delete surat (admin only)
  delete: async (id) => {
    return api.delete(`/surat/${id}`);
  },
  
  // Archive/Unarchive surat
  archive: async (id) => {
    return api.patch(`/surat/${id}/archive`);
  },
  
  // Get statistics
  getStats: async () => {
    return api.get('/surat/stats/summary');
  },
  
  // ✅ BARU - Get arsip surat (>1 tahun atau yang diarsipkan)
  getArsip: async (params = {}) => {
    return api.get('/surat/arsip', { params });
  },
  
  // ✅ BARU - Get laporan/statistik lengkap
  getLaporan: async (params = {}) => {
    return api.get('/surat/laporan', { params });
  },
  
  // NOTE: PDF generation moved to client-side using html2pdf.js
  // No need for downloadPDF API call anymore
};

// ==================== DASHBOARD API ====================
export const dashboardAPI = {
  getStats: async () => {
    return api.get('/surat/stats/summary');
  },
  
  getRecentSurat: async (limit = 10) => {
    return api.get('/surat', { params: { limit } });
  },
};

export default api;

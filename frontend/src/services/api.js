import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: Attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexvo_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Automatic token refresh when 401 received
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('nexvo_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          const newAccessToken = res.data.access;
          localStorage.setItem('nexvo_access_token', newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshErr) {
          // Refresh failed, clear tokens
          localStorage.removeItem('nexvo_access_token');
          localStorage.removeItem('nexvo_refresh_token');
          localStorage.removeItem('nexvo_user');
          window.dispatchEvent(new Event('nexvo-auth-change'));
        }
      }
    }
    return Promise.reject(error);
  }
);

// API Service Methods
export const ApiService = {
  // Public & Admin Features
  getFeatures: async (all = false) => {
    const res = await api.get('/features/');
    return res.data;
  },
  createFeature: async (data) => {
    const res = await api.post('/features/', data);
    return res.data;
  },
  updateFeature: async (id, data) => {
    const res = await api.put(`/features/${id}/`, data);
    return res.data;
  },
  deleteFeature: async (id) => {
    const res = await api.delete(`/features/${id}/`);
    return res.data;
  },

  // Public & Admin Pricing
  getPricing: async () => {
    const res = await api.get('/pricing/');
    return res.data;
  },
  createPricing: async (data) => {
    const res = await api.post('/pricing/', data);
    return res.data;
  },
  updatePricing: async (id, data) => {
    const res = await api.put(`/pricing/${id}/`, data);
    return res.data;
  },
  deletePricing: async (id) => {
    const res = await api.delete(`/pricing/${id}/`);
    return res.data;
  },

  // Contact Inquiries
  submitContact: async (data) => {
    const res = await api.post('/contact/', data);
    return res.data;
  },
  getInquiries: async () => {
    const res = await api.get('/contact/');
    return res.data;
  },
  updateInquiryStatus: async (id, status) => {
    const res = await api.patch(`/contact/${id}/`, { status });
    return res.data;
  },
  deleteInquiry: async (id) => {
    const res = await api.delete(`/contact/${id}/`);
    return res.data;
  },
  exportInquiriesCsv: async () => {
    const res = await api.get('/contact/export-csv/', { responseType: 'blob' });
    return res.data;
  },

  // Admin Stats & Auth
  getAdminStats: async () => {
    const res = await api.get('/admin/stats/');
    return res.data;
  },
  login: async (username, password) => {
    const res = await api.post('/token/', { username, password });
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get('/user/me/');
    return res.data;
  },
};

export default api;

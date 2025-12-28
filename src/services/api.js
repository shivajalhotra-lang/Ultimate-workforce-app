import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to requests
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

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle network errors
    if (!response) {
      console.error('Network error:', error);
      
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error('Network error. Please check your connection.');
      }
      
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Handle specific HTTP status codes
    switch (response.status) {
      case 401:
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem('token');
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error('Session expired. Please login again.');
        }
        break;
        
      case 403:
        // Forbidden - insufficient permissions
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error('You do not have permission to perform this action.');
        }
        break;
        
      case 404:
        // Not found
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error('Resource not found.');
        }
        break;
        
      case 422:
        // Validation error
        const validationErrors = response.data.errors;
        const errorMessage = validationErrors 
          ? Object.values(validationErrors).flat().join(', ')
          : 'Validation failed. Please check your input.';
        
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error(errorMessage);
        }
        break;
        
      case 429:
        // Too many requests
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error('Too many requests. Please try again later.');
        }
        break;
        
      case 500:
        // Server error
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error('Server error. Please try again later.');
        }
        break;
        
      default:
        // Other errors
        const message = response.data?.error || response.data?.message || 'An error occurred.';
        
        if (typeof window !== 'undefined' && window.toast) {
          window.toast.error(message);
        }
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
export const fetchData = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postData = async (endpoint, data = {}) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const putData = async (endpoint, data = {}) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const patchData = async (endpoint, data = {}) => {
  try {
    const response = await api.patch(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload file
export const uploadFile = async (endpoint, file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await api.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress,
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Auth-specific methods
export const authAPI = {
  register: (data) => postData('/auth/register', data),
  login: (data) => postData('/auth/login', data),
  verify: () => fetchData('/auth/verify'),
  forgotPassword: (email) => postData('/auth/forgot-password', { email }),
  resetPassword: (data) => postData('/auth/reset-password', data),
  updateProfile: (data) => putData('/auth/profile', data),
  changePassword: (data) => postData('/auth/change-password', data),
  deleteAccount: () => deleteData('/auth/account'),
};

// Jobs-specific methods
export const jobsAPI = {
  getAll: (params) => fetchData('/jobs', params),
  getById: (id) => fetchData(`/jobs/${id}`),
  create: (data) => postData('/jobs', data),
  update: (id, data) => putData(`/jobs/${id}`, data),
  delete: (id) => deleteData(`/jobs/${id}`),
  apply: (id, data) => postData(`/jobs/${id}/apply`, data),
  getApplications: (id) => fetchData(`/jobs/${id}/applications`),
  getMyJobs: () => fetchData('/jobs/my-jobs'),
  getEmployerJobs: () => fetchData('/jobs/employer'),
};

// Users-specific methods
export const usersAPI = {
  getAll: (params) => fetchData('/users', params),
  getById: (id) => fetchData(`/users/${id}`),
  update: (id, data) => putData(`/users/${id}`, data),
  delete: (id) => deleteData(`/users/${id}`),
  getProfile: () => fetchData('/users/profile'),
  updateProfile: (data) => putData('/users/profile', data),
  getStats: () => fetchData('/users/stats'),
};

// Payments-specific methods
export const paymentsAPI = {
  getAll: (params) => fetchData('/payments', params),
  getById: (id) => fetchData(`/payments/${id}`),
  create: (data) => postData('/payments', data),
  process: (id) => postData(`/payments/${id}/process`),
  getMyPayments: () => fetchData('/payments/my-payments'),
  getStats: () => fetchData('/payments/stats'),
};

// Export default instance
export default api;

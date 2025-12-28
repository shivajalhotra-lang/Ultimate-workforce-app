import api from './api';

export const authService = {
  login(credentials) {
    return api.post('/auth/login', credentials);
  },

  register(userData) {
    return api.post('/auth/register', userData);
  },

  getCurrentUser() {
    return api.get('/auth/me');
  },

  updateProfile(userData) {
    return api.put('/auth/profile', userData);
  },

  changePassword(passwordData) {
    return api.put('/auth/change-password', passwordData);
  },

  forgotPassword(email) {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword(token, passwordData) {
    return api.post(`/auth/reset-password/${token}`, passwordData);
  },

  verifyEmail(token) {
    return api.post(`/auth/verify-email/${token}`);
  }
};
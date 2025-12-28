import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  
  // State
  const user = ref(null);
  const token = ref(localStorage.getItem('token') || null);
  const loading = ref(false);
  const error = ref(null);

  // Getters
  const isAuthenticated = computed(() => !!token.value);
  const userRole = computed(() => user.value?.role);
  const userName = computed(() => user.value?.name);

  // Actions
  const setAuth = (userData, authToken) => {
    user.value = userData;
    token.value = authToken;
    localStorage.setItem('token', authToken);
    error.value = null;
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    error.value = null;
  };

  // Register user
  const register = async (userData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.post('/auth/register', userData);
      
      const { user: userData, token: authToken, message } = response.data;
      
      setAuth(userData, authToken);
      
      // Show success message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success(message || 'Registration successful!');
      }
      
      return { user: userData, token: authToken };
    } catch (err) {
      error.value = err.response?.data?.error || err.message || 'Registration failed';
      
      // Show error message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(error.value);
      }
      
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Login user
  const login = async (credentials) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.post('/auth/login', credentials);
      
      const { user: userData, token: authToken, message } = response.data;
      
      setAuth(userData, authToken);
      
      // Show success message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success(message || 'Login successful!');
      }
      
      return { user: userData, token: authToken };
    } catch (err) {
      error.value = err.response?.data?.error || err.message || 'Login failed';
      
      // Show error message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(error.value);
      }
      
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Logout user
  const logout = () => {
    clearAuth();
    
    // Show logout message
    if (typeof window !== 'undefined' && window.toast) {
      window.toast.info('Logged out successfully');
    }
    
    // Redirect to login
    router.push('/login');
  };

  // Check if user is authenticated (on app load)
  const checkAuth = async () => {
    if (!token.value) return false;
    
    try {
      const response = await api.get('/auth/verify');
      user.value = response.data.user;
      return true;
    } catch (err) {
      clearAuth();
      return false;
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.put('/auth/profile', profileData);
      user.value = response.data.user;
      
      // Show success message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success('Profile updated successfully');
      }
      
      return user.value;
    } catch (err) {
      error.value = err.response?.data?.error || err.message || 'Profile update failed';
      
      // Show error message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(error.value);
      }
      
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      // Show success message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success(response.data.message || 'Password reset email sent');
      }
      
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || err.message || 'Password reset failed';
      
      // Show error message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(error.value);
      }
      
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await api.post('/auth/reset-password', { 
        token, 
        password: newPassword 
      });
      
      // Show success message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.success(response.data.message || 'Password reset successful');
      }
      
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.error || err.message || 'Password reset failed';
      
      // Show error message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(error.value);
      }
      
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Delete account
  const deleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      await api.delete('/auth/account');
      clearAuth();
      
      // Show success message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.info('Account deleted successfully');
      }
      
      router.push('/');
    } catch (err) {
      error.value = err.response?.data?.error || err.message || 'Account deletion failed';
      
      // Show error message
      if (typeof window !== 'undefined' && window.toast) {
        window.toast.error(error.value);
      }
      
      throw new Error(error.value);
    } finally {
      loading.value = false;
    }
  };

  // Initialize auth on app load
  const initialize = async () => {
    if (token.value) {
      await checkAuth();
    }
  };

  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    userRole,
    userName,
    
    // Actions
    register,
    login,
    logout,
    checkAuth,
    updateProfile,
    forgotPassword,
    resetPassword,
    deleteAccount,
    initialize,
    setAuth,
    clearAuth,
  };
});

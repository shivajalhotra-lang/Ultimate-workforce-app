import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const token = ref(localStorage.getItem('token'));
  const loading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const userRole = computed(() => user.value?.role);

  const setAuth = (userData, authToken) => {
    user.value = userData;
    token.value = authToken;
    localStorage.setItem('token', authToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const clearAuth = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  const login = async (credentials) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/auth/login', credentials);
      setAuth(response.data.user, response.data.token);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/auth/register', userData);
      setAuth(response.data.user, response.data.token);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    clearAuth();
  };

  const fetchUser = async () => {
    if (!token.value) return;
    
    loading.value = true;
    try {
      const response = await api.get('/auth/me');
      user.value = response.data;
    } catch (err) {
      clearAuth();
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Initialize if token exists
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    fetchUser();
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    userRole,
    login,
    register,
    logout,
    fetchUser,
    clearAuth
  };
});
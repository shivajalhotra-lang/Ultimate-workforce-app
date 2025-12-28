// src/services/user.js
import api from './api.js'

export const userService = {
  // Get all users
  async getUsers(params = {}) {
    try {
      const query = new URLSearchParams(params).toString()
      const endpoint = `/users${query ? `?${query}` : ''}`
      return await api.get(endpoint)
    } catch (error) {
      console.error('Get users error:', error)
      throw error
    }
  },

  // Get single user
  async getUserById(id) {
    try {
      return await api.get(`/users/${id}`)
    } catch (error) {
      console.error('Get user error:', error)
      throw error
    }
  },

  // Create user
  async createUser(userData) {
    try {
      return await api.post('/users', userData)
    } catch (error) {
      console.error('Create user error:', error)
      throw error
    }
  },

  // Update user
  async updateUser(id, userData) {
    try {
      return await api.put(`/users/${id}`, userData)
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  },

  // Delete user
  async deleteUser(id) {
    try {
      return await api.delete(`/users/${id}`)
    } catch (error) {
      console.error('Delete user error:', error)
      throw error
    }
  },

  // Update user status
  async updateUserStatus(id, status) {
    try {
      return await api.patch(`/users/${id}/status`, { status })
    } catch (error) {
      console.error('Update status error:', error)
      throw error
    }
  },

  // Bulk update users
  async bulkUpdateUsers(userIds, updates) {
    try {
      return await api.post('/users/bulk-update', { userIds, updates })
    } catch (error) {
      console.error('Bulk update error:', error)
      throw error
    }
  }
}
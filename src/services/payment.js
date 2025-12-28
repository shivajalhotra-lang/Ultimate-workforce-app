// src/services/payment.js
import api from './api.js'

export const paymentService = {
  // Get all payments
  async getPayments(params = {}) {
    try {
      const query = new URLSearchParams(params).toString()
      const endpoint = `/payments${query ? `?${query}` : ''}`
      return await api.get(endpoint)
    } catch (error) {
      console.error('Get payments error:', error)
      throw error
    }
  },

  // Get single payment
  async getPaymentById(id) {
    try {
      return await api.get(`/payments/${id}`)
    } catch (error) {
      console.error('Get payment error:', error)
      throw error
    }
  },

  // Create payment
  async createPayment(paymentData) {
    try {
      return await api.post('/payments', paymentData)
    } catch (error) {
      console.error('Create payment error:', error)
      throw error
    }
  },

  // Update payment
  async updatePayment(id, paymentData) {
    try {
      return await api.put(`/payments/${id}`, paymentData)
    } catch (error) {
      console.error('Update payment error:', error)
      throw error
    }
  },

  // Process refund
  async processRefund(id, refundData) {
    try {
      return await api.post(`/payments/${id}/refund`, refundData)
    } catch (error) {
      console.error('Process refund error:', error)
      throw error
    }
  },

  // Get payment statistics
  async getPaymentStats() {
    try {
      return await api.get('/payments/stats')
    } catch (error) {
      console.error('Get payment stats error:', error)
      throw error
    }
  }
}
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="verification-details-modal">
      <div class="modal-header">
        <h2>KYC Verification Details</h2>
        <button @click="$emit('close')" class="close-btn">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="modal-content">
        <!-- Modal content would go here -->
        <div class="verification-info">
          <div class="info-section">
            <h3>User Information</h3>
            <div class="user-card">
              <div class="user-avatar" :style="{ background: verification.user.avatarColor }">
                {{ verification.user.name.charAt(0) }}
              </div>
              <div class="user-details">
                <div class="user-name">{{ verification.user.name }}</div>
                <div class="user-meta">
                  <span class="user-role">{{ verification.user.role }}</span>
                  <span class="user-id">ID: {{ verification.user.id }}</span>
                  <span class="user-phone">{{ verification.user.phone }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Add document preview and verification actions -->
        </div>
        
        <div class="modal-actions">
          <button @click="$emit('close')" class="btn-secondary">
            Close
          </button>
          <button v-if="verification.status === 'pending'" @click="$emit('approve', verification)" class="btn-success">
            Approve
          </button>
          <button v-if="verification.status === 'pending'" @click="$emit('reject', verification)" class="btn-danger">
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'

const props = defineProps({
  verification: {
    type: Object,
    required: true
  }
})

defineEmits(['close', 'approve', 'reject'])
</script>

<style scoped>
/* Reuse modal styles from PaymentDetailsModal */
</style>
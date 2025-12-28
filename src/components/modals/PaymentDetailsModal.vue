<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="payment-details-modal">
      <div class="modal-header">
        <h2>Payment Details</h2>
        <button @click="$emit('close')" class="close-btn">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="modal-content">
        <!-- Payment details would go here -->
        <div class="payment-info">
          <div class="info-row">
            <span class="label">Transaction ID:</span>
            <span class="value">{{ payment.id }}</span>
          </div>
          <!-- Add more payment details -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  payment: {
    type: Object,
    required: true
  }
})

defineEmits(['close', 'update'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.payment-details-modal {
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-content {
  padding: 1.5rem;
}
</style>
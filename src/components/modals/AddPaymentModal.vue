<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="add-payment-modal">
      <div class="modal-header">
        <h2>Add New Payment</h2>
        <button @click="$emit('close')" class="close-btn">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="modal-content">
        <form @submit.prevent="handleSubmit">
          <!-- Add payment form would go here -->
          <div class="form-actions">
            <button type="button" @click="$emit('close')" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" class="submit-btn">
              Add Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'

defineEmits(['close', 'save'])

const handleSubmit = () => {
  // Handle form submission
  const newPayment = {
    // Form data
  }
  $emit('save', newPayment)
}
</script>

<style scoped>
/* Same modal styles as above */
</style>
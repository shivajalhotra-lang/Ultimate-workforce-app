<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Bulk Hiring</h2>
        <button @click="$emit('close')" class="close-btn">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="modal-body">
        <!-- Bulk hiring form here -->
        <p>Bulk hiring form will be implemented here</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'
</script>

<style scoped>
/* Same styles as NewJobModal */
</style>
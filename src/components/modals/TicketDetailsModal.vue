<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="ticket-details-modal">
      <div class="modal-header">
        <h2>Ticket Details - {{ ticket.id }}</h2>
        <button @click="$emit('close')" class="close-btn">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="modal-content">
        <!-- Add ticket details content here -->
        <div class="ticket-info">
          <div class="info-section">
            <h3>Subject: {{ ticket.subject }}</h3>
            <p class="ticket-description">{{ ticket.preview }}</p>
          </div>
          
          <div class="ticket-meta">
            <div class="meta-item">
              <span class="label">Priority:</span>
              <span :class="`priority-badge priority-${ticket.priority}`">
                {{ ticket.priority }}
              </span>
            </div>
            <div class="meta-item">
              <span class="label">Status:</span>
              <span :class="`status-badge status-${ticket.status}`">
                {{ formatStatus(ticket.status) }}
              </span>
            </div>
            <div class="meta-item">
              <span class="label">Category:</span>
              <span class="value">{{ formatCategory(ticket.category) }}</span>
            </div>
          </div>
          
          <!-- Add conversation thread and reply form -->
        </div>
        
        <div class="modal-actions">
          <button @click="$emit('close')" class="btn-secondary">
            Close
          </button>
          <button v-if="ticket.status === 'open'" @click="assignToMe" class="btn-primary">
            Assign to Me
          </button>
          <button v-if="ticket.status === 'in_progress'" @click="resolveTicket" class="btn-success">
            Mark as Resolved
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next'

const props = defineProps({
  ticket: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'update'])

const formatCategory = (category) => {
  const categoryMap = {
    technical: 'Technical',
    billing: 'Billing',
    account: 'Account',
    job: 'Job Related',
    other: 'Other'
  }
  return categoryMap[category] || category
}

const formatStatus = (status) => {
  const statusMap = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed'
  }
  return statusMap[status] || status
}

const assignToMe = () => {
  emit('update', { ...props.ticket, assignedTo: { id: 'ADMIN001', name: 'Admin User' }, status: 'in_progress' })
}

const resolveTicket = () => {
  emit('update', { ...props.ticket, status: 'resolved' })
}
</script>

<style scoped>
/* Reuse modal styles from other modals */
</style>
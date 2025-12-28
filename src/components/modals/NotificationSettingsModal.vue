<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="notification-settings-modal">
      <div class="modal-header">
        <h2>Notification Settings</h2>
        <button @click="$emit('close')" class="close-btn">
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="modal-content">
        <div class="settings-section">
          <h3>Notification Preferences</h3>
          <p class="section-description">Configure how and when you receive notifications</p>
          
          <div class="settings-grid">
            <div class="setting-item">
              <div class="setting-header">
                <h4>Email Notifications</h4>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="settings.emailEnabled" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <p class="setting-description">Receive notifications via email</p>
            </div>
            
            <div class="setting-item">
              <div class="setting-header">
                <h4>Push Notifications</h4>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="settings.pushEnabled" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <p class="setting-description">Receive browser push notifications</p>
            </div>
            
            <div class="setting-item">
              <div class="setting-header">
                <h4>Sound Alerts</h4>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="settings.soundEnabled" class="toggle-input">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <p class="setting-description">Play sound for new notifications</p>
            </div>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>Notification Types</h3>
          <p class="section-description">Select which types of notifications to receive</p>
          
          <div class="type-grid">
            <label class="type-checkbox">
              <input type="checkbox" v-model="settings.types.system" class="checkbox">
              <div class="type-icon bg-gray-100">
                <Server class="w-4 h-4 text-gray-600" />
              </div>
              <div class="type-info">
                <span class="type-name">System</span>
                <span class="type-desc">Platform updates and maintenance</span>
              </div>
            </label>
            
            <label class="type-checkbox">
              <input type="checkbox" v-model="settings.types.user" class="checkbox">
              <div class="type-icon bg-blue-100">
                <Users class="w-4 h-4 text-blue-600" />
              </div>
              <div class="type-info">
                <span class="type-name">User Activity</span>
                <span class="type-desc">New registrations, verifications</span>
              </div>
            </label>
            
            <label class="type-checkbox">
              <input type="checkbox" v-model="settings.types.payment" class="checkbox">
              <div class="type-icon bg-green-100">
                <CreditCard class="w-4 h-4 text-green-600" />
              </div>
              <div class="type-info">
                <span class="type-name">Payments</span>
                <span class="type-desc">Transactions, refunds, commissions</span>
              </div>
            </label>
            
            <label class="type-checkbox">
              <input type="checkbox" v-model="settings.types.job" class="checkbox">
              <div class="type-icon bg-yellow-100">
                <Briefcase class="w-4 h-4 text-yellow-600" />
              </div>
              <div class="type-info">
                <span class="type-name">Jobs</span>
                <span class="type-desc">New jobs, applications, hirings</span>
              </div>
            </label>
            
            <label class="type-checkbox">
              <input type="checkbox" v-model="settings.types.support" class="checkbox">
              <div class="type-icon bg-purple-100">
                <MessageSquare class="w-4 h-4 text-purple-600" />
              </div>
              <div class="type-info">
                <span class="type-name">Support</span>
                <span class="type-desc">New tickets, messages, issues</span>
              </div>
            </label>
            
            <label class="type-checkbox">
              <input type="checkbox" v-model="settings.types.security" class="checkbox">
              <div class="type-icon bg-red-100">
                <Shield class="w-4 h-4 text-red-600" />
              </div>
              <div class="type-info">
                <span class="type-name">Security</span>
                <span class="type-desc">Login attempts, suspicious activity</span>
              </div>
            </label>
          </div>
        </div>
        
        <div class="settings-section">
          <h3>Notification Frequency</h3>
          <div class="frequency-options">
            <label class="frequency-option">
              <input type="radio" v-model="settings.frequency" value="realtime" class="radio">
              <div class="option-content">
                <h4>Real-time</h4>
                <p>Receive notifications immediately</p>
              </div>
            </label>
            
            <label class="frequency-option">
              <input type="radio" v-model="settings.frequency" value="hourly" class="radio">
              <div class="option-content">
                <h4>Hourly Digest</h4>
                <p>Receive notifications hourly</p>
              </div>
            </label>
            
            <label class="frequency-option">
              <input type="radio" v-model="settings.frequency" value="daily" class="radio">
              <div class="option-content">
                <h4>Daily Digest</h4>
                <p>Receive notifications once per day</p>
              </div>
            </label>
          </div>
        </div>
        
        <div class="modal-actions">
          <button @click="$emit('close')" class="btn-secondary">
            Cancel
          </button>
          <button @click="saveSettings" class="btn-primary">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X, Server, Users, CreditCard, Briefcase, MessageSquare, Shield } from 'lucide-vue-next'

const emit = defineEmits(['close', 'save'])

const settings = ref({
  emailEnabled: true,
  pushEnabled: true,
  soundEnabled: false,
  types: {
    system: true,
    user: true,
    payment: true,
    job: true,
    support: true,
    security: true
  },
  frequency: 'realtime'
})

const saveSettings = () => {
  emit('save', settings.value)
}
</script>

<style scoped>
/* Reuse modal styles from other modals */
</style>
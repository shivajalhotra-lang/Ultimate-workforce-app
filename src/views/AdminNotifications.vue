<template>
  <div class="admin-notifications">
    <!-- Header -->
    <div class="notifications-header">
      <div class="header-left">
        <h1 class="page-title">Notifications</h1>
        <p class="page-subtitle">Manage your alerts and notifications</p>
      </div>
      <div class="header-right">
        <div class="notification-stats">
          <div class="stat-item">
            <Bell class="w-4 h-4" />
            <span class="stat-value">{{ unreadCount }}</span>
            <span class="stat-label">Unread</span>
          </div>
        </div>
        <div class="header-actions">
          <button @click="markAllAsRead" class="action-btn" :disabled="unreadCount === 0">
            <CheckCircle class="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
          <button @click="refreshNotifications" class="action-btn" :disabled="loading">
            <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          </button>
          <button @click="showSettings" class="action-btn">
            <Settings class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="filter-tabs">
      <button 
        v-for="filter in filters" 
        :key="filter.id"
        @click="activeFilter = filter.id"
        :class="['filter-btn', { active: activeFilter === filter.id }]"
      >
        <component :is="filter.icon" class="w-4 h-4" />
        <span>{{ filter.label }}</span>
        <span v-if="filter.count > 0" class="filter-count">{{ filter.count }}</span>
      </button>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <div class="actions-grid">
        <button @click="filterByType('system')" class="action-tag" :class="{ active: selectedTypes.includes('system') }">
          <Server class="w-4 h-4" />
          <span>System</span>
        </button>
        
        <button @click="filterByType('user')" class="action-tag" :class="{ active: selectedTypes.includes('user') }">
          <Users class="w-4 h-4" />
          <span>User Activity</span>
        </button>
        
        <button @click="filterByType('payment')" class="action-tag" :class="{ active: selectedTypes.includes('payment') }">
          <CreditCard class="w-4 h-4" />
          <span>Payments</span>
        </button>
        
        <button @click="filterByType('job')" class="action-tag" :class="{ active: selectedTypes.includes('job') }">
          <Briefcase class="w-4 h-4" />
          <span>Jobs</span>
        </button>
        
        <button @click="filterByType('support')" class="action-tag" :class="{ active: selectedTypes.includes('support') }">
          <MessageSquare class="w-4 h-4" />
          <span>Support</span>
        </button>
        
        <button @click="filterByType('security')" class="action-tag" :class="{ active: selectedTypes.includes('security') }">
          <Shield class="w-4 h-4" />
          <span>Security</span>
        </button>
        
        <button @click="clearTypeFilters" class="action-tag clear">
          <X class="w-4 h-4" />
          <span>Clear Filters</span>
        </button>
      </div>
    </div>

    <!-- Notifications Container -->
    <div class="notifications-container">
      <!-- Date Groups -->
      <div v-for="(group, date) in groupedNotifications" :key="date" class="date-group">
        <div class="date-header">
          <h3>{{ formatDateHeader(date) }}</h3>
          <button @click="markDateAsRead(date)" class="mark-date-read" v-if="hasUnreadInGroup(date)">
            Mark all as read
          </button>
        </div>
        
        <div class="notifications-list">
          <div 
            v-for="notification in group" 
            :key="notification.id"
            :class="['notification-item', { unread: !notification.read, important: notification.priority === 'high' }]"
            @click="handleNotificationClick(notification)"
          >
            <div class="notification-main">
              <div class="notification-icon" :class="`type-${notification.type}`">
                <component :is="notification.icon" class="w-5 h-5" />
              </div>
              
              <div class="notification-content">
                <div class="notification-header">
                  <div class="notification-title">{{ notification.title }}</div>
                  <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
                </div>
                
                <div class="notification-body">
                  <p class="notification-text">{{ notification.message }}</p>
                  
                  <div v-if="notification.meta" class="notification-meta">
                    <template v-if="notification.type === 'user'">
                      <div class="meta-item">
                        <User class="w-3 h-3" />
                        <span>{{ notification.meta.userName }}</span>
                      </div>
                      <div class="meta-item">
                        <Hash class="w-3 h-3" />
                        <span>ID: {{ notification.meta.userId }}</span>
                      </div>
                    </template>
                    
                    <template v-if="notification.type === 'payment'">
                      <div class="meta-item">
                        <DollarSign class="w-3 h-3" />
                        <span>₹{{ notification.meta.amount?.toLocaleString() }}</span>
                      </div>
                      <div class="meta-item">
                        <Hash class="w-3 h-3" />
                        <span>Ref: {{ notification.meta.reference }}</span>
                      </div>
                    </template>
                    
                    <template v-if="notification.type === 'job'">
                      <div class="meta-item">
                        <Briefcase class="w-3 h-3" />
                        <span>{{ notification.meta.jobTitle }}</span>
                      </div>
                      <div class="meta-item">
                        <MapPin class="w-3 h-3" />
                        <span>{{ notification.meta.location }}</span>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="notification-actions">
              <button 
                v-if="!notification.read" 
                @click.stop="markAsRead(notification)"
                class="action-btn read"
                title="Mark as read"
              >
                <CheckCircle class="w-4 h-4" />
              </button>
              
              <button 
                @click.stop="archiveNotification(notification)"
                class="action-btn archive"
                title="Archive"
              >
                <Archive class="w-4 h-4" />
              </button>
              
              <button 
                v-if="notification.actionable"
                @click.stop="handleAction(notification)"
                class="action-btn primary"
                :class="`action-${notification.actionType}`"
              >
                <component :is="notification.actionIcon" class="w-4 h-4" />
                <span>{{ notification.actionText }}</span>
              </button>
              
              <button 
                @click.stop="deleteNotification(notification)"
                class="action-btn delete"
                title="Delete"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredNotifications.length === 0 && !loading" class="empty-state">
        <BellOff class="w-16 h-16 text-gray-300" />
        <h3>No notifications found</h3>
        <p v-if="activeFilter !== 'all' || selectedTypes.length > 0">Try adjusting your filters</p>
        <p v-else>You're all caught up!</p>
        <button @click="clearFilters" class="clear-filters-btn">
          <Filter class="w-4 h-4" />
          Clear All Filters
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <RefreshCw class="w-8 h-8 animate-spin text-blue-500" />
        <span>Loading notifications...</span>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedNotifications.length > 0" class="bulk-actions">
      <div class="selected-count">
        {{ selectedNotifications.length }} notifications selected
      </div>
      <div class="bulk-buttons">
        <button @click="bulkMarkAsRead" class="bulk-btn read">
          <CheckCircle class="w-4 h-4" />
          Mark as Read
        </button>
        <button @click="bulkArchive" class="bulk-btn archive">
          <Archive class="w-4 h-4" />
          Archive
        </button>
        <button @click="bulkDelete" class="bulk-btn delete">
          <Trash2 class="w-4 h-4" />
          Delete
        </button>
        <button @click="clearSelection" class="bulk-btn clear">
          Clear Selection
        </button>
      </div>
    </div>

    <!-- Notification Settings Modal -->
    <NotificationSettingsModal 
      v-if="showSettingsModal"
      @close="showSettingsModal = false"
      @save="handleSettingsSave"
    />

    <!-- Notification Details Drawer -->
    <NotificationDetailsDrawer 
      v-if="selectedNotificationDetails"
      :notification="selectedNotificationDetails"
      @close="selectedNotificationDetails = null"
      @action="handleNotificationAction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Bell,
  CheckCircle,
  RefreshCw,
  Settings,
  Server,
  Users,
  CreditCard,
  Briefcase,
  MessageSquare,
  Shield,
  X,
  User,
  Hash,
  DollarSign,
  MapPin,
  Archive,
  Trash2,
  Filter,
  BellOff,
  Eye,
  ExternalLink,
  AlertCircle,
  UserCheck,
  UserX,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  Check
} from 'lucide-vue-next'
import NotificationSettingsModal from '@/components/modals/NotificationSettingsModal.vue'
import NotificationDetailsDrawer from '@/components/modals/NotificationDetailsDrawer.vue'

// State
const activeFilter = ref('unread')
const selectedTypes = ref([])
const loading = ref(false)
const showSettingsModal = ref(false)
const selectedNotificationDetails = ref(null)
const selectedNotifications = ref([])

// Filters
const filters = ref([
  { id: 'all', label: 'All', icon: Bell, count: 0 },
  { id: 'unread', label: 'Unread', icon: AlertCircle, count: 0 },
  { id: 'important', label: 'Important', icon: AlertTriangle, count: 0 },
  { id: 'archived', label: 'Archived', icon: Archive, count: 0 }
])

// Sample notifications data
const notifications = ref([
  {
    id: 'NOTIF001',
    type: 'user',
    icon: User,
    title: 'New User Registration',
    message: 'Ramesh Kumar has registered as a worker',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    priority: 'medium',
    archived: false,
    actionable: true,
    actionType: 'view',
    actionText: 'View Profile',
    actionIcon: Eye,
    meta: {
      userId: 'W001',
      userName: 'Ramesh Kumar',
      userRole: 'worker'
    }
  },
  {
    id: 'NOTIF002',
    type: 'payment',
    icon: CreditCard,
    title: 'Large Payment Processed',
    message: 'Payment of ₹25,000 processed for job completion',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    read: false,
    priority: 'high',
    archived: false,
    actionable: true,
    actionType: 'verify',
    actionText: 'Verify Payment',
    actionIcon: CheckCircle,
    meta: {
      amount: 25000,
      reference: 'PAY001',
      userId: 'E001'
    }
  },
  {
    id: 'NOTIF003',
    type: 'system',
    icon: Server,
    title: 'System Backup Completed',
    message: 'Daily system backup completed successfully',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    read: true,
    priority: 'low',
    archived: false,
    actionable: false
  },
  {
    id: 'NOTIF004',
    type: 'job',
    icon: Briefcase,
    title: 'New Job Posted',
    message: 'Construction job posted in Delhi requiring 10 workers',
    timestamp: new Date(Date.now() - 1000 * 60 * 120), // 2 hours ago
    read: false,
    priority: 'medium',
    archived: false,
    actionable: true,
    actionType: 'review',
    actionText: 'Review Job',
    actionIcon: Eye,
    meta: {
      jobId: 'JOB001',
      jobTitle: 'Construction Worker - High Rise',
      location: 'Delhi',
      workersNeeded: 10
    }
  },
  {
    id: 'NOTIF005',
    type: 'support',
    icon: MessageSquare,
    title: 'New Support Ticket',
    message: 'User reported payment issue - needs immediate attention',
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    read: true,
    priority: 'high',
    archived: false,
    actionable: true,
    actionType: 'assign',
    actionText: 'Assign to Me',
    actionIcon: UserCheck,
    meta: {
      ticketId: 'TICKET001',
      userId: 'W002',
      issueType: 'payment'
    }
  },
  {
    id: 'NOTIF006',
    type: 'security',
    icon: Shield,
    title: 'Suspicious Login Attempt',
    message: 'Multiple failed login attempts detected from unknown IP',
    timestamp: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    read: false,
    priority: 'high',
    archived: false,
    actionable: true,
    actionType: 'investigate',
    actionText: 'Investigate',
    actionIcon: AlertTriangle,
    meta: {
      ipAddress: '192.168.1.100',
      attempts: 5,
      location: 'Unknown'
    }
  },
  {
    id: 'NOTIF007',
    type: 'user',
    icon: UserCheck,
    title: 'KYC Verification Approved',
    message: 'KYC verification completed for Priya Sharma',
    timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
    read: true,
    priority: 'medium',
    archived: false,
    actionable: true,
    actionType: 'view',
    actionText: 'View Details',
    actionIcon: FileCheck,
    meta: {
      userId: 'W003',
      userName: 'Priya Sharma',
      verificationType: 'KYC'
    }
  },
  {
    id: 'NOTIF008',
    type: 'system',
    icon: TrendingUp,
    title: 'Platform Performance',
    message: 'User growth increased by 15% this week',
    timestamp: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
    read: true,
    priority: 'low',
    archived: false,
    actionable: true,
    actionType: 'analyze',
    actionText: 'View Analytics',
    actionIcon: TrendingUp
  }
])

// Computed Properties
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read && !n.archived).length
})

const importantCount = computed(() => {
  return notifications.value.filter(n => n.priority === 'high' && !n.archived).length
})

const archivedCount = computed(() => {
  return notifications.value.filter(n => n.archived).length
})

// Update filter counts
const updateFilterCounts = () => {
  filters.value[0].count = notifications.value.filter(n => !n.archived).length
  filters.value[1].count = unreadCount.value
  filters.value[2].count = importantCount.value
  filters.value[3].count = archivedCount.value
}

const filteredNotifications = computed(() => {
  let filtered = [...notifications.value]

  // Apply active filter
  switch (activeFilter.value) {
    case 'unread':
      filtered = filtered.filter(n => !n.read && !n.archived)
      break
    case 'important':
      filtered = filtered.filter(n => n.priority === 'high' && !n.archived)
      break
    case 'archived':
      filtered = filtered.filter(n => n.archived)
      break
    case 'all':
    default:
      filtered = filtered.filter(n => !n.archived)
      break
  }

  // Apply type filters
  if (selectedTypes.value.length > 0) {
    filtered = filtered.filter(n => selectedTypes.value.includes(n.type))
  }

  return filtered.sort((a, b) => b.timestamp - a.timestamp)
})

const groupedNotifications = computed(() => {
  const groups = {}
  
  filteredNotifications.value.forEach(notification => {
    const date = notification.timestamp.toDateString()
    
    if (!groups[date]) {
      groups[date] = []
    }
    
    groups[date].push(notification)
  })
  
  return groups
})

// Methods
const formatDateHeader = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    })
  }
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diffMs = now - timestamp
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffMins < 1) {
    return 'Just now'
  } else if (diffMins < 60) {
    return `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays}d ago`
  } else {
    return timestamp.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric'
    })
  }
}

const filterByType = (type) => {
  const index = selectedTypes.value.indexOf(type)
  if (index === -1) {
    selectedTypes.value.push(type)
  } else {
    selectedTypes.value.splice(index, 1)
  }
}

const clearTypeFilters = () => {
  selectedTypes.value = []
}

const clearFilters = () => {
  activeFilter.value = 'all'
  selectedTypes.value = []
}

const hasUnreadInGroup = (date) => {
  const group = groupedNotifications.value[date]
  return group && group.some(n => !n.read)
}

const refreshNotifications = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    updateFilterCounts()
  } catch (error) {
    console.error('Failed to refresh notifications:', error)
  } finally {
    loading.value = false
  }
}

const markAsRead = (notification) => {
  notification.read = true
  updateFilterCounts()
}

const markAllAsRead = () => {
  notifications.value.forEach(n => {
    if (!n.read && !n.archived) {
      n.read = true
    }
  })
  updateFilterCounts()
}

const markDateAsRead = (date) => {
  const group = groupedNotifications.value[date]
  if (group) {
    group.forEach(n => {
      if (!n.read) {
        n.read = true
      }
    })
    updateFilterCounts()
  }
}

const archiveNotification = (notification) => {
  notification.archived = true
  updateFilterCounts()
}

const deleteNotification = (notification) => {
  if (confirm('Delete this notification?')) {
    const index = notifications.value.findIndex(n => n.id === notification.id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
      updateFilterCounts()
    }
  }
}

const handleNotificationClick = (notification) => {
  selectedNotificationDetails.value = notification
  if (!notification.read) {
    notification.read = true
    updateFilterCounts()
  }
}

const handleAction = (notification) => {
  switch (notification.actionType) {
    case 'view':
      selectedNotificationDetails.value = notification
      break
    case 'verify':
      console.log('Verifying payment:', notification.meta?.reference)
      notification.read = true
      break
    case 'review':
      console.log('Reviewing job:', notification.meta?.jobId)
      notification.read = true
      break
    case 'assign':
      console.log('Assigning ticket:', notification.meta?.ticketId)
      notification.read = true
      break
    case 'investigate':
      console.log('Investigating security issue')
      notification.read = true
      break
    case 'analyze':
      console.log('Opening analytics')
      notification.read = true
      break
  }
  updateFilterCounts()
}

const handleNotificationAction = (notification) => {
  handleAction(notification)
  selectedNotificationDetails.value = null
}

const showSettings = () => {
  showSettingsModal.value = true
}

const handleSettingsSave = (settings) => {
  console.log('Notification settings saved:', settings)
  showSettingsModal.value = false
}

const bulkMarkAsRead = () => {
  notifications.value.forEach(n => {
    if (selectedNotifications.value.includes(n.id) && !n.read) {
      n.read = true
    }
  })
  clearSelection()
  updateFilterCounts()
}

const bulkArchive = () => {
  notifications.value.forEach(n => {
    if (selectedNotifications.value.includes(n.id) && !n.archived) {
      n.archived = true
    }
  })
  clearSelection()
  updateFilterCounts()
}

const bulkDelete = () => {
  if (confirm(`Delete ${selectedNotifications.value.length} notifications?`)) {
    notifications.value = notifications.value.filter(n => !selectedNotifications.value.includes(n.id))
    clearSelection()
    updateFilterCounts()
  }
}

const clearSelection = () => {
  selectedNotifications.value = []
}

// Lifecycle
onMounted(() => {
  updateFilterCounts()
  refreshNotifications()
})
</script>

<style scoped>
.admin-notifications {
  padding: 1rem;
}

/* Header */
.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
}

.header-right {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.notification-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border-radius: 0.75rem;
}

.stat-item .stat-value {
  font-weight: 700;
  color: #1f2937;
  font-size: 1.125rem;
}

.stat-item .stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.header-actions .action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.header-actions .action-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.header-actions .action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.header-actions .action-btn:last-child {
  padding: 0.75rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
  overflow-x: auto;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
}

.filter-btn:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.filter-btn.active {
  background: #3b82f6;
  color: white;
}

.filter-btn.active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 3px;
  background: #3b82f6;
  border-radius: 9999px;
}

.filter-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.filter-btn.active .filter-count {
  background: rgba(255, 255, 255, 0.3);
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 2rem;
}

.actions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.action-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.action-tag:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.action-tag.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.action-tag.clear {
  background: #f3f4f6;
  color: #6b7280;
}

.action-tag.clear:hover {
  background: #e5e7eb;
}

/* Notifications Container */
.notifications-container {
  margin-bottom: 2rem;
}

.date-group {
  margin-bottom: 2rem;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.date-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
}

.mark-date-read {
  font-size: 0.875rem;
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
}

.mark-date-read:hover {
  text-decoration: underline;
}

/* Notifications List */
.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-item {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.2s;
  cursor: pointer;
}

.notification-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notification-item.unread {
  background: #eff6ff;
  border-color: #dbeafe;
}

.notification-item.important {
  border-color: #fca5a5;
  background: #fef2f2;
}

.notification-item.important.unread {
  background: #fee2e2;
}

.notification-main {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.notification-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon.type-system {
  background: #f3f4f6;
  color: #4b5563;
}

.notification-icon.type-user {
  background: #dbeafe;
  color: #1e40af;
}

.notification-icon.type-payment {
  background: #dcfce7;
  color: #166534;
}

.notification-icon.type-job {
  background: #fef3c7;
  color: #92400e;
}

.notification-icon.type-support {
  background: #f3e8ff;
  color: #7c3aed;
}

.notification-icon.type-security {
  background: #fee2e2;
  color: #991b1b;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.notification-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.notification-time {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  margin-left: 1rem;
}

.notification-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.notification-text {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}

.notification-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.meta-item svg {
  color: #9ca3af;
}

.notification-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.notification-actions .action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.notification-actions .action-btn.read {
  color: #10b981;
}

.notification-actions .action-btn.read:hover {
  background: #dcfce7;
  border-color: #10b981;
}

.notification-actions .action-btn.archive {
  color: #6b7280;
}

.notification-actions .action-btn.archive:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.notification-actions .action-btn.delete {
  color: #ef4444;
}

.notification-actions .action-btn.delete:hover {
  background: #fee2e2;
  border-color: #ef4444;
}

.notification-actions .action-btn.primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.notification-actions .action-btn.primary:hover {
  background: #2563eb;
}

.notification-actions .action-btn.primary.action-verify {
  background: #10b981;
}

.notification-actions .action-btn.primary.action-verify:hover {
  background: #0da271;
}

.notification-actions .action-btn.primary.action-review {
  background: #f59e0b;
}

.notification-actions .action-btn.primary.action-review:hover {
  background: #d97706;
}

.notification-actions .action-btn.primary.action-investigate {
  background: #ef4444;
}

.notification-actions .action-btn.primary.action-investigate:hover {
  background: #dc2626;
}

/* Empty State */
.empty-state {
  border: 2px dashed #e5e7eb;
  border-radius: 1rem;
  padding: 4rem 2rem;
  text-align: center;
  background: #f9fafb;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 1rem 0 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.clear-filters-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 auto;
}

.clear-filters-btn:hover {
  background: #2563eb;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 2rem;
  color: #6b7280;
}

/* Bulk Actions */
.bulk-actions {
  background: linear-gradient(to right, #dbeafe, #e0f2fe);
  border: 1px solid #93c5fd;
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-count {
  font-weight: 600;
  color: #1e40af;
}

.bulk-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.bulk-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.bulk-btn.read {
  background: #10b981;
  color: white;
  border: none;
}

.bulk-btn.read:hover {
  background: #0da271;
}

.bulk-btn.archive {
  background: #6b7280;
  color: white;
  border: none;
}

.bulk-btn.archive:hover {
  background: #4b5563;
}

.bulk-btn.delete {
  background: #ef4444;
  color: white;
  border: none;
}

.bulk-btn.delete:hover {
  background: #dc2626;
}

.bulk-btn.clear {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.bulk-btn.clear:hover {
  background: #f3f4f6;
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .notification-stats {
    flex: 1;
  }
  
  .filter-tabs {
    flex-wrap: wrap;
  }
  
  .notification-main {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .notification-icon {
    align-self: flex-start;
  }
  
  .notification-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .notification-time {
    margin-left: 0;
  }
  
  .notification-actions {
    justify-content: flex-start;
  }
  
  .bulk-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .bulk-buttons {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .header-actions .action-btn span {
    display: none;
  }
  
  .actions-grid {
    justify-content: center;
  }
  
  .notification-actions .action-btn span {
    display: none;
  }
  
  .notification-actions .action-btn {
    padding: 0.5rem;
  }
}
</style>
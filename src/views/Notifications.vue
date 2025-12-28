<template>
  <div class="notifications">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
            <p class="text-gray-600 mt-2">Stay updated with your job activities</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="markAllAsRead"
              :disabled="notifications.filter(n => !n.read).length === 0"
              class="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Mark all as read
            </button>
            <button
              @click="clearAll"
              :disabled="notifications.length === 0"
              class="text-sm text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Clear all
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6">
        <div class="bg-white rounded-lg shadow p-4">
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="filter in filters"
              :key="filter.id"
              @click="activeFilter = filter.id"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                activeFilter === filter.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              ]"
            >
              {{ filter.name }}
              <span
                v-if="filter.count !== undefined"
                :class="[
                  'ml-2 px-1.5 py-0.5 text-xs rounded-full',
                  activeFilter === filter.id
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-gray-200 text-gray-700'
                ]"
              >
                {{ filter.count }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Notifications List -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <div v-else-if="error" class="text-center py-12">
        <div class="text-red-600 mb-2">Error loading notifications</div>
        <button @click="fetchNotifications" class="text-blue-600 hover:text-blue-800">
          Try Again
        </button>
      </div>

      <div v-else-if="filteredNotifications.length === 0" class="text-center py-12">
        <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
        <p class="text-gray-500">
          {{
            activeFilter === 'all'
              ? "You're all caught up!"
              : `No ${activeFilter} notifications`
          }}
        </p>
      </div>

      <div v-else class="space-y-4">
        <!-- Date Grouping -->
        <div v-for="(group, date) in groupedNotifications" :key="date" class="space-y-3">
          <!-- Date Header -->
          <div class="flex items-center">
            <div class="flex-grow border-t border-gray-300"></div>
            <span class="mx-4 text-sm font-medium text-gray-500">{{ date }}</span>
            <div class="flex-grow border-t border-gray-300"></div>
          </div>

          <!-- Notifications for this date -->
          <div
            v-for="notification in group"
            :key="notification.id"
            :class="[
              'bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200',
              !notification.read ? 'border-l-4 border-l-blue-500' : ''
            ]"
          >
            <div class="p-4">
              <div class="flex">
                <!-- Icon -->
                <div class="flex-shrink-0 mr-4">
                  <div
                    :class="[
                      'h-10 w-10 rounded-full flex items-center justify-center',
                      getNotificationColor(notification.type).bg
                    ]"
                  >
                    <svg
                      :class="['h-5 w-5', getNotificationColor(notification.type).text]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        :d="getNotificationIcon(notification.type)"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Content -->
                <div class="flex-grow">
                  <div class="flex items-start justify-between">
                    <div>
                      <p class="text-sm text-gray-900 font-medium mb-1">
                        {{ notification.title }}
                      </p>
                      <p class="text-sm text-gray-600 mb-2">
                        {{ notification.message }}
                      </p>
                      
                      <!-- Job Details for Job-related Notifications -->
                      <div v-if="notification.job" class="mb-2">
                        <div class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                          {{ getCategoryName(notification.job.category) }}
                        </div>
                        <span class="text-xs text-gray-500">
                          {{ notification.job.title }}
                        </span>
                      </div>

                      <!-- Action Buttons -->
                      <div v-if="notification.actions" class="mt-2 flex items-center space-x-2">
                        <button
                          v-for="action in notification.actions"
                          :key="action.label"
                          @click="handleAction(notification, action)"
                          :class="[
                            'text-xs px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                            action.type === 'primary'
                              ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                              : action.type === 'danger'
                              ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
                          ]"
                        >
                          {{ action.label }}
                        </button>
                      </div>
                    </div>

                    <!-- Timestamp and Actions -->
                    <div class="flex items-start space-x-2 ml-4">
                      <span class="text-xs text-gray-500 whitespace-nowrap">
                        {{ formatTime(notification.timestamp) }}
                      </span>
                      <div class="flex items-center">
                        <button
                          @click="toggleRead(notification)"
                          class="text-gray-400 hover:text-gray-600"
                          :title="notification.read ? 'Mark as unread' : 'Mark as read'"
                        >
                          <svg
                            v-if="notification.read"
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                          </svg>
                          <svg
                            v-else
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          @click="deleteNotification(notification.id)"
                          class="ml-2 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div v-if="hasMore" class="text-center pt-6">
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span v-if="loadingMore" class="animate-spin h-4 w-4 inline-block border-2 border-gray-300 border-t-transparent rounded-full mr-2"></span>
            Load More Notifications
          </button>
        </div>
      </div>

      <!-- Notification Settings Quick Access -->
      <div class="mt-8 bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Notification Settings</h3>
            <p class="text-sm text-gray-500 mt-1">
              Customize what notifications you receive
            </p>
          </div>
          <button
            @click="goToNotificationSettings"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Manage Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { jobCategories } from '@/utils/categories'

const router = useRouter()

// Filters
const filters = [
  { id: 'all', name: 'All' },
  { id: 'unread', name: 'Unread' },
  { id: 'jobs', name: 'Jobs' },
  { id: 'applications', name: 'Applications' },
  { id: 'payments', name: 'Payments' },
  { id: 'messages', name: 'Messages' },
  { id: 'system', name: 'System' }
]

// State
const activeFilter = ref('all')
const loading = ref(false)
const loadingMore = ref(false)
const error = ref('')
const hasMore = ref(true)

// Notifications Data
const notifications = ref([
  {
    id: 1,
    type: 'job',
    title: 'New Job Match',
    message: 'A new construction job in your area matches your skills',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    read: false,
    job: {
      id: 101,
      title: 'Construction Worker Needed',
      category: 'construction',
      wage: 800,
      wageType: 'daily'
    },
    actions: [
      { label: 'View Job', type: 'primary', action: 'view_job' },
      { label: 'Dismiss', type: 'secondary', action: 'dismiss' }
    ]
  },
  {
    id: 2,
    type: 'application',
    title: 'Application Accepted',
    message: 'Your application for "Delivery Driver" has been accepted',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    job: {
      id: 102,
      title: 'Delivery Driver',
      category: 'transportation-drivers'
    },
    actions: [
      { label: 'View Details', type: 'primary', action: 'view_application' },
      { label: 'Message Employer', type: 'secondary', action: 'message' }
    ]
  },
  {
    id: 3,
    type: 'payment',
    title: 'Payment Received',
    message: '₹2,500 has been credited to your wallet for completed work',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    actions: [
      { label: 'View Payment', type: 'primary', action: 'view_payment' },
      { label: 'Withdraw', type: 'secondary', action: 'withdraw' }
    ]
  },
  {
    id: 4,
    type: 'message',
    title: 'New Message',
    message: 'You have a new message from Rajesh Construction',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: false,
    actions: [
      { label: 'Reply', type: 'primary', action: 'reply' }
    ]
  },
  {
    id: 5,
    type: 'system',
    title: 'Profile Verification',
    message: 'Your Aadhaar card has been verified successfully',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    actions: []
  },
  {
    id: 6,
    type: 'job',
    title: 'Job Reminder',
    message: 'Your shift starts in 2 hours at Construction Site A',
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    read: true,
    job: {
      id: 103,
      title: 'Daily Construction Work',
      category: 'construction'
    },
    actions: [
      { label: 'Mark Complete', type: 'primary', action: 'mark_complete' }
    ]
  },
  {
    id: 7,
    type: 'application',
    title: 'New Job Application',
    message: 'A worker has applied for your "Office Assistant" job',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    read: true,
    job: {
      id: 104,
      title: 'Office Assistant',
      category: 'office-admin'
    },
    actions: [
      { label: 'Review Application', type: 'primary', action: 'review' }
    ]
  },
  {
    id: 8,
    type: 'payment',
    title: 'Payment Failed',
    message: 'Your wallet withdrawal of ₹1,000 failed. Please check your bank details',
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    read: true,
    actions: [
      { label: 'Update Details', type: 'primary', action: 'update_details' },
      { label: 'Try Again', type: 'secondary', action: 'retry' }
    ]
  }
])

// Computed
const filteredNotifications = computed(() => {
  if (activeFilter.value === 'all') {
    return notifications.value
  }
  
  if (activeFilter.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  }
  
  return notifications.value.filter(n => n.type === activeFilter.value)
})

const groupedNotifications = computed(() => {
  const groups = {}
  
  filteredNotifications.value.forEach(notification => {
    const date = formatDate(notification.timestamp)
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(notification)
  })
  
  return groups
})

// Update filter counts
onMounted(() => {
  filters.forEach(filter => {
    if (filter.id === 'all') {
      filter.count = notifications.value.length
    } else if (filter.id === 'unread') {
      filter.count = notifications.value.filter(n => !n.read).length
    } else {
      filter.count = notifications.value.filter(n => n.type === filter.id).length
    }
  })
})

// Methods
const getNotificationColor = (type) => {
  const colors = {
    job: { bg: 'bg-blue-100', text: 'text-blue-600' },
    application: { bg: 'bg-green-100', text: 'text-green-600' },
    payment: { bg: 'bg-purple-100', text: 'text-purple-600' },
    message: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    system: { bg: 'bg-gray-100', text: 'text-gray-600' }
  }
  return colors[type] || colors.system
}

const getNotificationIcon = (type) => {
  const icons = {
    job: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    application: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    payment: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    message: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    system: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
  return icons[type] || icons.system
}

const getCategoryName = (categoryId) => {
  const category = jobCategories.find(c => c.id === categoryId)
  return category ? category.name : categoryId
}

const formatDate = (date) => {
  const today = new Date()
  const notificationDate = new Date(date)
  const diffTime = today - notificationDate
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
  return notificationDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (date) => {
  const notificationDate = new Date(date)
  const now = new Date()
  const diffMs = now - notificationDate
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  
  if (diffMins < 60) {
    return diffMins === 0 ? 'Just now' : `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else {
    return notificationDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const fetchNotifications = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // In production, call API to fetch notifications
    // const response = await fetch('/api/notifications')
    // notifications.value = await response.json()
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
  } catch (err) {
    error.value = 'Failed to load notifications'
    console.error('Error fetching notifications:', err)
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  loadingMore.value = true
  
  try {
    // In production, load more notifications from API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Add more dummy notifications
    const newNotifications = [
      {
        id: notifications.value.length + 1,
        type: 'job',
        title: 'Weekend Job Available',
        message: 'Extra hours available this weekend at warehouse',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        read: true,
        job: {
          id: 105,
          title: 'Warehouse Helper',
          category: 'logistics-warehouse'
        },
        actions: [
          { label: 'Apply Now', type: 'primary', action: 'apply' }
        ]
      }
    ]
    
    notifications.value.push(...newNotifications)
    
  } catch (err) {
    console.error('Error loading more notifications:', err)
  } finally {
    loadingMore.value = false
  }
}

const toggleRead = (notification) => {
  notification.read = !notification.read
  
  // Update filter counts
  const unreadFilter = filters.find(f => f.id === 'unread')
  if (unreadFilter) {
    unreadFilter.count = notifications.value.filter(n => !n.read).length
  }
}

const deleteNotification = (id) => {
  if (confirm('Are you sure you want to delete this notification?')) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
      
      // Update filter counts
      filters.forEach(filter => {
        if (filter.id === 'all') {
          filter.count = notifications.value.length
        } else if (filter.id === 'unread') {
          filter.count = notifications.value.filter(n => !n.read).length
        } else {
          filter.count = notifications.value.filter(n => n.type === filter.id).length
        }
      })
    }
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
  
  // Update unread count
  const unreadFilter = filters.find(f => f.id === 'unread')
  if (unreadFilter) {
    unreadFilter.count = 0
  }
}

const clearAll = () => {
  if (confirm('Are you sure you want to clear all notifications?')) {
    notifications.value = []
    
    // Update filter counts
    filters.forEach(filter => {
      filter.count = 0
    })
  }
}

const handleAction = (notification, action) => {
  console.log('Action:', action.action, 'for notification:', notification.id)
  
  switch (action.action) {
    case 'view_job':
      if (notification.job) {
        router.push(`/jobs/${notification.job.id}`)
      }
      break
    case 'view_application':
      router.push('/worker/applications')
      break
    case 'view_payment':
      router.push('/worker/wallet')
      break
    case 'dismiss':
      deleteNotification(notification.id)
      break
    case 'message':
      // Open chat with employer
      console.log('Open chat')
      break
    default:
      console.log('Action not implemented:', action.action)
  }
  
  // Mark as read after action
  if (!notification.read) {
    toggleRead(notification)
  }
}

const goToNotificationSettings = () => {
  router.push('/settings?tab=notifications')
}

// Fetch notifications on mount
onMounted(() => {
  fetchNotifications()
})
</script>

<style scoped>
/* Custom styles */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}
.notification-enter-from,
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
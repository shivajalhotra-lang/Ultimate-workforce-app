<!-- File: /src/App.vue -->
<template>
  <div class="app-container" :class="[theme, language]">
    <!-- Sidebar for Desktop -->
    <aside v-if="!isMobile || sidebarOpen" 
           class="sidebar" 
           :class="{ 'mobile-sidebar': isMobile, 'open': sidebarOpen }">
      
      <!-- Logo -->
      <div class="sidebar-header">
        <div class="logo" @click="router.push('/dashboard')">
          <div class="logo-icon">
            <Briefcase class="w-6 h-6" />
          </div>
          <span class="logo-text">ShramikConnect</span>
        </div>
        <button v-if="isMobile" @click="sidebarOpen = false" class="close-sidebar">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- User Profile -->
      <div class="user-profile">
        <div class="avatar" :style="{ background: userAvatarColor }">
          {{ userInitials }}
        </div>
        <div class="user-info">
          <div class="user-name">{{ userName }}</div>
          <div class="user-role">{{ userRole }}</div>
        </div>
        <div class="online-indicator" :class="{ online: isOnline }"></div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <template v-for="item in navItems" :key="item.path">
          <router-link 
            :to="item.path"
            class="nav-item"
            :class="{ 'active': $route.path.startsWith(item.path) }"
            @click="isMobile && (sidebarOpen = false)"
          >
            <component :is="item.icon" class="nav-icon" />
            <span class="nav-text">{{ item.name }}</span>
            <span v-if="item.badge" class="nav-badge">{{ item.badge }}</span>
          </router-link>
        </template>
      </nav>

      <!-- Quick Stats -->
      <div class="sidebar-stats">
        <div class="stat-item">
          <Wallet class="w-4 h-4" />
          <span class="stat-label">Balance</span>
          <span class="stat-value">₹{{ userBalance }}</span>
        </div>
        <div class="stat-item">
          <Calendar class="w-4 h-4" />
          <span class="stat-label">Today</span>
          <span class="stat-value">{{ todayJobs }}</span>
        </div>
      </div>

      <!-- Theme & Language Toggle -->
      <div class="sidebar-footer">
        <button @click="toggleTheme" class="theme-toggle">
          <Sun v-if="theme === 'light'" class="w-5 h-5" />
          <Moon v-else class="w-5 h-5" />
        </button>
        <button @click="toggleLanguage" class="language-toggle">
          <Globe class="w-5 h-5" />
          <span>{{ language === 'en' ? 'हिंदी' : 'EN' }}</span>
        </button>
        <button @click="logout" class="logout-btn">
          <LogOut class="w-5 h-5" />
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content" :class="{ 'sidebar-open': sidebarOpen }">
      <!-- Top Header -->
      <header class="main-header">
        <div class="header-left">
          <button v-if="isMobile" @click="sidebarOpen = true" class="menu-toggle">
            <Menu class="w-6 h-6" />
          </button>
          <div class="header-title">
            <h1>{{ currentPageTitle }}</h1>
            <p class="page-subtitle">{{ currentPageSubtitle }}</p>
          </div>
        </div>
        
        <div class="header-right">
          <!-- Search -->
          <div class="search-container">
            <Search class="search-icon" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Search jobs, workers..." 
              class="search-input"
            />
          </div>

          <!-- Notifications -->
          <button class="notification-btn" @click="toggleNotifications">
            <Bell class="w-5 h-5" />
            <span v-if="unreadNotifications" class="notification-badge">
              {{ unreadNotifications }}
            </span>
          </button>

          <!-- Quick Actions -->
          <div class="quick-actions">
            <button v-for="action in quickActions" 
                    :key="action.label"
                    @click="action.handler"
                    class="quick-action-btn"
                    :title="action.label">
              <component :is="action.icon" class="w-5 h-5" />
            </button>
          </div>

          <!-- User Menu -->
          <div class="user-menu">
            <button @click="userMenuOpen = !userMenuOpen" class="user-menu-btn">
              <div class="user-avatar-small" :style="{ background: userAvatarColor }">
                {{ userInitials }}
              </div>
              <ChevronDown class="w-4 h-4" />
            </button>
            
            <div v-if="userMenuOpen" class="user-dropdown">
              <router-link to="/profile" class="dropdown-item">
                <User class="w-4 h-4" />
                Profile
              </router-link>
              <router-link to="/settings" class="dropdown-item">
                <Settings class="w-4 h-4" />
                Settings
              </router-link>
              <router-link to="/wallet" class="dropdown-item">
                <Wallet class="w-4 h-4" />
                Wallet
              </router-link>
              <div class="dropdown-divider"></div>
              <button @click="logout" class="dropdown-item logout">
                <LogOut class="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Notifications Panel -->
      <div v-if="showNotifications" class="notifications-panel">
        <div class="notifications-header">
          <h3>Notifications</h3>
          <button @click="markAllAsRead" class="mark-read-btn">Mark all as read</button>
        </div>
        <div class="notifications-list">
          <div v-for="notification in notifications" 
               :key="notification.id"
               class="notification-item"
               :class="{ 'unread': !notification.read }">
            <div class="notification-icon">
              <component :is="notification.icon" class="w-5 h-5" />
            </div>
            <div class="notification-content">
              <p class="notification-text">{{ notification.text }}</p>
              <span class="notification-time">{{ notification.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <div class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>

      <!-- Floating Action Button -->
      <button v-if="showFAB" @click="handleFAB" class="fab">
        <Plus class="w-6 h-6" />
      </button>

      <!-- Bottom Navigation (Mobile) -->
      <nav v-if="isMobile" class="bottom-nav">
        <router-link v-for="item in bottomNavItems" 
                     :key="item.path"
                     :to="item.path"
                     class="bottom-nav-item"
                     :class="{ 'active': $route.path === item.path }">
          <component :is="item.icon" class="w-5 h-5" />
          <span class="bottom-nav-text">{{ item.name }}</span>
        </router-link>
      </nav>
    </main>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <transition-group name="toast">
        <div v-for="toast in toasts" 
             :key="toast.id"
             class="toast"
             :class="`toast-${toast.type}`">
          <component :is="toast.icon" class="w-5 h-5" />
          <div class="toast-content">
            <p class="toast-title">{{ toast.title }}</p>
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button @click="removeToast(toast.id)" class="toast-close">
            <X class="w-4 h-4" />
          </button>
        </div>
      </transition-group>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  Briefcase, 
  Home, 
  User, 
  Settings, 
  Wallet, 
  Calendar, 
  Search, 
  Bell,
  ChevronDown, 
  Menu, 
  X, 
  LogOut, 
  Plus,
  Sun, 
  Moon, 
  Globe, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Shield
} from 'lucide-vue-next'
import { useAuthStore } from './stores/auth.store'
import { useUIStore } from './stores/ui.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()

// State
const sidebarOpen = ref(false)
const userMenuOpen = ref(false)
const showNotifications = ref(false)
const searchQuery = ref('')
const loading = ref(false)
const isMobile = ref(false)
const toasts = ref([])
const isOnline = ref(true)

// User data (from store)
const userName = computed(() => authStore.user?.name || 'Guest')
const userRole = computed(() => authStore.user?.role || 'Worker')
const userInitials = computed(() => {
  const name = userName.value
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})
const userAvatarColor = computed(() => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ]
  const index = userName.value.length % colors.length
  return colors[index]
})

// Mock data
const userBalance = ref(12500)
const todayJobs = ref(3)

// Theme & Language
const theme = computed(() => uiStore.theme)
const language = computed(() => uiStore.language)

// Navigation
const navItems = computed(() => {
  const baseItems = [
    { path: '/dashboard', name: 'Dashboard', icon: Home },
    { path: '/jobs', name: 'Jobs', icon: Briefcase, badge: '5' },
    { path: '/wallet', name: 'Wallet', icon: Wallet },
    { path: '/profile', name: 'Profile', icon: User },
    { path: '/settings', name: 'Settings', icon: Settings }
  ]
  
  // Add role-specific items
  if (userRole.value === 'admin') {
    baseItems.splice(2, 0, { path: '/admin', name: 'Admin', icon: Shield })
  }
  
  return baseItems
})

const bottomNavItems = computed(() => {
  return navItems.value.slice(0, 4) // Show first 4 items on mobile
})

// Quick actions based on role
const quickActions = computed(() => {
  const actions = []
  
  if (userRole.value === 'worker') {
    actions.push(
      { icon: Briefcase, label: 'Find Jobs', handler: () => router.push('/jobs') },
      { icon: Wallet, label: 'Withdraw', handler: () => router.push('/wallet/withdraw') }
    )
  } else if (userRole.value === 'employer') {
    actions.push(
      { icon: Plus, label: 'Post Job', handler: () => router.push('/jobs/new') },
      { icon: User, label: 'Find Workers', handler: () => router.push('/workers') }
    )
  }
  
  return actions
})

// Notifications
const notifications = ref([
  { id: 1, text: 'New job matching your skills: Electrician needed', time: '5 min ago', read: false, icon: Briefcase },
  { id: 2, text: 'Payment of ₹500 received for yesterday\'s work', time: '1 hour ago', read: true, icon: Wallet },
  { id: 3, text: 'Your profile is 80% complete. Add more skills!', time: '2 hours ago', read: true, icon: User }
])

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// FAB visibility
const showFAB = computed(() => {
  return userRole.value === 'employer' && route.path === '/jobs'
})

// Page title
const currentPageTitle = computed(() => {
  const routeName = route.name || ''
  return routeName.charAt(0).toUpperCase() + routeName.slice(1)
})

const currentPageSubtitle = computed(() => {
  const map = {
    'dashboard': 'Overview of your activity',
    'jobs': 'Browse available opportunities',
    'wallet': 'Manage your earnings',
    'profile': 'Edit your personal details'
  }
  return map[route.name?.toLowerCase()] || ''
})

// Methods
const toggleTheme = () => {
  uiStore.toggleTheme()
}

const toggleLanguage = () => {
  uiStore.toggleLanguage()
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const logout = async () => {
  loading.value = true
  await authStore.logout()
  router.push('/login')
  loading.value = false
}

const handleFAB = () => {
  if (userRole.value === 'employer') {
    router.push('/jobs/new')
  }
}

const addToast = (title, message, type = 'info') => {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  }
  
  const id = Date.now()
  toasts.value.push({
    id,
    title,
    message,
    type,
    icon: icons[type]
  })
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeToast(id)
  }, 5000)
}

const removeToast = (id) => {
  toasts.value = toasts.value.filter(toast => toast.id !== id)
}

// Check mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// Lifecycle
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Demo: Add a welcome toast
  setTimeout(() => {
    addToast('Welcome back!', `You're logged in as ${userRole.value}`, 'success')
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Watch route changes
watch(() => route.path, () => {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
  userMenuOpen.value = false
  showNotifications.value = false
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.app-container.dark {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #e2e8f0;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.dark .sidebar {
  background: rgba(30, 41, 59, 0.9);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 1rem;
  margin-bottom: 2rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
}

.user-role {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: capitalize;
}

.dark .user-role {
  color: #94a3b8;
}

.online-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
}

.online-indicator.online {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.nav-item:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.nav-item.active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.nav-icon {
  width: 20px;
  height: 20px;
}

.nav-text {
  flex: 1;
  font-weight: 500;
}

.nav-badge {
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-weight: 600;
}

.sidebar-stats {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.dark .sidebar-stats {
  background: rgba(30, 41, 59, 0.5);
  border-color: rgba(255, 255, 255, 0.1);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.stat-label {
  flex: 1;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .stat-label {
  color: #94a3b8;
}

.stat-value {
  font-weight: 600;
  color: #3b82f6;
}

.sidebar-footer {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.dark .sidebar-footer {
  border-top-color: rgba(255, 255, 255, 0.1);
}

.theme-toggle,
.language-toggle,
.logout-btn {
  flex: 1;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.dark .theme-toggle,
.dark .language-toggle,
.dark .logout-btn {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.theme-toggle:hover,
.language-toggle:hover,
.logout-btn:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.dark .theme-toggle:hover,
.dark .language-toggle:hover,
.dark .logout-btn:hover {
  background: #334155;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.main-header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.dark .main-header {
  background: rgba(30, 41, 59, 0.8);
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-toggle {
  display: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  cursor: pointer;
}

.dark .menu-toggle {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.header-title h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.page-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.dark .page-subtitle {
  color: #94a3b8;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-container {
  position: relative;
  width: 300px;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  background: white;
  transition: all 0.2s;
}

.dark .search-input {
  background: #1e293b;
  border-color: #475569;
  color: #e2e8f0;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.notification-btn {
  position: relative;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  cursor: pointer;
}

.dark .notification-btn {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.notification-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-weight: 600;
}

.quick-actions {
  display: flex;
  gap: 0.5rem;
}

.quick-action-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.dark .quick-action-btn {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.quick-action-btn:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.dark .quick-action-btn:hover {
  background: #334155;
}

.user-menu {
  position: relative;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  cursor: pointer;
}

.dark .user-menu-btn {
  background: #1e293b;
  border-color: rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
}

.user-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  z-index: 50;
  margin-top: 0.5rem;
}

.dark .user-dropdown {
  background: #1e293b;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s;
}

.dark .dropdown-item {
  color: #e2e8f0;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dark .dropdown-item:hover {
  background: #334155;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.5rem 0;
}

.dark .dropdown-divider {
  background: #475569;
}

/* Notifications Panel */
.notifications-panel {
  position: absolute;
  top: 100%;
  right: 2rem;
  width: 400px;
  max-height: 500px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  z-index: 40;
  overflow: hidden;
}

.dark .notifications-panel {
  background: #1e293b;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.notifications-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dark .notifications-header {
  border-bottom-color: #475569;
}

.notifications-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.mark-read-btn {
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s;
}

.dark .notification-item {
  border-bottom-color: #334155;
}

.notification-item:hover {
  background: #f9fafb;
}

.dark .notification-item:hover {
  background: #334155;
}

.notification-item.unread {
  background: #f0f9ff;
}

.dark .notification-item.unread {
  background: rgba(59, 130, 246, 0.1);
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-text {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Page Content */
.page-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Page Transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* FAB */
.fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  transition: all 0.3s;
  z-index: 30;
}

.fab:hover {
  transform: scale(1.1) rotate(90deg);
  box-shadow: 0 15px 30px rgba(59, 130, 246, 0.4);
}

/* Bottom Navigation (Mobile) */
.bottom-nav {
  display: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
}

.dark .bottom-nav {
  background: rgba(30, 41, 59, 0.9);
  border-top-color: rgba(255, 255, 255, 0.1);
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  color: #6b7280;
  transition: all 0.2s;
}

.dark .bottom-nav-item {
  color: #94a3b8;
}

.bottom-nav-item.active {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

.bottom-nav-text {
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

/* Toast Container */
.toast-container {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 100;
}

.toast {
  width: 350px;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 1rem;
  animation: slideInRight 0.3s ease;
}

.dark .toast {
  background: #1e293b;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.toast-success {
  border-left: 4px solid #10b981;
}

.toast-error {
  border-left: 4px solid #ef4444;
}

.toast-info {
  border-left: 4px solid #3b82f6;
}

.toast-content {
  flex: 1;
}

.toast-title {
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.toast-message {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.dark .toast-message {
  color: #94a3b8;
}

.toast-close {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dark .loading-overlay {
  background: rgba(15, 23, 42, 0.9);
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.dark .spinner {
  border-color: #475569;
  border-top-color: #3b82f6;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #6b7280;
  font-size: 0.875rem;
}

.dark .loading-text {
  color: #94a3b8;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    bottom: 0;
    z-index: 40;
    transition: left 0.3s ease;
  }
  
  .sidebar.open {
    left: 0;
  }
  
  .mobile-sidebar {
    width: 100%;
    max-width: 280px;
  }
  
  .menu-toggle {
    display: block;
  }
  
  .header-right {
    gap: 0.5rem;
  }
  
  .search-container {
    display: none;
  }
  
  .quick-actions {
    display: none;
  }
  
  .notifications-panel {
    width: calc(100% - 2rem);
    right: 1rem;
  }
  
  .page-content {
    padding: 1rem;
  }
  
  .bottom-nav {
    display: flex;
  }
  
  .fab {
    bottom: 5rem;
    right: 1rem;
  }
  
  .toast-container {
    left: 1rem;
    right: 1rem;
    bottom: 5rem;
  }
  
  .toast {
    width: 100%;
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.close-sidebar {
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
}

.dark .close-sidebar {
  color: #94a3b8;
}
</style>
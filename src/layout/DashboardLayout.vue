<template>
  <div class="dashboard-layout">
    <!-- Sidebar for Desktop -->
    <aside 
      :class="['sidebar', { 'collapsed': sidebarCollapsed }]"
      v-if="!isMobile || sidebarOpen">
      <div class="sidebar-header">
        <div class="logo-section">
          <div class="logo">
            <div class="logo-icon">UW</div>
            <div v-if="!sidebarCollapsed" class="logo-text">
              <div class="logo-title">Ultimate Workforce</div>
              <div class="logo-subtitle">Admin Panel</div>
            </div>
          </div>
          <button 
            @click="toggleSidebar"
            class="sidebar-toggle"
            v-if="!isMobile">
            <ChevronLeft v-if="!sidebarCollapsed" class="w-4 h-4" />
            <ChevronRight v-else class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="sidebar-nav">
        <div class="nav-section">
          <div class="nav-label" v-if="!sidebarCollapsed">Main</div>
          <RouterLink 
            v-for="item in mainMenu" 
            :key="item.path"
            :to="item.path"
            :class="['nav-item', { 'active': $route.path === item.path }]"
            @click="closeMobileSidebar">
            <component :is="item.icon" class="nav-icon w-5 h-5" />
            <span v-if="!sidebarCollapsed" class="nav-text">{{ item.label }}</span>
            <Badge v-if="item.badge && !sidebarCollapsed" class="nav-badge">
              {{ item.badge }}
            </Badge>
          </RouterLink>
        </div>

        <div class="nav-section">
          <div class="nav-label" v-if="!sidebarCollapsed">Management</div>
          <RouterLink 
            v-for="item in managementMenu" 
            :key="item.path"
            :to="item.path"
            :class="['nav-item', { 'active': $route.path.startsWith(item.path) }]"
            @click="closeMobileSidebar">
            <component :is="item.icon" class="nav-icon w-5 h-5" />
            <span v-if="!sidebarCollapsed" class="nav-text">{{ item.label }}</span>
          </RouterLink>
        </div>

        <div class="nav-section">
          <div class="nav-label" v-if="!sidebarCollapsed">Tools</div>
          <RouterLink 
            v-for="item in toolsMenu" 
            :key="item.path"
            :to="item.path"
            :class="['nav-item', { 'active': $route.path === item.path }]"
            @click="closeMobileSidebar">
            <component :is="item.icon" class="nav-icon w-5 h-5" />
            <span v-if="!sidebarCollapsed" class="nav-text">{{ item.label }}</span>
          </RouterLink>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer" v-if="!sidebarCollapsed">
        <div class="admin-profile">
          <div class="admin-avatar">
            {{ currentUser.name.charAt(0) }}
          </div>
          <div class="admin-info">
            <div class="admin-name">{{ currentUser.name }}</div>
            <div class="admin-role">{{ currentUser.role }}</div>
          </div>
          <button @click="logout" class="logout-btn" title="Logout">
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Overlay for Mobile Sidebar -->
    <div 
      v-if="isMobile && sidebarOpen" 
      class="sidebar-overlay"
      @click="closeMobileSidebar"></div>

    <!-- Main Content Area -->
    <div class="main-content" :class="{ 'full-width': sidebarCollapsed }">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <button 
            @click="toggleMobileSidebar"
            class="mobile-menu-btn"
            v-if="isMobile">
            <Menu class="w-6 h-6" />
          </button>
          <div class="breadcrumb">
            <span class="breadcrumb-item">Admin</span>
            <ChevronRight class="breadcrumb-separator w-4 h-4" />
            <span class="breadcrumb-item current">{{ currentPageTitle }}</span>
          </div>
        </div>

        <div class="header-right">
          <!-- Quick Stats -->
          <div class="quick-stats">
            <div class="stat-item">
              <Users class="w-4 h-4 stat-icon" />
              <span class="stat-value">{{ stats.totalUsers.toLocaleString() }}</span>
              <span class="stat-label">Users</span>
            </div>
            <div class="stat-item">
              <Briefcase class="w-4 h-4 stat-icon" />
              <span class="stat-value">{{ stats.activeJobs.toLocaleString() }}</span>
              <span class="stat-label">Jobs</span>
            </div>
            <div class="stat-item">
              <AlertCircle class="w-4 h-4 stat-icon" />
              <span class="stat-value">{{ stats.pendingActions }}</span>
              <span class="stat-label">Pending</span>
            </div>
          </div>

          <!-- Header Actions -->
          <div class="header-actions">
            <button @click="toggleNotifications" class="header-btn" title="Notifications">
              <Bell class="w-5 h-5" />
              <span v-if="unreadNotifications > 0" class="notification-badge">
                {{ unreadNotifications }}
              </span>
            </button>
            
            <button @click="toggleTheme" class="header-btn" title="Toggle Theme">
              <Sun v-if="theme === 'dark'" class="w-5 h-5" />
              <Moon v-else class="w-5 h-5" />
            </button>
            
            <div class="user-dropdown">
              <button @click="toggleUserMenu" class="user-menu-btn">
                <div class="user-avatar-sm">
                  {{ currentUser.name.charAt(0) }}
                </div>
                <span class="user-name-sm">{{ currentUser.name }}</span>
                <ChevronDown class="w-4 h-4" />
              </button>
              
              <div v-if="userMenuOpen" class="user-dropdown-menu">
                <RouterLink to="/admin/profile" class="dropdown-item">
                  <User class="w-4 h-4" />
                  Profile
                </RouterLink>
                <RouterLink to="/admin/settings" class="dropdown-item">
                  <Settings class="w-4 h-4" />
                  Settings
                </RouterLink>
                <div class="dropdown-divider"></div>
                <button @click="logout" class="dropdown-item">
                  <LogOut class="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="page-content">
        <RouterView />
      </main>

      <!-- Notifications Panel -->
      <div v-if="notificationsOpen" class="notifications-panel">
        <div class="notifications-header">
          <h3>Notifications</h3>
          <button @click="toggleNotifications" class="close-btn">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="notifications-list">
          <!-- Notification items would go here -->
          <div class="notification-item unread">
            <div class="notification-icon">
              <UserCheck class="w-4 h-4" />
            </div>
            <div class="notification-content">
              <div class="notification-title">New User Verified</div>
              <div class="notification-text">Ramesh Kumar has completed KYC verification</div>
              <div class="notification-time">2 min ago</div>
            </div>
          </div>
          <div class="notification-item">
            <div class="notification-icon">
              <AlertCircle class="w-4 h-4" />
            </div>
            <div class="notification-content">
              <div class="notification-title">Job Report</div>
              <div class="notification-text">Job #JOB123 has been reported</div>
              <div class="notification-time">1 hour ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  // Icons
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Shield,
  MessageSquare,
  Settings,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  UserCheck,
  AlertCircle,
  BarChart3,
  HelpCircle,
  CreditCard
} from 'lucide-vue-next'
import Badge from '@/components/ui/Badge.vue'

// Router
const route = useRoute()
const router = useRouter()

// Reactive State
const sidebarCollapsed = ref(false)
const sidebarOpen = ref(false)
const isMobile = ref(false)
const userMenuOpen = ref(false)
const notificationsOpen = ref(false)
const theme = ref('light')

// Stats Data
const stats = ref({
  totalUsers: 1250,
  activeJobs: 87,
  pendingActions: 12,
  revenue: 254300
})

const unreadNotifications = ref(3)

// Current User
const currentUser = ref({
  name: 'Admin User',
  role: 'Super Admin',
  email: 'admin@ultimateworkforce.com'
})

// Navigation Menu Items
const mainMenu = ref([
  { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/reports', label: 'Reports', icon: FileText }
])

const managementMenu = ref([
  { path: '/admin/users', label: 'User Management', icon: Users, badge: '3' },
  { path: '/admin/jobs', label: 'Job Management', icon: Briefcase },
  { path: '/admin/payments', label: 'Payments', icon: CreditCard },
  { path: '/admin/kyc', label: 'KYC Verification', icon: Shield, badge: '5' }
])

const toolsMenu = ref([
  { path: '/admin/support', label: 'Support Tickets', icon: MessageSquare, badge: '2' },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
  { path: '/admin/help', label: 'Help & Guide', icon: HelpCircle }
])

// Computed Properties
const currentPageTitle = computed(() => {
  const allItems = [...mainMenu.value, ...managementMenu.value, ...toolsMenu.value]
  const currentItem = allItems.find(item => route.path === item.path || route.path.startsWith(item.path))
  return currentItem ? currentItem.label : 'Dashboard'
})

// Methods
const toggleSidebar = () => {
  if (isMobile.value) {
    sidebarOpen.value = !sidebarOpen.value
  } else {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }
}

const toggleMobileSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeMobileSidebar = () => {
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const toggleNotifications = () => {
  notificationsOpen.value = !notificationsOpen.value
  if (notificationsOpen.value) {
    userMenuOpen.value = false
  }
}

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme.value)
}

const logout = () => {
  console.log('Logging out...')
  router.push('/login')
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    sidebarOpen.value = false
  }
}

// Lifecycle
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Initialize theme
  const savedTheme = localStorage.getItem('theme') || 'light'
  theme.value = savedTheme
  document.documentElement.setAttribute('data-theme', savedTheme)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: var(--background, #f8fafc);
  position: relative;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: var(--sidebar-bg, #1e293b);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 40;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.logo-text {
  opacity: 1;
  transition: opacity 0.3s;
}

.sidebar.collapsed .logo-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.logo-title {
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.125rem;
}

.sidebar-toggle {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Navigation Styles */
.sidebar-nav {
  flex: 1;
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 1.5rem;
}

.nav-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.75rem;
  padding-left: 0.75rem;
  transition: opacity 0.3s;
}

.sidebar.collapsed .nav-label {
  opacity: 0;
  height: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  margin-bottom: 0.25rem;
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-weight: 500;
}

.nav-icon {
  flex-shrink: 0;
}

.nav-text {
  flex: 1;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.sidebar.collapsed .nav-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.nav-badge {
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1.5rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.admin-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.admin-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981, #3b82f6);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  color: white;
  flex-shrink: 0;
}

.admin-info {
  flex: 1;
  min-width: 0;
}

.admin-name {
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-role {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.125rem;
}

.logout-btn {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Mobile Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 30;
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 280px;
  transition: margin-left 0.3s;
}

.main-content.full-width {
  margin-left: 80px;
}

/* Header Styles */
.top-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 20;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.mobile-menu-btn:hover {
  background: #f3f4f6;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.breadcrumb-item {
  color: #6b7280;
  font-size: 0.875rem;
}

.breadcrumb-item.current {
  color: #1f2937;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #9ca3af;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.quick-stats {
  display: flex;
  gap: 1.5rem;
  padding-right: 1.5rem;
  border-right: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  color: #6b7280;
}

.stat-value {
  font-weight: 600;
  color: #1f2937;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-btn {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.header-btn:hover {
  background: #f3f4f6;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* User Dropdown */
.user-dropdown {
  position: relative;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.user-menu-btn:hover {
  background: #f3f4f6;
}

.user-avatar-sm {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #10b981, #3b82f6);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 0.875rem;
}

.user-name-sm {
  font-weight: 500;
  font-size: 0.875rem;
  color: #1f2937;
}

.user-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 50;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #4b5563;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.2s;
  cursor: pointer;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 0.25rem 0;
}

/* Notifications Panel */
.notifications-panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 1.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 380px;
  z-index: 50;
  overflow: hidden;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.notifications-header h3 {
  font-weight: 600;
  font-size: 1rem;
  color: #1f2937;
}

.close-btn {
  width: 32px;
  height: 32px;
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

.notifications-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.2s;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #eff6ff;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.notification-text {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.notification-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Page Content */
.page-content {
  padding: 1.5rem;
  min-height: calc(100vh - 80px);
}

/* Responsive Styles */
@media (max-width: 1024px) {
  .main-content {
    margin-left: 0;
  }
  
  .main-content.full-width {
    margin-left: 0;
  }
  
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .sidebar.collapsed {
    width: 280px;
  }
  
  .quick-stats {
    display: none;
  }
}

@media (max-width: 768px) {
  .notifications-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-width: 380px;
    border-radius: 0;
  }
  
  .user-name-sm {
    display: none;
  }
}
</style>
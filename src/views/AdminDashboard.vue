<template>
  <div class="admin-dashboard">
    <!-- Admin Header -->
    <div class="admin-header">
      <div class="header-left">
        <div class="admin-badge">
          <Shield class="w-5 h-5" />
          <span>District Admin</span>
        </div>
        <h1 class="page-title">District Control Panel</h1>
        <p class="district-info">Rudrapur District • Uttarakhand</p>
      </div>
      <div class="header-right">
        <button @click="exportData" class="btn-outline">
          <Download class="w-4 h-4" />
          <span>Export Data</span>
        </button>
        <button @click="syncNow" class="btn-primary">
          <RefreshCw class="w-4 h-4" />
          <span>Sync All Data</span>
        </button>
        <div class="last-sync">
          Last sync: {{ lastSyncTime }}
        </div>
      </div>
    </div>

    <!-- Live Stats Grid -->
    <div class="live-stats-grid">
      <div class="live-stat-card critical">
        <div class="stat-header">
          <div class="stat-icon">
            <Users class="w-5 h-5" />
          </div>
          <div class="stat-change positive">+12%</div>
        </div>
        <div class="stat-value">{{ formatNumber(stats.totalWorkers) }}</div>
        <div class="stat-label">Total Workers</div>
        <div class="stat-detail">Verified: {{ formatNumber(stats.verifiedWorkers) }}</div>
      </div>

      <div class="live-stat-card">
        <div class="stat-header">
          <div class="stat-icon">
            <Briefcase class="w-5 h-5" />
          </div>
          <div class="stat-change positive">+8%</div>
        </div>
        <div class="stat-value">{{ formatNumber(stats.totalEmployers) }}</div>
        <div class="stat-label">Registered Employers</div>
        <div class="stat-detail">Active: {{ formatNumber(stats.activeEmployers) }}</div>
      </div>

      <div class="live-stat-card warning">
        <div class="stat-header">
          <div class="stat-icon">
            <TrendingUp class="w-5 h-5" />
          </div>
          <div class="stat-change positive">+15%</div>
        </div>
        <div class="stat-value">₹{{ formatNumber(stats.totalWages) }}</div>
        <div class="stat-label">Total Wages Processed</div>
        <div class="stat-detail">Today: ₹{{ formatNumber(stats.todayWages) }}</div>
      </div>

      <div class="live-stat-card">
        <div class="stat-header">
          <div class="stat-icon">
            <CheckCircle class="w-5 h-5" />
          </div>
          <div class="stat-change negative">-3%</div>
        </div>
        <div class="stat-value">{{ stats.pendingVerifications }}</div>
        <div class="stat-label">Pending Verifications</div>
        <div class="stat-detail">{{ stats.pendingJobs }} jobs pending</div>
      </div>
    </div>

    <!-- District Map Preview -->
    <div class="map-section">
      <div class="section-header">
        <h2 class="section-title">District Activity Map</h2>
        <div class="map-legend">
          <div class="legend-item">
            <div class="legend-dot high"></div>
            <span>High Activity</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot medium"></div>
            <span>Medium</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot low"></div>
            <span>Low</span>
          </div>
        </div>
      </div>
      <div class="map-container">
        <!-- Simplified map visualization -->
        <div class="district-map">
          <div class="map-area" v-for="area in districtAreas" 
               :key="area.name"
               :class="`activity-${area.activity}`"
               :style="{
                 top: `${area.top}%`,
                 left: `${area.left}%`,
                 width: `${area.width}%`,
                 height: `${area.height}%`
               }">
            <div class="area-label">{{ area.name }}</div>
            <div class="area-stats">{{ area.jobs }} jobs</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Admin Actions -->
    <div class="admin-actions-section">
      <h2 class="section-title">Quick Admin Actions</h2>
      <div class="actions-grid">
        <button v-for="action in adminActions" 
                :key="action.label"
                @click="action.handler"
                class="admin-action-btn">
          <component :is="action.icon" class="action-icon" />
          <span class="action-label">{{ action.label }}</span>
          <span v-if="action.count" class="action-count">{{ action.count }}</span>
        </button>
      </div>
    </div>

    <!-- Tabs for Different Admin Sections -->
    <div class="admin-tabs">
      <div class="tabs-header">
        <button v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="tab-btn"
                :class="{ 'active': activeTab === tab.id }">
          {{ tab.label }}
          <span v-if="tab.count" class="tab-count">{{ tab.count }}</span>
        </button>
      </div>
      
      <div class="tabs-content">
        <!-- Wage Management Tab -->
        <div v-if="activeTab === 'wages'" class="tab-pane">
          <WageManagementPanel />
        </div>

        <!-- User Management Tab -->
        <div v-if="activeTab === 'users'" class="tab-pane">
          <UserManagementPanel />
        </div>

        <!-- Categories Tab -->
        <div v-if="activeTab === 'categories'" class="tab-pane">
          <CategoryManagementPanel />
        </div>

        <!-- Reports Tab -->
        <div v-if="activeTab === 'reports'" class="tab-pane">
          <ReportsPanel />
        </div>

        <!-- Fraud Detection Tab -->
        <div v-if="activeTab === 'fraud'" class="tab-pane">
          <FraudDetectionPanel />
        </div>
      </div>
    </div>

    <!-- Recent Alerts -->
    <div class="alerts-section">
      <div class="section-header">
        <h2 class="section-title">Recent Alerts</h2>
        <button @click="markAllAlertsRead" class="btn-text">
          Mark all as read
        </button>
      </div>
      <div class="alerts-list">
        <div v-for="alert in recentAlerts" 
             :key="alert.id"
             class="alert-item"
             :class="`alert-${alert.severity}`">
          <div class="alert-icon">
            <component :is="alert.icon" class="w-5 h-5" />
          </div>
          <div class="alert-content">
            <p class="alert-text">{{ alert.message }}</p>
            <span class="alert-time">{{ alert.time }}</span>
          </div>
          <div class="alert-actions">
            <button @click="resolveAlert(alert.id)" class="alert-resolve">
              Resolve
            </button>
            <button @click="dismissAlert(alert.id)" class="alert-dismiss">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- System Status -->
    <div class="system-status">
      <div class="status-header">
        <h3 class="status-title">System Status</h3>
        <div class="status-indicator" :class="`status-${systemStatus}`">
          {{ systemStatus.toUpperCase() }}
        </div>
      </div>
      <div class="status-grid">
        <div class="status-item">
          <div class="status-label">API Server</div>
          <div class="status-value online">Online</div>
        </div>
        <div class="status-item">
          <div class="status-label">Database</div>
          <div class="status-value online">Synced</div>
        </div>
        <div class="status-item">
          <div class="status-label">Payments</div>
          <div class="status-value online">Active</div>
        </div>
        <div class="status-item">
          <div class="status-label">SMS Gateway</div>
          <div class="status-value warning">Delay</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  Shield, Users, Briefcase, TrendingUp, CheckCircle, 
  Download, RefreshCw, AlertTriangle, FileText, Settings,
  UserCheck, Filter, BarChart, ShieldAlert, Bell, Eye
} from 'lucide-vue-next'

// Import admin panel components
import WageManagementPanel from '../components/admin/WageManagementPanel.vue'
import UserManagementPanel from '../components/admin/UserManagementPanel.vue'
import CategoryManagementPanel from '../components/admin/CategoryManagementPanel.vue'
import ReportsPanel from '../components/admin/ReportsPanel.vue'
import FraudDetectionPanel from '../components/admin/FraudDetectionPanel.vue'

// State
const lastSyncTime = ref('2 minutes ago')
const activeTab = ref('wages')
const systemStatus = ref('healthy')

// Stats
const stats = ref({
  totalWorkers: 1250,
  verifiedWorkers: 1100,
  totalEmployers: 325,
  activeEmployers: 280,
  totalWages: 4850000,
  todayWages: 125000,
  pendingVerifications: 42,
  pendingJobs: 18
})

// District map areas
const districtAreas = ref([
  { name: 'City Center', activity: 'high', jobs: 45, top: 30, left: 40, width: 20, height: 20 },
  { name: 'Industrial Zone', activity: 'medium', jobs: 28, top: 50, left: 60, width: 15, height: 15 },
  { name: 'Residential North', activity: 'low', jobs: 12, top: 20, left: 20, width: 12, height: 12 },
  { name: 'Market Area', activity: 'high', jobs: 38, top: 40, left: 30, width: 18, height: 18 },
  { name: 'Rural South', activity: 'low', jobs: 8, top: 70, left: 25, width: 10, height: 10 }
])

// Admin Actions
const adminActions = ref([
  { icon: UserCheck, label: 'Verify Users', count: 15, handler: () => verifyUsers() },
  { icon: FileText, label: 'Generate Report', handler: () => generateReport() },
  { icon: Settings, label: 'Wage Settings', handler: () => activeTab.value = 'wages' },
  { icon: Filter, label: 'Review Categories', count: 8, handler: () => activeTab.value = 'categories' },
  { icon: BarChart, label: 'View Analytics', handler: () => viewAnalytics() },
  { icon: ShieldAlert, label: 'Fraud Check', count: 3, handler: () => activeTab.value = 'fraud' }
])

// Tabs
const tabs = ref([
  { id: 'wages', label: 'Wage Management', count: null },
  { id: 'users', label: 'User Management', count: 15 },
  { id: 'categories', label: 'Categories', count: 8 },
  { id: 'reports', label: 'Reports', count: null },
  { id: 'fraud', label: 'Fraud Detection', count: 3 }
])

// Recent Alerts
const recentAlerts = ref([
  { 
    id: 1, 
    severity: 'high',
    icon: AlertTriangle,
    message: 'Suspicious activity detected: Multiple accounts from same device',
    time: '10 minutes ago'
  },
  { 
    id: 2, 
    severity: 'medium',
    icon: Bell,
    message: 'Wage compliance check needed for Electrician category',
    time: '2 hours ago'
  },
  { 
    id: 3, 
    severity: 'low',
    icon: Eye,
    message: 'New custom category suggested: Tractor Repair',
    time: '1 day ago'
  }
])

// Methods
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

const exportData = () => {
  console.log('Exporting data...')
  // Implement data export
}

const syncNow = () => {
  lastSyncTime.value = 'Just now'
  console.log('Syncing data...')
}

const verifyUsers = () => {
  console.log('Opening user verification...')
  activeTab.value = 'users'
}

const generateReport = () => {
  console.log('Generating report...')
  activeTab.value = 'reports'
}

const viewAnalytics = () => {
  console.log('Opening analytics...')
  // Navigate to analytics
}

const markAllAlertsRead = () => {
  console.log('Marking all alerts as read...')
}

const resolveAlert = (alertId) => {
  recentAlerts.value = recentAlerts.value.filter(a => a.id !== alertId)
}

const dismissAlert = (alertId) => {
  recentAlerts.value = recentAlerts.value.filter(a => a.id !== alertId)
}

onMounted(() => {
  console.log('Admin dashboard loaded')
})
</script>

<style scoped>
.admin-dashboard {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  flex: 1;
}

.admin-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.district-info {
  color: #6b7280;
  font-size: 1rem;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-outline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid #3b82f6;
  background: white;
  color: #3b82f6;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #dbeafe;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

.last-sync {
  font-size: 0.875rem;
  color: #6b7280;
}

.live-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.live-stat-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.5rem;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.live-stat-card.critical {
  border-color: #ef4444;
  background: linear-gradient(to bottom right, #fef2f2, white);
}

.live-stat-card.warning {
  border-color: #f59e0b;
  background: linear-gradient(to bottom right, #fffbeb, white);
}

.live-stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e40af;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.stat-change.positive {
  background: #dcfce7;
  color: #166534;
}

.stat-change.negative {
  background: #fee2e2;
  color: #dc2626;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.25rem;
  line-height: 1;
}

.stat-label {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-detail {
  font-size: 0.875rem;
  color: #9ca3af;
}

.map-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.map-legend {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-dot.high {
  background: #ef4444;
}

.legend-dot.medium {
  background: #f59e0b;
}

.legend-dot.low {
  background: #10b981;
}

.map-container {
  height: 300px;
  background: #f8fafc;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
}

.district-map {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #f0f9ff, #e0f2fe);
}

.map-area {
  position: absolute;
  border: 2px solid;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.map-area:hover {
  transform: scale(1.05);
  z-index: 10;
}

.map-area.activity-high {
  background: rgba(239, 68, 68, 0.2);
  border-color: #ef4444;
}

.map-area.activity-medium {
  background: rgba(245, 158, 11, 0.2);
  border-color: #f59e0b;
}

.map-area.activity-low {
  background: rgba(16, 185, 129, 0.2);
  border-color: #10b981;
}

.area-label {
  font-weight: 600;
  font-size: 0.75rem;
  text-align: center;
  margin-bottom: 0.25rem;
}

.area-stats {
  font-size: 0.625rem;
  color: #6b7280;
}

.admin-actions-section {
  margin-bottom: 2rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.admin-action-btn {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.25rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.admin-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.action-icon {
  width: 24px;
  height: 24px;
  color: #3b82f6;
}

.action-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.action-count {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-weight: 600;
}

.admin-tabs {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  overflow: hidden;
  margin-bottom: 2rem;
}

.tabs-header {
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
}

.tab-btn {
  flex: 1;
  min-width: 150px;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-right: 1px solid #e5e7eb;
  cursor: pointer;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
}

.tab-btn:last-child {
  border-right: none;
}

.tab-btn:hover {
  background: #f1f5f9;
  color: #3b82f6;
}

.tab-btn.active {
  background: white;
  color: #3b82f6;
  border-bottom: 3px solid #3b82f6;
  margin-bottom: -1px;
}

.tab-count {
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-weight: 600;
}

.tabs-content {
  min-height: 400px;
}

.tab-pane {
  padding: 1.5rem;
}

.alerts-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.btn-text {
  color: #3b82f6;
  background: none;
  border: none;
  font-weight: 500;
  cursor: pointer;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border-left: 4px solid;
}

.alert-high {
  background: #fef2f2;
  border-left-color: #ef4444;
}

.alert-medium {
  background: #fffbeb;
  border-left-color: #f59e0b;
}

.alert-low {
  background: #f0f9ff;
  border-left-color: #3b82f6;
}

.alert-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-high .alert-icon {
  background: #fee2e2;
  color: #dc2626;
}

.alert-medium .alert-icon {
  background: #fef3c7;
  color: #d97706;
}

.alert-low .alert-icon {
  background: #dbeafe;
  color: #1e40af;
}

.alert-content {
  flex: 1;
}

.alert-text {
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #1f2937;
}

.alert-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
}

.alert-resolve {
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}

.alert-dismiss {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}

.system-status {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.5rem;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.status-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.status-indicator {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-healthy {
  background: #dcfce7;
  color: #166534;
}

.status-warning {
  background: #fef3c7;
  color: #92400e;
}

.status-error {
  background: #fee2e2;
  color: #dc2626;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.75rem;
}

.status-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.status-value {
  font-weight: 600;
  font-size: 0.875rem;
}

.status-value.online {
  color: #10b981;
}

.status-value.warning {
  color: #f59e0b;
}

.status-value.offline {
  color: #ef4444;
}
</style>
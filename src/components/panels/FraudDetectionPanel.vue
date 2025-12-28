<template>
  <div class="fraud-detection-panel">
    <!-- Fraud Overview -->
    <div class="fraud-overview">
      <div class="overview-header">
        <h3>Fraud Detection System</h3>
        <div class="system-status" :class="`status-${systemStatus}`">
          <div class="status-dot"></div>
          <span>{{ systemStatus.toUpperCase() }}</span>
        </div>
      </div>
      
      <div class="fraud-stats">
        <div class="stat-card">
          <div class="stat-value">{{ fraudStats.totalDetected }}</div>
          <div class="stat-label">Total Detected</div>
          <div class="stat-trend">+{{ fraudStats.lastMonth }} this month</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{{ fraudStats.activeAlerts }}</div>
          <div class="stat-label">Active Alerts</div>
          <div class="stat-trend">{{ fraudStats.pendingReview }} pending review</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">{{ fraudStats.blockedAccounts }}</div>
          <div class="stat-label">Blocked Accounts</div>
          <div class="stat-trend">{{ fraudStats.recentlyBlocked }} recent</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-value">₹{{ formatNumber(fraudStats.moneySaved) }}</div>
          <div class="stat-label">Money Saved</div>
          <div class="stat-trend">Estimated prevention</div>
        </div>
      </div>
    </div>

    <!-- Fraud Patterns -->
    <div class="fraud-patterns">
      <h4>Common Fraud Patterns</h4>
      <div class="patterns-grid">
        <div v-for="pattern in fraudPatterns" 
             :key="pattern.id"
             class="pattern-card"
             :class="`severity-${pattern.severity}`">
          <div class="pattern-header">
            <div class="pattern-icon">
              <AlertTriangle class="w-5 h-5" />
            </div>
            <div class="pattern-info">
              <div class="pattern-name">{{ pattern.name }}</div>
              <div class="pattern-count">{{ pattern.count }} detected</div>
            </div>
            <div class="pattern-severity">
              {{ pattern.severity }}
            </div>
          </div>
          <div class="pattern-description">
            {{ pattern.description }}
          </div>
          <div class="pattern-actions">
            <button @click="viewPatternDetails(pattern.id)" 
                    class="btn-outline">
              View Details
            </button>
            <button @click="addPatternRule(pattern.id)" 
                    class="btn-primary">
              Add Rule
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Alerts -->
    <div class="active-alerts">
      <div class="section-header">
        <h4>Active Fraud Alerts</h4>
        <button @click="runScan" class="btn-primary">
          <Search class="w-4 h-4" />
          Run Manual Scan
        </button>
      </div>
      
      <div class="alerts-table">
        <div class="table-header">
          <div class="table-cell">Alert ID</div>
          <div class="table-cell">Type</div>
          <div class="table-cell">User</div>
          <div class="table-cell">Details</div>
          <div class="table-cell">Confidence</div>
          <div class="table-cell">Detected</div>
          <div class="table-cell">Actions</div>
        </div>
        
        <div v-for="alert in activeAlerts" 
             :key="alert.id"
             class="table-row">
          <div class="table-cell alert-id">#{{ alert.id }}</div>
          <div class="table-cell">
            <div :class="`alert-type type-${alert.type}`">
              {{ alert.type }}
            </div>
          </div>
          <div class="table-cell">
            <div class="user-cell">
              <div class="user-avatar">{{ alert.userName.charAt(0) }}</div>
              <div class="user-info">
                <div class="user-name">{{ alert.userName }}</div>
                <div class="user-id">{{ alert.userId }}</div>
              </div>
            </div>
          </div>
          <div class="table-cell">
            <div class="alert-details">
              {{ alert.details }}
            </div>
          </div>
          <div class="table-cell">
            <div class="confidence-meter">
              <div class="confidence-bar" 
                   :style="{ width: `${alert.confidence}%` }"
                   :class="`confidence-${getConfidenceLevel(alert.confidence)}`">
              </div>
              <span class="confidence-value">{{ alert.confidence }}%</span>
            </div>
          </div>
          <div class="table-cell">
            <div class="alert-time">
              {{ formatTime(alert.detectedAt) }}
            </div>
          </div>
          <div class="table-cell">
            <div class="alert-actions">
              <button @click="investigateAlert(alert.id)" 
                      class="action-btn investigate">
                <Search class="w-4 h-4" />
              </button>
              <button @click="dismissAlert(alert.id)" 
                      class="action-btn dismiss">
                <X class="w-4 h-4" />
              </button>
              <button @click="blockUser(alert.userId)" 
                      class="action-btn block">
                <Ban class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fraud Rules -->
    <div class="fraud-rules">
      <div class="section-header">
        <h4>Detection Rules</h4>
        <button @click="addNewRule" class="btn-primary">
          <Plus class="w-4 h-4" />
          Add New Rule
        </button>
      </div>
      
      <div class="rules-list">
        <div v-for="rule in detectionRules" 
             :key="rule.id"
             class="rule-item">
          <div class="rule-header">
            <div class="rule-info">
              <div class="rule-name">{{ rule.name }}</div>
              <div class="rule-description">{{ rule.description }}</div>
            </div>
            <div class="rule-status">
              <label class="toggle-switch">
                <input type="checkbox" 
                       v-model="rule.enabled"
                       @change="toggleRule(rule.id)">
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="rule-meta">
            <div class="meta-item">
              <span class="meta-label">Type:</span>
              <span :class="`rule-type type-${rule.type}`">{{ rule.type }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Detections:</span>
              <span class="meta-value">{{ rule.detections }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Last triggered:</span>
              <span class="meta-value">{{ rule.lastTriggered }}</span>
            </div>
          </div>
          <div class="rule-actions">
            <button @click="editRule(rule.id)" class="btn-outline">
              Edit
            </button>
            <button @click="testRule(rule.id)" class="btn-outline">
              Test
            </button>
            <button @click="deleteRule(rule.id)" class="btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Suspicious Activity -->
    <div class="suspicious-activity">
      <h4>Recent Suspicious Activity</h4>
      <div class="activity-timeline">
        <div v-for="activity in suspiciousActivities" 
             :key="activity.id"
             class="activity-item">
          <div class="activity-time">{{ activity.time }}</div>
          <div class="activity-icon" :class="`severity-${activity.severity}`">
            <component :is="activity.icon" class="w-5 h-5" />
          </div>
          <div class="activity-content">
            <div class="activity-text">{{ activity.description }}</div>
            <div class="activity-user">{{ activity.userName }} • {{ activity.userId }}</div>
          </div>
          <button @click="investigateActivity(activity.id)" 
                  class="activity-action">
            Investigate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  AlertTriangle, Search, X, Ban, Plus,
  User, CreditCard, Smartphone, Globe, Shield
} from 'lucide-vue-next'

const systemStatus = ref('active')

const fraudStats = ref({
  totalDetected: 42,
  lastMonth: 8,
  activeAlerts: 12,
  pendingReview: 5,
  blockedAccounts: 18,
  recentlyBlocked: 3,
  moneySaved: 125000
})

const fraudPatterns = ref([
  {
    id: 1,
    name: 'Multiple Accounts',
    description: 'Same device creating multiple worker accounts',
    severity: 'high',
    count: 15
  },
  {
    id: 2,
    name: 'Fake Job Postings',
    description: 'Employer posting fake jobs to inflate ratings',
    severity: 'medium',
    count: 8
  },
  {
    id: 3,
    name: 'Self-Hiring',
    description: 'Worker and employer accounts linked to same person',
    severity: 'high',
    count: 6
  },
  {
    id: 4,
    name: 'Rapid Transactions',
    description: 'Unusually fast payment cycles',
    severity: 'low',
    count: 12
  }
])

const activeAlerts = ref([
  {
    id: 'F001',
    type: 'multiple_accounts',
    userName: 'John Doe',
    userId: 'W123',
    details: '3 accounts from same IP address',
    confidence: 85,
    detectedAt: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: 'F002',
    type: 'fake_jobs',
    userName: 'ABC Corp',
    userId: 'E456',
    details: '10 jobs posted, 0 hires',
    confidence: 72,
    detectedAt: new Date(Date.now() - 7200000) // 2 hours ago
  }
])

const detectionRules = ref([
  {
    id: 1,
    name: 'Multiple Device Detection',
    description: 'Detect multiple accounts from same device',
    type: 'device',
    enabled: true,
    detections: 24,
    lastTriggered: '2 hours ago'
  },
  {
    id: 2,
    name: 'Unusual Payment Pattern',
    description: 'Flag unusual payment frequencies',
    type: 'payment',
    enabled: true,
    detections: 12,
    lastTriggered: '1 day ago'
  },
  {
    id: 3,
    name: 'Geographic Anomaly',
    description: 'Detect location inconsistencies',
    type: 'location',
    enabled: false,
    detections: 8,
    lastTriggered: '3 days ago'
  }
])

const suspiciousActivities = ref([
  {
    id: 1,
    time: '10:30 AM',
    severity: 'high',
    icon: User,
    description: 'New account created with similar details',
    userName: 'Ramesh Kumar',
    userId: 'W789'
  },
  {
    id: 2,
    time: '09:15 AM',
    severity: 'medium',
    icon: CreditCard,
    description: 'Unusual payment pattern detected',
    userName: 'Suresh Singh',
    userId: 'W456'
  }
])

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const formatTime = (date) => {
  const hours = Math.floor((Date.now() - date.getTime()) / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours} hours ago`
  return `${Math.floor(hours / 24)} days ago`
}

const getConfidenceLevel = (confidence) => {
  if (confidence >= 80) return 'high'
  if (confidence >= 60) return 'medium'
  return 'low'
}

const runScan = () => {
  console.log('Running manual fraud scan...')
}

const investigateAlert = (alertId) => {
  console.log('Investigating alert:', alertId)
}

const dismissAlert = (alertId) => {
  activeAlerts.value = activeAlerts.value.filter(a => a.id !== alertId)
}

const blockUser = (userId) => {
  console.log('Blocking user:', userId)
}

const viewPatternDetails = (patternId) => {
  console.log('Viewing pattern details:', patternId)
}

const addPatternRule = (patternId) => {
  console.log('Adding rule for pattern:', patternId)
}

const toggleRule = (ruleId) => {
  console.log('Toggling rule:', ruleId)
}

const addNewRule = () => {
  console.log('Adding new rule...')
}

const editRule = (ruleId) => {
  console.log('Editing rule:', ruleId)
}

const testRule = (ruleId) => {
  console.log('Testing rule:', ruleId)
}

const deleteRule = (ruleId) => {
  detectionRules.value = detectionRules.value.filter(r => r.id !== ruleId)
}

const investigateActivity = (activityId) => {
  console.log('Investigating activity:', activityId)
}
</script>

<style scoped>
.fraud-detection-panel {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.overview-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-warning {
  background: #fef3c7;
  color: #92400e;
}

.status-inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-active .status-dot {
  background: #10b981;
}

.status-warning .status-dot {
  background: #f59e0b;
}

.status-inactive .status-dot {
  background: #6b7280;
}

.fraud-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-trend {
  font-size: 0.75rem;
  color: #9ca3af;
}

.fraud-patterns {
  margin-bottom: 2rem;
}

.fraud-patterns h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.pattern-card {
  border: 2px solid;
  border-radius: 1rem;
  padding: 1.5rem;
}

.pattern-card.severity-high {
  border-color: #ef4444;
  background: linear-gradient(to bottom right, #fef2f2, white);
}

.pattern-card.severity-medium {
  border-color: #f59e0b;
  background: linear-gradient(to bottom right, #fffbeb, white);
}

.pattern-card.severity-low {
  border-color: #3b82f6;
  background: linear-gradient(to bottom right, #eff6ff, white);
}

.pattern-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.pattern-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.severity-high .pattern-icon {
  background: #fee2e2;
  color: #dc2626;
}

.severity-medium .pattern-icon {
  background: #fef3c7;
  color: #d97706;
}

.severity-low .pattern-icon {
  background: #dbeafe;
  color: #1e40af;
}

.pattern-info {
  flex: 1;
}

.pattern-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.pattern-count {
  font-size: 0.875rem;
  color: #6b7280;
}

.pattern-severity {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.severity-high .pattern-severity {
  background: #fee2e2;
  color: #dc2626;
}

.severity-medium .pattern-severity {
  background: #fef3c7;
  color: #92400e;
}

.severity-low .pattern-severity {
  background: #dbeafe;
  color: #1e40af;
}

.pattern-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.pattern-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-primary, .btn-outline, .btn-danger {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  border: none;
}

.btn-outline {
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
}

.active-alerts {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.alerts-table {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 3fr 1fr 1fr auto;
  background: #f8fafc;
  padding: 1rem;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 2px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr 3fr 1fr 1fr auto;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
}

.table-row:hover {
  background: #f9fafb;
}

.table-cell {
  padding: 0 0.5rem;
}

.alert-id {
  font-weight: 600;
  color: #3b82f6;
}

.alert-type {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.type-multiple_accounts {
  background: #fee2e2;
  color: #dc2626;
}

.type-fake_jobs {
  background: #fef3c7;
  color: #92400e;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.user-id {
  font-size: 0.75rem;
  color: #6b7280;
}

.alert-details {
  font-size: 0.875rem;
  color: #6b7280;
}

.confidence-meter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.confidence-bar {
  height: 8px;
  border-radius: 4px;
  flex: 1;
}

.confidence-high {
  background: #10b981;
}

.confidence-medium {
  background: #f59e0b;
}

.confidence-low {
  background: #ef4444;
}

.confidence-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  min-width: 40px;
}

.alert-time {
  font-size: 0.875rem;
  color: #6b7280;
}

.alert-actions {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.investigate {
  color: #3b82f6;
}

.action-btn.investigate:hover {
  background: #dbeafe;
}

.action-btn.dismiss {
  color: #6b7280;
}

.action-btn.dismiss:hover {
  background: #f3f4f6;
}

.action-btn.block {
  color: #ef4444;
}

.action-btn.block:hover {
  background: #fee2e2;
}

.fraud-rules {
  margin-bottom: 2rem;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rule-item {
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
}

.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.rule-info {
  flex: 1;
}

.rule-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.rule-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #10b981;
}

input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.rule-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.meta-label {
  color: #6b7280;
}

.meta-value {
  color: #1f2937;
  font-weight: 500;
}

.rule-type {
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-device {
  background: #dbeafe;
  color: #1e40af;
}

.type-payment {
  background: #dcfce7;
  color: #166534;
}

.type-location {
  background: #fef3c7;
  color: #92400e;
}

.rule-actions {
  display: flex;
  gap: 0.5rem;
}

.suspicious-activity h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.activity-timeline {
  border-left: 2px solid #e5e7eb;
  margin-left: 1rem;
  padding-left: 2rem;
}

.activity-item {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  position: relative;
}

.activity-item:before {
  content: '';
  position: absolute;
  left: -2.25rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: white;
  border: 2px solid;
}

.activity-item.severity-high:before {
  border-color: #ef4444;
}

.activity-item.severity-medium:before {
  border-color: #f59e0b;
}

.activity-item.severity-low:before {
  border-color: #3b82f6;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
  min-width: 60px;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-icon.severity-high {
  background: #fee2e2;
  color: #dc2626;
}

.activity-icon.severity-medium {
  background: #fef3c7;
  color: #d97706;
}

.activity-icon.severity-low {
  background: #dbeafe;
  color: #1e40af;
}

.activity-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.activity-text {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.activity-user {
  font-size: 0.75rem;
  color: #6b7280;
}

.activity-action {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.875rem;
}
</style>
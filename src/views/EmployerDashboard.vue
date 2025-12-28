<template>
  <div class="employer-dashboard">
    <!-- Header with Stats -->
    <div class="dashboard-header">
      <div class="header-content">
        <h1 class="greeting">Welcome back, {{ businessName }}!</h1>
        <p class="subtitle">Here's what's happening with your business</p>
      </div>
      <div class="header-actions">
        <button @click="router.push('/subscription')" class="subscription-btn">
          <Crown class="w-4 h-4" />
          <span>{{ subscriptionPlan }}</span>
        </button>
        <button @click="showNewJobModal = true" class="primary-btn">
          <Plus class="w-4 h-4" />
          <span>Post New Job</span>
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon total-jobs">
            <Briefcase class="w-5 h-5" />
          </div>
          <TrendingUp class="w-5 h-5 text-green-500" />
        </div>
        <div class="stat-value">{{ stats.totalJobs }}</div>
        <div class="stat-label">Total Jobs Posted</div>
        <div class="stat-trend">+12% from last month</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon active-workers">
            <Users class="w-5 h-5" />
          </div>
          <TrendingUp class="w-5 h-5 text-green-500" />
        </div>
        <div class="stat-value">{{ stats.activeWorkers }}</div>
        <div class="stat-label">Active Workers</div>
        <div class="stat-trend">+5 new this week</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon total-spent">
            <Wallet class="w-5 h-5" />
          </div>
          <TrendingUp class="w-5 h-5 text-green-500" />
        </div>
        <div class="stat-value">₹{{ formatNumber(stats.totalSpent) }}</div>
        <div class="stat-label">Total Spent</div>
        <div class="stat-trend">₹{{ formatNumber(stats.thisMonthSpent) }} this month</div>
      </div>

      <div class="stat-card">
        <div class="stat-header">
          <div class="stat-icon rating">
            <Star class="w-5 h-5" />
          </div>
          <TrendingUp class="w-5 h-5 text-green-500" />
        </div>
        <div class="stat-value">{{ stats.rating }}/5</div>
        <div class="stat-label">Average Rating</div>
        <div class="stat-trend">Based on {{ stats.totalReviews }} reviews</div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions-section">
      <h2 class="section-title">Quick Actions</h2>
      <div class="quick-actions-grid">
        <button v-for="action in quickActions" 
                :key="action.label"
                @click="action.handler"
                class="quick-action-btn">
          <component :is="action.icon" class="action-icon" />
          <span class="action-label">{{ action.label }}</span>
          <span v-if="action.badge" class="action-badge">{{ action.badge }}</span>
        </button>
      </div>
    </div>

    <!-- Recent Jobs & Applications -->
    <div class="dashboard-sections">
      <!-- Recent Jobs -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Recent Jobs</h2>
          <button @click="router.push('/jobs')" class="view-all-btn">
            View All
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <div class="jobs-table">
          <div class="table-header">
            <div class="table-cell">Job Title</div>
            <div class="table-cell">Category</div>
            <div class="table-cell">Applications</div>
            <div class="table-cell">Status</div>
            <div class="table-cell">Actions</div>
          </div>
          <div v-for="job in recentJobs" 
               :key="job.id"
               class="table-row">
            <div class="table-cell">
              <div class="job-title-cell">
                <div class="job-title">{{ job.title }}</div>
                <div class="job-date">Posted {{ job.postedDate }}</div>
              </div>
            </div>
            <div class="table-cell">
              <div class="category-tag">{{ job.category }}</div>
            </div>
            <div class="table-cell">
              <div class="applications-count">
                <Users class="w-4 h-4" />
                <span>{{ job.applications }}</span>
              </div>
            </div>
            <div class="table-cell">
              <div :class="`status-badge status-${job.status}`">
                {{ job.status }}
              </div>
            </div>
            <div class="table-cell">
              <div class="action-buttons">
                <button @click="viewJob(job.id)" class="action-btn view">
                  <Eye class="w-4 h-4" />
                </button>
                <button v-if="job.status === 'open'" 
                        @click="closeJob(job.id)"
                        class="action-btn close">
                  <X class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Applications -->
      <div class="section">
        <div class="section-header">
          <h2 class="section-title">Recent Applications</h2>
          <button @click="router.push('/applications')" class="view-all-btn">
            View All
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
        <div class="applications-list">
          <div v-for="application in recentApplications" 
               :key="application.id"
               class="application-card">
            <div class="application-header">
              <div class="worker-info">
                <div class="worker-avatar">
                  {{ application.workerName.charAt(0) }}
                </div>
                <div class="worker-details">
                  <div class="worker-name">{{ application.workerName }}</div>
                  <div class="worker-rating">
                    <Star class="w-3 h-3 fill-current" />
                    <span>{{ application.rating }}</span>
                  </div>
                </div>
              </div>
              <div class="application-time">{{ application.time }}</div>
            </div>
            <div class="application-body">
              <div class="job-applied">Applied for: {{ application.jobTitle }}</div>
              <div class="application-message">{{ application.message }}</div>
            </div>
            <div class="application-footer">
              <div class="application-status">
                <div :class="`status-dot status-${application.status}`"></div>
                <span>{{ application.status }}</span>
              </div>
              <div class="application-actions">
                <button @click="viewWorker(application.workerId)" 
                        class="btn-outline">
                  View Profile
                </button>
                <button @click="acceptApplication(application.id)" 
                        class="btn-primary"
                        v-if="application.status === 'pending'">
                  Accept
                </button>
                <button @click="rejectApplication(application.id)" 
                        class="btn-danger"
                        v-if="application.status === 'pending'">
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analytics Preview -->
    <div class="analytics-section">
      <div class="section-header">
        <h2 class="section-title">Analytics Overview</h2>
        <button @click="router.push('/analytics')" class="view-all-btn">
          Detailed Analytics
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
      <div class="analytics-grid">
        <div class="analytics-card">
          <h3 class="analytics-title">Hires This Month</h3>
          <div class="analytics-chart">
            <!-- Simple bar chart using CSS -->
            <div class="chart-bars">
              <div v-for="day in 7" 
                   :key="day"
                   class="chart-bar"
                   :style="{ height: `${Math.random() * 100}%` }">
                <div class="chart-bar-fill"></div>
              </div>
            </div>
            <div class="chart-labels">
              <span v-for="label in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" 
                    :key="label">
                {{ label }}
              </span>
            </div>
          </div>
        </div>
        <div class="analytics-card">
          <h3 class="analytics-title">Top Categories</h3>
          <div class="categories-list">
            <div v-for="category in topCategories" 
                 :key="category.name"
                 class="category-item">
              <div class="category-info">
                <div class="category-name">{{ category.name }}</div>
                <div class="category-count">{{ category.count }} hires</div>
              </div>
              <div class="category-bar">
                <div class="category-bar-fill" 
                     :style="{ width: `${category.percentage}%` }">
                </div>
              </div>
              <div class="category-percentage">{{ category.percentage }}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bulk Hiring CTA -->
    <div class="bulk-hiring-cta">
      <div class="cta-content">
        <div class="cta-icon">👥</div>
        <div class="cta-text">
          <h3>Need multiple workers?</h3>
          <p>Use our bulk hiring feature to save time and get volume discounts</p>
        </div>
        <button @click="showBulkHiringModal = true" class="cta-btn">
          Start Bulk Hiring
        </button>
      </div>
    </div>

    <!-- Subscription Reminder -->
    <div v-if="showSubscriptionReminder" class="subscription-reminder">
      <div class="reminder-content">
        <div class="reminder-icon">👑</div>
        <div class="reminder-text">
          <h4>Upgrade to Enterprise Plan</h4>
          <p>Get ₹4,000 commission credits and bulk hiring tools</p>
        </div>
        <div class="reminder-actions">
          <button @click="showSubscriptionReminder = false" class="reminder-close">
            <X class="w-4 h-4" />
          </button>
          <button @click="router.push('/subscription/upgrade')" class="reminder-upgrade">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <NewJobModal v-if="showNewJobModal" @close="showNewJobModal = false" />
    <BulkHiringModal v-if="showBulkHiringModal" @close="showBulkHiringModal = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Plus, Briefcase, Users, Wallet, Star, TrendingUp, ChevronRight,
  Eye, X, Crown, FileText, MessageSquare, CreditCard, BarChart,
  Calendar, Clock, MapPin, User, Check, XCircle
} from 'lucide-vue-next'

const router = useRouter()

// State
const businessName = ref('ABC Enterprises')
const subscriptionPlan = ref('Pro Plan')
const showNewJobModal = ref(false)
const showBulkHiringModal = ref(false)
const showSubscriptionReminder = ref(true)

// Stats
const stats = ref({
  totalJobs: 24,
  activeWorkers: 8,
  totalSpent: 45250,
  thisMonthSpent: 12500,
  rating: 4.7,
  totalReviews: 42
})

// Quick Actions
const quickActions = ref([
  { icon: Briefcase, label: 'Post Job', handler: () => showNewJobModal.value = true },
  { icon: Users, label: 'Find Workers', handler: () => router.push('/workers'), badge: '12' },
  { icon: FileText, label: 'Invoices', handler: () => router.push('/invoices') },
  { icon: MessageSquare, label: 'Messages', handler: () => router.push('/messages'), badge: '3' },
  { icon: CreditCard, label: 'Add Funds', handler: () => router.push('/wallet/add') },
  { icon: BarChart, label: 'Analytics', handler: () => router.push('/analytics') }
])

// Recent Jobs
const recentJobs = ref([
  {
    id: 1,
    title: 'Electrician for Office Wiring',
    category: 'Electrician',
    applications: 5,
    status: 'open',
    postedDate: '2 days ago'
  },
  {
    id: 2,
    title: 'Plumber for Bathroom Repair',
    category: 'Plumber',
    applications: 3,
    status: 'filled',
    postedDate: '1 week ago'
  },
  {
    id: 3,
    title: 'Carpenter for Furniture',
    category: 'Carpenter',
    applications: 8,
    status: 'open',
    postedDate: '3 days ago'
  }
])

// Recent Applications
const recentApplications = ref([
  {
    id: 1,
    workerId: 101,
    workerName: 'Ramesh Kumar',
    rating: 4.8,
    jobTitle: 'Electrician for Office Wiring',
    message: 'I have 5 years experience in commercial wiring',
    status: 'pending',
    time: '2 hours ago'
  },
  {
    id: 2,
    workerId: 102,
    workerName: 'Suresh Singh',
    rating: 4.5,
    jobTitle: 'Plumber for Bathroom Repair',
    message: 'Available immediately, can fix all types of leaks',
    status: 'accepted',
    time: '1 day ago'
  }
])

// Top Categories
const topCategories = ref([
  { name: 'Electrician', count: 12, percentage: 35 },
  { name: 'Plumber', count: 8, percentage: 23 },
  { name: 'Carpenter', count: 6, percentage: 18 },
  { name: 'Driver', count: 4, percentage: 12 }
])

// Methods
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const viewJob = (jobId) => {
  router.push(`/job/${jobId}`)
}

const closeJob = (jobId) => {
  const job = recentJobs.value.find(j => j.id === jobId)
  if (job) {
    job.status = 'closed'
  }
}

const viewWorker = (workerId) => {
  router.push(`/worker/${workerId}`)
}

const acceptApplication = (applicationId) => {
  const app = recentApplications.value.find(a => a.id === applicationId)
  if (app) {
    app.status = 'accepted'
  }
}

const rejectApplication = (applicationId) => {
  const app = recentApplications.value.find(a => a.id === applicationId)
  if (app) {
    app.status = 'rejected'
  }
}

onMounted(() => {
  console.log('Employer dashboard loaded')
})
</script>

<style scoped>
.employer-dashboard {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content .greeting {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.subscription-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.subscription-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);
}

.primary-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.5rem;
  transition: all 0.3s;
}

.stat-card:hover {
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.total-jobs {
  background: linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
  color: #1e40af;
}

.stat-icon.active-workers {
  background: linear-gradient(135deg, #dcfce7 0%, #86efac 100%);
  color: #166534;
}

.stat-icon.total-spent {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.stat-icon.rating {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
  color: #9d174d;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.stat-trend {
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 500;
}

.quick-actions-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.quick-action-btn {
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

.quick-action-btn:hover {
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

.action-badge {
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

.dashboard-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #3b82f6;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
}

.jobs-table {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  background: #f8fafc;
  padding: 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f9fafb;
}

.table-row:last-child {
  border-bottom: none;
}

.table-cell {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
}

.job-title-cell .job-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.job-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.category-tag {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.applications-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-open {
  background: #dcfce7;
  color: #166534;
}

.status-filled {
  background: #dbeafe;
  color: #1e40af;
}

.status-closed {
  background: #f3f4f6;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.view {
  color: #3b82f6;
}

.action-btn.view:hover {
  background: #dbeafe;
  border-color: #3b82f6;
}

.action-btn.close {
  color: #ef4444;
}

.action-btn.close:hover {
  background: #fee2e2;
  border-color: #ef4444;
}

.applications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.application-card {
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.25rem;
  transition: all 0.2s;
}

.application-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.worker-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.worker-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
}

.worker-details .worker-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.worker-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #f59e0b;
}

.application-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.application-body {
  margin-bottom: 1rem;
}

.job-applied {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.application-message {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.application-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.application-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-pending {
  background: #fbbf24;
}

.status-accepted {
  background: #10b981;
}

.status-rejected {
  background: #ef4444;
}

.application-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-outline {
  padding: 0.5rem 1rem;
  border: 1px solid #3b82f6;
  color: #3b82f6;
  background: white;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: #dbeafe;
}

.btn-primary {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-danger {
  padding: 0.5rem 1rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover {
  background: #dc2626;
}

.analytics-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.analytics-card {
  padding: 1rem;
}

.analytics-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.analytics-chart {
  padding: 1rem 0;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  height: 200px;
  gap: 0.5rem;
  padding: 0 1rem;
  margin-bottom: 0.5rem;
}

.chart-bar {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.chart-bar-fill {
  width: 100%;
  background: linear-gradient(to top, #3b82f6, #8b5cf6);
  border-radius: 0.25rem 0.25rem 0 0;
  transition: height 0.3s;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 1rem;
}

.category-info {
  min-width: 120px;
}

.category-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.category-count {
  font-size: 0.75rem;
  color: #6b7280;
}

.category-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.category-bar-fill {
  height: 100%;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

.category-percentage {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
  color: #1f2937;
}

.bulk-hiring-cta {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  border-radius: 1.25rem;
  padding: 2rem;
  color: white;
  margin-bottom: 2rem;
}

.cta-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.cta-icon {
  font-size: 3rem;
}

.cta-text h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.cta-text p {
  opacity: 0.9;
  margin: 0;
}

.cta-btn {
  margin-left: auto;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #1e40af;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 255, 255, 0.2);
}

.subscription-reminder {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 1rem;
  padding: 1.25rem;
  color: #92400e;
}

.reminder-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reminder-icon {
  font-size: 2rem;
}

.reminder-text {
  flex: 1;
}

.reminder-text h4 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.reminder-text p {
  margin: 0;
  opacity: 0.9;
}

.reminder-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reminder-close {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #92400e;
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reminder-upgrade {
  padding: 0.5rem 1.5rem;
  background: #92400e;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reminder-upgrade:hover {
  background: #78350f;
}
</style>
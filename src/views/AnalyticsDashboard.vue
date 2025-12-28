<template>
  <div class="analytics-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-left">
        <h1 class="page-title">Analytics Dashboard</h1>
        <p class="page-subtitle">Platform performance insights and metrics</p>
      </div>
      <div class="header-right">
        <div class="date-range-selector">
          <button 
            v-for="range in dateRanges" 
            :key="range.value"
            @click="selectedRange = range.value"
            :class="['range-btn', { active: selectedRange === range.value }]"
          >
            {{ range.label }}
          </button>
        </div>
        <button @click="exportAnalytics" class="export-btn">
          <Download class="w-4 h-4" />
          Export Report
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="key-metrics">
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon bg-blue-100">
            <Users class="w-6 h-6 text-blue-600" />
          </div>
          <div class="metric-trend positive">
            <TrendingUp class="w-4 h-4" />
            <span>+12.5%</span>
          </div>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ formatNumber(metrics.totalUsers) }}</div>
          <div class="metric-label">Total Users</div>
          <div class="metric-detail">
            <span class="workers">{{ formatNumber(metrics.workers) }} Workers</span>
            <span class="employers">{{ formatNumber(metrics.employers) }} Employers</span>
          </div>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon bg-green-100">
            <Briefcase class="w-6 h-6 text-green-600" />
          </div>
          <div class="metric-trend positive">
            <TrendingUp class="w-4 h-4" />
            <span>+8.2%</span>
          </div>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ formatNumber(metrics.activeJobs) }}</div>
          <div class="metric-label">Active Jobs</div>
          <div class="metric-detail">
            <span class="success-rate">{{ metrics.jobSuccessRate }}% Success Rate</span>
          </div>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon bg-purple-100">
            <DollarSign class="w-6 h-6 text-purple-600" />
          </div>
          <div class="metric-trend positive">
            <TrendingUp class="w-4 h-4" />
            <span>+15.3%</span>
          </div>
        </div>
        <div class="metric-content">
          <div class="metric-value">₹{{ formatNumber(metrics.totalRevenue) }}</div>
          <div class="metric-label">Total Revenue</div>
          <div class="metric-detail">
            <span class="avg-transaction">Avg: ₹{{ formatNumber(metrics.avgTransaction) }}</span>
          </div>
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-icon bg-orange-100">
            <Clock class="w-6 h-6 text-orange-600" />
          </div>
          <div class="metric-trend negative">
            <TrendingDown class="w-4 h-4" />
            <span>-3.2%</span>
          </div>
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ metrics.avgResponseTime }}h</div>
          <div class="metric-label">Avg. Response Time</div>
          <div class="metric-detail">
            <span class="satisfaction">{{ metrics.satisfactionRate }}% Satisfaction</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- User Growth Chart -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>User Growth</h3>
          <select v-model="userChartType" class="chart-type-select">
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <LineChart class="w-16 h-16 text-gray-400" />
            <span>User Growth Chart</span>
            <div class="chart-stats">
              <div class="stat-item">
                <span class="stat-label">Total Growth</span>
                <span class="stat-value positive">+{{ userGrowth.total }}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Monthly Active</span>
                <span class="stat-value">{{ formatNumber(userGrowth.monthlyActive) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Job Categories Distribution -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Job Categories</h3>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <PieChart class="w-16 h-16 text-gray-400" />
            <span>Job Categories Distribution</span>
            <div class="category-list">
              <div v-for="category in jobCategories" :key="category.name" class="category-item">
                <div class="category-color" :style="{ backgroundColor: category.color }"></div>
                <span class="category-name">{{ category.name }}</span>
                <span class="category-percentage">{{ category.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revenue Trend -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Revenue Trend</h3>
          <select v-model="revenueChartType" class="chart-type-select">
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
          </select>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <TrendingUp class="w-16 h-16 text-gray-400" />
            <span>Revenue Trend Chart</span>
            <div class="chart-stats">
              <div class="stat-item">
                <span class="stat-label">This Month</span>
                <span class="stat-value">₹{{ formatNumber(revenueTrend.currentMonth) }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">vs Last Month</span>
                <span class="stat-value positive">+{{ revenueTrend.growth }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Platform Performance -->
      <div class="chart-card">
        <div class="chart-header">
          <h3>Platform Performance</h3>
        </div>
        <div class="chart-container">
          <div class="chart-placeholder">
            <BarChart3 class="w-16 h-16 text-gray-400" />
            <span>Performance Metrics</span>
            <div class="performance-metrics">
              <div class="metric-item">
                <span class="metric-label">Uptime</span>
                <div class="metric-bar">
                  <div class="bar-fill" :style="{ width: performance.uptime + '%' }"></div>
                </div>
                <span class="metric-value">{{ performance.uptime }}%</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Response Time</span>
                <div class="metric-bar">
                  <div class="bar-fill good" :style="{ width: performance.responseScore + '%' }"></div>
                </div>
                <span class="metric-value">{{ performance.responseTime }}ms</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Error Rate</span>
                <div class="metric-bar">
                  <div class="bar-fill warning" :style="{ width: performance.errorRate + '%' }"></div>
                </div>
                <span class="metric-value">{{ performance.errorRate }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Analytics -->
    <div class="detailed-analytics">
      <!-- User Demographics -->
      <div class="analytics-card">
        <div class="card-header">
          <h3>User Demographics</h3>
          <button @click="toggleUserDemographics" class="expand-btn">
            <ChevronDown v-if="!showUserDemographics" class="w-4 h-4" />
            <ChevronUp v-else class="w-4 h-4" />
          </button>
        </div>
        
        <div v-if="showUserDemographics" class="card-content">
          <div class="demographics-grid">
            <div class="demographic-item">
              <div class="demographic-label">Age Distribution</div>
              <div class="demographic-chart">
                <div class="age-group">
                  <span class="age-range">18-25</span>
                  <div class="age-bar">
                    <div class="bar-fill" style="width: 35%"></div>
                  </div>
                  <span class="age-percentage">35%</span>
                </div>
                <div class="age-group">
                  <span class="age-range">26-35</span>
                  <div class="age-bar">
                    <div class="bar-fill" style="width: 45%"></div>
                  </div>
                  <span class="age-percentage">45%</span>
                </div>
                <div class="age-group">
                  <span class="age-range">36-45</span>
                  <div class="age-bar">
                    <div class="bar-fill" style="width: 15%"></div>
                  </div>
                  <span class="age-percentage">15%</span>
                </div>
                <div class="age-group">
                  <span class="age-range">45+</span>
                  <div class="age-bar">
                    <div class="bar-fill" style="width: 5%"></div>
                  </div>
                  <span class="age-percentage">5%</span>
                </div>
              </div>
            </div>
            
            <div class="demographic-item">
              <div class="demographic-label">Gender Distribution</div>
              <div class="gender-distribution">
                <div class="gender-item">
                  <User class="w-4 h-4 text-blue-500" />
                  <span class="gender-label">Male</span>
                  <span class="gender-percentage">72%</span>
                </div>
                <div class="gender-item">
                  <User class="w-4 h-4 text-pink-500" />
                  <span class="gender-label">Female</span>
                  <span class="gender-percentage">28%</span>
                </div>
              </div>
            </div>
            
            <div class="demographic-item">
              <div class="demographic-label">Top Locations</div>
              <div class="locations-list">
                <div v-for="location in topLocations" :key="location.city" class="location-item">
                  <MapPin class="w-4 h-4 text-gray-400" />
                  <span class="location-city">{{ location.city }}</span>
                  <span class="location-users">{{ formatNumber(location.users) }} users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Platform Activity -->
      <div class="analytics-card">
        <div class="card-header">
          <h3>Platform Activity</h3>
          <button @click="togglePlatformActivity" class="expand-btn">
            <ChevronDown v-if="!showPlatformActivity" class="w-4 h-4" />
            <ChevronUp v-else class="w-4 h-4" />
          </button>
        </div>
        
        <div v-if="showPlatformActivity" class="card-content">
          <div class="activity-stats">
            <div class="activity-item">
              <div class="activity-icon bg-blue-100">
                <MessageSquare class="w-5 h-5 text-blue-600" />
              </div>
              <div class="activity-info">
                <div class="activity-value">{{ formatNumber(activity.messages) }}</div>
                <div class="activity-label">Messages Sent</div>
              </div>
            </div>
            
            <div class="activity-item">
              <div class="activity-icon bg-green-100">
                <FileText class="w-5 h-5 text-green-600" />
              </div>
              <div class="activity-info">
                <div class="activity-value">{{ formatNumber(activity.applications) }}</div>
                <div class="activity-label">Job Applications</div>
              </div>
            </div>
            
            <div class="activity-item">
              <div class="activity-icon bg-purple-100">
                <CheckCircle class="w-5 h-5 text-purple-600" />
              </div>
              <div class="activity-info">
                <div class="activity-value">{{ formatNumber(activity.completedJobs) }}</div>
                <div class="activity-label">Jobs Completed</div>
              </div>
            </div>
            
            <div class="activity-item">
              <div class="activity-icon bg-orange-100">
                <Star class="w-5 h-5 text-orange-600" />
              </div>
              <div class="activity-info">
                <div class="activity-value">{{ activity.avgRating.toFixed(1) }}</div>
                <div class="activity-label">Avg. Rating</div>
              </div>
            </div>
          </div>
          
          <div class="activity-timeline">
            <div class="timeline-header">
              <h4>Recent Activity Timeline</h4>
            </div>
            <div class="timeline-items">
              <div v-for="item in recentActivity" :key="item.id" class="timeline-item">
                <div class="timeline-icon" :class="`bg-${item.color}-100`">
                  <component :is="item.icon" class="w-4 h-4" :class="`text-${item.color}-600`" />
                </div>
                <div class="timeline-content">
                  <div class="timeline-text">{{ item.text }}</div>
                  <div class="timeline-time">{{ item.time }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Comparison -->
    <div class="comparison-section">
      <div class="section-header">
        <h2>Performance Comparison</h2>
        <select v-model="comparisonPeriod" class="comparison-select">
          <option value="month">Month-over-Month</option>
          <option value="quarter">Quarter-over-Quarter</option>
          <option value="year">Year-over-Year</option>
        </select>
      </div>
      
      <div class="comparison-grid">
        <div class="comparison-card">
          <div class="comparison-header">
            <h4>User Growth</h4>
            <div class="comparison-trend positive">
              <TrendingUp class="w-4 h-4" />
              <span>+{{ comparison.userGrowth }}%</span>
            </div>
          </div>
          <div class="comparison-values">
            <div class="current-value">{{ formatNumber(comparison.currentUsers) }}</div>
            <div class="previous-value">vs {{ formatNumber(comparison.previousUsers) }}</div>
          </div>
        </div>
        
        <div class="comparison-card">
          <div class="comparison-header">
            <h4>Revenue</h4>
            <div class="comparison-trend positive">
              <TrendingUp class="w-4 h-4" />
              <span>+{{ comparison.revenueGrowth }}%</span>
            </div>
          </div>
          <div class="comparison-values">
            <div class="current-value">₹{{ formatNumber(comparison.currentRevenue) }}</div>
            <div class="previous-value">vs ₹{{ formatNumber(comparison.previousRevenue) }}</div>
          </div>
        </div>
        
        <div class="comparison-card">
          <div class="comparison-header">
            <h4>Job Postings</h4>
            <div class="comparison-trend positive">
              <TrendingUp class="w-4 h-4" />
              <span>+{{ comparison.jobGrowth }}%</span>
            </div>
          </div>
          <div class="comparison-values">
            <div class="current-value">{{ formatNumber(comparison.currentJobs) }}</div>
            <div class="previous-value">vs {{ formatNumber(comparison.previousJobs) }}</div>
          </div>
        </div>
        
        <div class="comparison-card">
          <div class="comparison-header">
            <h4>Engagement Rate</h4>
            <div class="comparison-trend negative">
              <TrendingDown class="w-4 h-4" />
              <span>-{{ comparison.engagementChange }}%</span>
            </div>
          </div>
          <div class="comparison-values">
            <div class="current-value">{{ comparison.currentEngagement }}%</div>
            <div class="previous-value">vs {{ comparison.previousEngagement }}%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Users,
  Briefcase,
  DollarSign,
  Clock,
  Download,
  TrendingUp,
  TrendingDown,
  LineChart,
  PieChart,
  BarChart3,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  FileText,
  CheckCircle,
  Star,
  User,
  MapPin
} from 'lucide-vue-next'

// State
const selectedRange = ref('30d')
const userChartType = ref('line')
const revenueChartType = ref('line')
const showUserDemographics = ref(true)
const showPlatformActivity = ref(true)
const comparisonPeriod = ref('month')
const loading = ref(false)

// Date Ranges
const dateRanges = ref([
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: 'all' }
])

// Metrics Data
const metrics = ref({
  totalUsers: 1250,
  workers: 980,
  employers: 270,
  activeJobs: 87,
  jobSuccessRate: 92,
  totalRevenue: 254300,
  avgTransaction: 12500,
  avgResponseTime: 2.5,
  satisfactionRate: 94
})

// User Growth
const userGrowth = ref({
  total: 12.5,
  monthlyActive: 850,
  weeklyActive: 420,
  dailyActive: 180
})

// Job Categories
const jobCategories = ref([
  { name: 'Construction', percentage: 35, color: '#3b82f6' },
  { name: 'Manufacturing', percentage: 25, color: '#10b981' },
  { name: 'Domestic Help', percentage: 20, color: '#8b5cf6' },
  { name: 'Driving', percentage: 12, color: '#f59e0b' },
  { name: 'Security', percentage: 8, color: '#ef4444' }
])

// Revenue Trend
const revenueTrend = ref({
  currentMonth: 125000,
  previousMonth: 108000,
  growth: 15.7,
  trend: 'up'
})

// Platform Performance
const performance = ref({
  uptime: 99.8,
  responseTime: 120,
  responseScore: 95,
  errorRate: 0.2
})

// Top Locations
const topLocations = ref([
  { city: 'Delhi', users: 320 },
  { city: 'Mumbai', users: 280 },
  { city: 'Bangalore', users: 195 },
  { city: 'Hyderabad', users: 150 },
  { city: 'Chennai', users: 125 }
])

// Platform Activity
const activity = ref({
  messages: 12500,
  applications: 3200,
  completedJobs: 980,
  avgRating: 4.7
})

// Recent Activity Timeline
const recentActivity = ref([
  {
    id: 1,
    icon: Users,
    text: '50 new users registered today',
    time: '2 hours ago',
    color: 'blue'
  },
  {
    id: 2,
    icon: Briefcase,
    text: 'Construction job posted in Delhi',
    time: '4 hours ago',
    color: 'green'
  },
  {
    id: 3,
    icon: DollarSign,
    text: '₹25,000 payment processed',
    time: '6 hours ago',
    color: 'purple'
  },
  {
    id: 4,
    icon: CheckCircle,
    text: 'KYC verification completed for 3 users',
    time: '8 hours ago',
    color: 'orange'
  },
  {
    id: 5,
    icon: Star,
    text: 'Platform rating improved to 4.7',
    time: '1 day ago',
    color: 'yellow'
  }
])

// Performance Comparison
const comparison = ref({
  userGrowth: 12.5,
  revenueGrowth: 15.3,
  jobGrowth: 8.2,
  engagementChange: 1.2,
  currentUsers: 1250,
  previousUsers: 1110,
  currentRevenue: 254300,
  previousRevenue: 220500,
  currentJobs: 87,
  previousJobs: 80,
  currentEngagement: 64,
  previousEngagement: 65.2
})

// Methods
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString()
}

const toggleUserDemographics = () => {
  showUserDemographics.value = !showUserDemographics.value
}

const togglePlatformActivity = () => {
  showPlatformActivity.value = !showPlatformActivity.value
}

const exportAnalytics = () => {
  console.log('Exporting analytics report...')
  // Implement export functionality
}

const refreshAnalytics = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In real app: fetch analytics data
  } catch (error) {
    console.error('Failed to refresh analytics:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  refreshAnalytics()
})
</script>

<style scoped>
.analytics-dashboard {
  padding: 1rem;
}

/* Header */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  gap: 1rem;
  align-items: center;
}

.date-range-selector {
  display: flex;
  gap: 0.25rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 0.75rem;
}

.range-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.range-btn:hover {
  background: white;
  color: #4b5563;
}

.range-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.export-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

/* Key Metrics */
.key-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s;
}

.metric-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.metric-trend.positive {
  background: #dcfce7;
  color: #166534;
}

.metric-trend.negative {
  background: #fee2e2;
  color: #991b1b;
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.metric-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.metric-detail {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.metric-detail .workers {
  color: #3b82f6;
}

.metric-detail .employers {
  color: #10b981;
}

.metric-detail .success-rate {
  color: #10b981;
}

.metric-detail .avg-transaction {
  color: #8b5cf6;
}

.metric-detail .satisfaction {
  color: #f59e0b;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.chart-type-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  font-size: 0.875rem;
  color: #4b5563;
}

.chart-container {
  height: 300px;
}

.chart-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  gap: 1rem;
}

.chart-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.stat-value.positive {
  color: #10b981;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  width: 100%;
  max-width: 300px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.category-item:hover {
  background: #f9fafb;
}

.category-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.category-name {
  flex: 1;
  font-size: 0.875rem;
  color: #4b5563;
}

.category-percentage {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.performance-metrics {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
  max-width: 300px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.metric-label {
  width: 100px;
  font-size: 0.875rem;
  color: #4b5563;
}

.metric-bar {
  flex: 1;
  height: 6px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.metric-bar .bar-fill {
  height: 100%;
  background: #10b981;
  border-radius: 9999px;
  transition: width 0.3s;
}

.metric-bar .bar-fill.good {
  background: #10b981;
}

.metric-bar .bar-fill.warning {
  background: #f59e0b;
}

.metric-value {
  width: 60px;
  text-align: right;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

/* Detailed Analytics */
.detailed-analytics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.analytics-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.expand-btn {
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

.expand-btn:hover {
  background: #f3f4f6;
}

.card-content {
  padding: 1.5rem;
}

.demographics-grid {
  display: grid;
  gap: 1.5rem;
}

.demographic-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.demographic-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
}

.demographic-chart {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.age-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.age-range {
  width: 50px;
  font-size: 0.75rem;
  color: #6b7280;
}

.age-bar {
  flex: 1;
  height: 8px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.age-bar .bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 9999px;
}

.age-percentage {
  width: 40px;
  text-align: right;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
}

.gender-distribution {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gender-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #f3f4f6;
  border-radius: 0.75rem;
}

.gender-label {
  flex: 1;
  font-size: 0.875rem;
  color: #4b5563;
}

.gender-percentage {
  font-weight: 600;
  color: #1f2937;
}

.locations-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.location-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #f3f4f6;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.location-item:hover {
  background: #f9fafb;
  border-color: #e5e7eb;
}

.location-city {
  flex: 1;
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.location-users {
  font-size: 0.75rem;
  color: #6b7280;
}

.activity-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #f9fafb;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-info {
  flex: 1;
}

.activity-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.activity-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.activity-timeline {
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
}

.timeline-header {
  margin-bottom: 1rem;
}

.timeline-header h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.timeline-item:hover {
  background: #f9fafb;
}

.timeline-icon {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.timeline-content {
  flex: 1;
}

.timeline-text {
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.timeline-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Performance Comparison */
.comparison-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.comparison-select {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: white;
  font-size: 0.875rem;
  color: #4b5563;
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.comparison-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: all 0.2s;
}

.comparison-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.comparison-header h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
}

.comparison-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.comparison-trend.positive {
  background: #dcfce7;
  color: #166534;
}

.comparison-trend.negative {
  background: #fee2e2;
  color: #991b1b;
}

.comparison-values {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.current-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.previous-value {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-right {
    flex-direction: column;
    align-items: stretch;
  }
  
  .date-range-selector {
    justify-content: center;
  }
  
  .key-metrics {
    grid-template-columns: 1fr;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .detailed-analytics {
    grid-template-columns: 1fr;
  }
  
  .activity-stats {
    grid-template-columns: 1fr;
  }
  
  .comparison-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .metric-value {
    font-size: 1.5rem;
  }
  
  .chart-container {
    height: 250px;
  }
}
</style>
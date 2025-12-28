<template>
  <div class="worker-dashboard">
    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <div class="stat-value">₹{{ walletBalance }}</div>
          <div class="stat-label">Available Balance</div>
        </div>
        <button @click="router.push('/wallet')" class="stat-action">
          Withdraw
        </button>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <div class="stat-value">{{ activeApplications }}</div>
          <div class="stat-label">Active Applications</div>
        </div>
        <button @click="router.push('/applications')" class="stat-action">
          View
        </button>
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
        </button>
      </div>
    </div>

    <!-- Featured Jobs -->
    <div class="featured-jobs">
      <div class="section-header">
        <h2 class="section-title">Featured Jobs Near You</h2>
        <button @click="router.push('/jobs')" class="view-all">
          View All
        </button>
      </div>
      
      <div class="jobs-list">
        <div v-for="job in featuredJobs" 
             :key="job.id"
             class="job-card"
             @click="viewJob(job.id)">
          <div class="job-header">
            <div class="job-category">
              <span class="category-icon">{{ job.categoryIcon }}</span>
              <span class="category-name">{{ job.category }}</span>
            </div>
            <div class="job-distance">{{ job.distance }} km</div>
          </div>
          
          <h3 class="job-title">{{ job.title }}</h3>
          <p class="job-description">{{ job.description }}</p>
          
          <div class="job-details">
            <div class="detail-item">
              <Calendar class="w-4 h-4" />
              <span>{{ job.date }}</span>
            </div>
            <div class="detail-item">
              <Clock class="w-4 h-4" />
              <span>{{ job.duration }}</span>
            </div>
            <div class="detail-item">
              <MapPin class="w-4 h-4" />
              <span>{{ job.location }}</span>
            </div>
          </div>
          
          <div class="job-footer">
            <div class="job-wage">
              <div class="wage-amount">₹{{ job.wage }}</div>
              <div class="wage-note">+₹{{ job.platformFee }} platform fee</div>
            </div>
            <button @click.stop="applyToJob(job.id)" 
                    class="apply-btn"
                    :class="{ 'applied': job.applied }">
              {{ job.applied ? 'Applied' : 'Apply Now' }}
            </button>
          </div>
          
          <div class="job-highlights" v-if="job.highlights">
            <span v-for="highlight in job.highlights" 
                  :key="highlight"
                  class="highlight-badge">
              {{ highlight }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Skills & Categories -->
    <div class="skills-section">
      <h2 class="section-title">Your Skills</h2>
      <div class="skills-tags">
        <span v-for="skill in userSkills" 
              :key="skill"
              class="skill-tag">
          {{ skill }}
        </span>
        <button @click="router.push('/profile')" class="add-skill-btn">
          + Add More
        </button>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-activity">
      <h2 class="section-title">Recent Activity</h2>
      <div class="activity-list">
        <div v-for="activity in recentActivities" 
             :key="activity.id"
             class="activity-item">
          <div class="activity-icon" :class="`activity-${activity.type}`">
            <component :is="activity.icon" class="w-5 h-5" />
          </div>
          <div class="activity-content">
            <p class="activity-text">{{ activity.text }}</p>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
          <div v-if="activity.amount" class="activity-amount">
            {{ activity.amount }}
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="bottom-nav">
      <button v-for="nav in bottomNav" 
              :key="nav.label"
              @click="nav.handler"
              class="nav-btn"
              :class="{ 'active': activeNav === nav.label }">
        <component :is="nav.icon" class="nav-icon" />
        <span class="nav-label">{{ nav.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, Briefcase, Wallet, User, Settings,
  Calendar, Clock, MapPin, CheckCircle, XCircle,
  TrendingUp, Award, Star, Zap
} from 'lucide-vue-next'

const router = useRouter()

// State
const walletBalance = ref(2450)
const activeApplications = ref(3)
const activeNav = ref('Home')

// Quick Actions
const quickActions = [
  { icon: Search, label: 'Find Jobs', handler: () => router.push('/jobs') },
  { icon: Wallet, label: 'Withdraw', handler: () => router.push('/wallet/withdraw') },
  { icon: User, label: 'Update Profile', handler: () => router.push('/profile/edit') },
  { icon: TrendingUp, label: 'Earnings', handler: () => router.push('/wallet/transactions') }
]

// Featured Jobs
const featuredJobs = ref([
  {
    id: 1,
    category: 'Electrician',
    categoryIcon: '⚡',
    title: 'House Wiring Repair',
    description: 'Need experienced electrician for house wiring issue',
    distance: 2.5,
    date: 'Today',
    duration: '4 hours',
    location: 'Civil Lines',
    wage: 800,
    platformFee: 30,
    applied: false,
    highlights: ['Urgent', 'Good Rating']
  },
  {
    id: 2,
    category: 'Plumber',
    categoryIcon: '🔧',
    title: 'Bathroom Pipe Fix',
    description: 'Leaking pipe in bathroom needs immediate attention',
    distance: 1.2,
    date: 'Tomorrow',
    duration: '2 hours',
    location: 'Market Road',
    wage: 500,
    platformFee: 20,
    applied: true,
    highlights: ['Easy Job', 'Tools Provided']
  },
  {
    id: 3,
    category: 'Carpenter',
    categoryIcon: '🪚',
    title: 'Furniture Assembly',
    description: 'Assembly of new wardrobe and bed',
    distance: 3.8,
    date: 'Flexible',
    duration: 'Full day',
    location: 'New Colony',
    wage: 1200,
    platformFee: 50,
    applied: false,
    highlights: ['Good Pay', 'Flexible Timing']
  }
])

// User Skills
const userSkills = ref(['Electrician', 'Wiring', 'AC Repair', 'Home Appliances'])

// Recent Activity
const recentActivities = ref([
  {
    id: 1,
    type: 'payment',
    icon: Wallet,
    text: 'Payment received for wiring job',
    time: '2 hours ago',
    amount: '₹800'
  },
  {
    id: 2,
    type: 'application',
    icon: Briefcase,
    text: 'Applied for plumbing job',
    time: '1 day ago',
    amount: null
  },
  {
    id: 3,
    type: 'completion',
    icon: CheckCircle,
    text: 'Job completed successfully',
    time: '2 days ago',
    amount: null
  }
])

// Bottom Navigation
const bottomNav = [
  { icon: Briefcase, label: 'Jobs', handler: () => router.push('/jobs') },
  { icon: Search, label: 'Search', handler: () => router.push('/search') },
  { icon: Wallet, label: 'Wallet', handler: () => router.push('/wallet') },
  { icon: User, label: 'Profile', handler: () => router.push('/profile') }
]

// Methods
const viewJob = (jobId) => {
  router.push(`/job/${jobId}`)
}

const applyToJob = (jobId) => {
  const job = featuredJobs.value.find(j => j.id === jobId)
  if (job && !job.applied) {
    job.applied = true
    // In real app, make API call
  }
}

onMounted(() => {
  // Load worker data
  console.log('Worker dashboard loaded')
})
</script>

<style scoped>
.worker-dashboard {
  padding: 1rem;
  padding-bottom: 5rem; /* Space for bottom nav */
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.5rem;
  padding: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.stat-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.9;
}

.stat-action {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.stat-action:hover {
  background: rgba(255, 255, 255, 0.3);
}

.quick-actions-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
}

.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.quick-action-btn {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.view-all {
  color: #3b82f6;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
}

.jobs-list {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding-bottom: 1rem;
  scrollbar-width: thin;
}

.job-card {
  min-width: 300px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.5rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.job-category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-icon {
  font-size: 1.5rem;
}

.category-name {
  font-weight: 600;
  color: #4b5563;
}

.job-distance {
  font-size: 0.875rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.job-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.job-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.job-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.job-wage .wage-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
}

.wage-note {
  font-size: 0.75rem;
  color: #6b7280;
}

.apply-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.apply-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

.apply-btn.applied {
  background: #10b981;
}

.job-highlights {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.highlight-badge {
  background: #fffbeb;
  color: #d97706;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.skills-section {
  margin: 2rem 0;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.add-skill-btn {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px dashed #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  cursor: pointer;
}

.activity-list {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.activity-payment {
  background: #dcfce7;
  color: #166534;
}

.activity-application {
  background: #dbeafe;
  color: #1e40af;
}

.activity-completion {
  background: #fef3c7;
  color: #92400e;
}

.activity-content {
  flex: 1;
}

.activity-text {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.activity-amount {
  font-weight: 700;
  color: #10b981;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  padding: 0.75rem;
  z-index: 10;
}

.nav-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
}

.nav-btn.active {
  color: #3b82f6;
}

.nav-btn.active .nav-icon {
  color: #3b82f6;
}

.nav-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
}

.nav-label {
  font-size: 0.75rem;
}
</style>
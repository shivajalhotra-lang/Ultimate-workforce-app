<template>
  <div class="job-management">
    <!-- Header -->
    <div class="management-header">
      <div class="header-left">
        <h1 class="page-title">Job Management</h1>
        <p class="page-subtitle">Manage job postings, applications, and approvals</p>
      </div>
      <div class="header-right">
        <button @click="showNewJobModal" class="create-job-btn">
          <Plus class="w-4 h-4" />
          Create New Job
        </button>
        <button @click="refreshJobs" class="refresh-btn" :disabled="loading">
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="search-box">
        <Search class="search-icon" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search jobs by title, description, or ID..."
          class="search-input"
        />
      </div>
      
      <div class="filter-controls">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        <select v-model="selectedType" class="filter-select">
          <option value="">All Types</option>
          <option value="construction">Construction</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="domestic">Domestic Help</option>
          <option value="driving">Driving</option>
          <option value="security">Security</option>
        </select>
        
        <select v-model="selectedEmployer" class="filter-select">
          <option value="">All Employers</option>
          <option v-for="employer in employers" :key="employer.id" :value="employer.id">
            {{ employer.name }}
          </option>
        </select>
        
        <button @click="exportJobs" class="export-btn">
          <Download class="w-4 h-4" />
          Export
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon bg-blue-100">
          <Briefcase class="w-6 h-6 text-blue-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalJobs }}</div>
          <div class="stat-label">Total Jobs</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-green-100">
          <Users class="w-6 h-6 text-green-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.activeJobs }}</div>
          <div class="stat-label">Active Jobs</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-orange-100">
          <Clock class="w-6 h-6 text-orange-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingApproval }}</div>
          <div class="stat-label">Pending Approval</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-purple-100">
          <DollarSign class="w-6 h-6 text-purple-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">₹{{ stats.totalWages.toLocaleString() }}</div>
          <div class="stat-label">Total Wages</div>
        </div>
      </div>
    </div>

    <!-- Jobs Table -->
    <div class="table-container">
      <table class="jobs-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
            </th>
            <th>Job Details</th>
            <th>Employer</th>
            <th>Type</th>
            <th>Workers</th>
            <th>Wage</th>
            <th>Status</th>
            <th>Posted</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="job in paginatedJobs" :key="job.id">
            <td>
              <input type="checkbox" :value="job.id" v-model="selectedJobs">
            </td>
            <td>
              <div class="job-cell">
                <div class="job-title">{{ job.title }}</div>
                <div class="job-meta">
                  <span class="job-id">#{{ job.id }}</span>
                  <span class="job-location">{{ job.location }}</span>
                </div>
                <div class="job-description">{{ truncateText(job.description, 80) }}</div>
              </div>
            </td>
            <td>
              <div class="employer-cell">
                <div class="employer-avatar" :style="{ background: job.employer.avatarColor }">
                  {{ job.employer.name.charAt(0) }}
                </div>
                <div class="employer-info">
                  <div class="employer-name">{{ job.employer.name }}</div>
                  <div class="employer-rating">
                    <Star class="w-3 h-3 fill-current text-yellow-400" />
                    {{ job.employer.rating }}
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div :class="`type-badge type-${job.type}`">
                {{ formatType(job.type) }}
              </div>
            </td>
            <td>
              <div class="workers-cell">
                <div class="workers-count">{{ job.currentWorkers }}/{{ job.requiredWorkers }}</div>
                <div class="workers-progress">
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: `${(job.currentWorkers / job.requiredWorkers) * 100}%` }"></div>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="wage-cell">
                <div class="wage-amount">₹{{ job.wage.toLocaleString() }}</div>
                <div class="wage-period">/{{ job.wagePeriod }}</div>
              </div>
            </td>
            <td>
              <div :class="`status-badge status-${job.status}`">
                {{ job.status }}
              </div>
            </td>
            <td>
              {{ formatDate(job.postedDate) }}
            </td>
            <td>
              <div class="action-buttons">
                <button @click="viewJobDetails(job)" class="action-btn view" title="View Details">
                  <Eye class="w-4 h-4" />
                </button>
                <button @click="editJob(job)" class="action-btn edit" title="Edit Job">
                  <Edit class="w-4 h-4" />
                </button>
                <button @click="toggleJobStatus(job)" class="action-btn toggle" :title="job.status === 'active' ? 'Deactivate' : 'Activate'">
                  <component :is="job.status === 'active' ? Pause : Play" class="w-4 h-4" />
                </button>
                <button @click="showApplications(job)" class="action-btn applications" title="View Applications">
                  <Users class="w-4 h-4" />
                  <span v-if="job.applicationCount > 0" class="application-count">
                    {{ job.applicationCount }}
                  </span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredJobs.length === 0 && !loading" class="empty-state">
      <Briefcase class="w-16 h-16 text-gray-300" />
      <h3>No jobs found</h3>
      <p>Try adjusting your filters or create a new job</p>
      <button @click="showNewJobModal" class="create-job-btn">
        <Plus class="w-4 h-4" />
        Create New Job
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <RefreshCw class="w-8 h-8 animate-spin text-blue-500" />
      <span>Loading jobs...</span>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedJobs.length > 0" class="bulk-actions">
      <div class="selected-count">
        {{ selectedJobs.length }} jobs selected
      </div>
      <div class="bulk-buttons">
        <button @click="bulkApprove" class="bulk-btn approve">
          <Check class="w-4 h-4" />
          Approve Selected
        </button>
        <button @click="bulkReject" class="bulk-btn reject">
          <X class="w-4 h-4" />
          Reject Selected
        </button>
        <button @click="bulkDelete" class="bulk-btn delete">
          <Trash2 class="w-4 h-4" />
          Delete Selected
        </button>
        <button @click="clearSelection" class="bulk-btn clear">
          Clear Selection
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <div class="page-info">
        Showing {{ startItem }}-{{ endItem }} of {{ filteredJobs.length }} jobs
      </div>
      
      <div class="pagination-controls">
        <button @click="prevPage" :disabled="currentPage === 1" class="pagination-btn">
          <ChevronLeft class="w-4 h-4" />
        </button>
        
        <div class="page-numbers">
          <button v-for="page in visiblePages" 
                  :key="page"
                  @click="goToPage(page)"
                  :class="['page-btn', { active: currentPage === page }]">
            {{ page }}
          </button>
        </div>
        
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-btn">
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- New Job Modal -->
    <NewJobModal 
      v-if="showNewJobModalState"
      :employers="employers"
      @close="showNewJobModalState = false"
      @save="handleNewJob"
    />

    <!-- Job Details Modal -->
    <JobDetails 
      v-if="selectedJobDetails"
      :job="selectedJobDetails"
      @close="selectedJobDetails = null"
      @update="handleJobUpdate"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Search,
  Download,
  Briefcase,
  Users,
  Clock,
  DollarSign,
  Eye,
  Edit,
  Pause,
  Play,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Trash2,
  Star
} from 'lucide-vue-next'
import NewJobModal from '@/components/modals/NewJobModal.vue'
import JobDetails from '@/components/features/JobDetails.vue'

// State
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const selectedEmployer = ref('')
const selectedJobs = ref([])
const selectAll = ref(false)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const showNewJobModalState = ref(false)
const selectedJobDetails = ref(null)

// Sample data (replace with API call)
const jobs = ref([
  {
    id: 'JOB001',
    title: 'Construction Worker - High Rise Building',
    description: 'Need experienced construction workers for high-rise building project in Delhi. Must have at least 2 years experience.',
    type: 'construction',
    location: 'Delhi, India',
    wage: 18000,
    wagePeriod: 'month',
    requiredWorkers: 10,
    currentWorkers: 7,
    status: 'active',
    postedDate: '2024-01-15',
    applicationCount: 15,
    employer: {
      id: 'E001',
      name: 'ABC Enterprises',
      rating: 4.5,
      avatarColor: '#10b981'
    }
  },
  {
    id: 'JOB002',
    title: 'Factory Worker - Manufacturing Unit',
    description: 'Looking for factory workers for manufacturing unit in Noida. Training will be provided.',
    type: 'manufacturing',
    location: 'Noida, India',
    wage: 15000,
    wagePeriod: 'month',
    requiredWorkers: 25,
    currentWorkers: 22,
    status: 'active',
    postedDate: '2024-01-10',
    applicationCount: 8,
    employer: {
      id: 'E002',
      name: 'XYZ Manufacturing',
      rating: 4.2,
      avatarColor: '#3b82f6'
    }
  },
  {
    id: 'JOB003',
    title: 'Domestic Helper - Full Time',
    description: 'Required domestic helper for household in Mumbai. Cooking and cleaning duties.',
    type: 'domestic',
    location: 'Mumbai, India',
    wage: 12000,
    wagePeriod: 'month',
    requiredWorkers: 1,
    currentWorkers: 0,
    status: 'pending',
    postedDate: '2024-01-20',
    applicationCount: 3,
    employer: {
      id: 'E003',
      name: 'Sharma Family',
      rating: 4.8,
      avatarColor: '#8b5cf6'
    }
  },
  {
    id: 'JOB004',
    title: 'Delivery Driver - E-commerce',
    description: 'Need delivery drivers for e-commerce deliveries in Bangalore. Must have valid driving license.',
    type: 'driving',
    location: 'Bangalore, India',
    wage: 20000,
    wagePeriod: 'month',
    requiredWorkers: 5,
    currentWorkers: 5,
    status: 'completed',
    postedDate: '2023-12-15',
    applicationCount: 0,
    employer: {
      id: 'E004',
      name: 'QuickDeliver Pvt Ltd',
      rating: 4.0,
      avatarColor: '#f59e0b'
    }
  },
  {
    id: 'JOB005',
    title: 'Security Guard - Commercial Building',
    description: 'Looking for experienced security guards for commercial building in Gurgaon.',
    type: 'security',
    location: 'Gurgaon, India',
    wage: 16000,
    wagePeriod: 'month',
    requiredWorkers: 8,
    currentWorkers: 6,
    status: 'active',
    postedDate: '2024-01-05',
    applicationCount: 12,
    employer: {
      id: 'E005',
      name: 'SecureGuard Services',
      rating: 4.3,
      avatarColor: '#ec4899'
    }
  }
])

const employers = ref([
  { id: 'E001', name: 'ABC Enterprises' },
  { id: 'E002', name: 'XYZ Manufacturing' },
  { id: 'E003', name: 'Sharma Family' },
  { id: 'E004', name: 'QuickDeliver Pvt Ltd' },
  { id: 'E005', name: 'SecureGuard Services' }
])

// Computed Properties
const stats = computed(() => {
  const total = jobs.value.length
  const active = jobs.value.filter(j => j.status === 'active').length
  const pending = jobs.value.filter(j => j.status === 'pending').length
  const totalWages = jobs.value.reduce((sum, job) => sum + job.wage, 0)
  
  return {
    totalJobs: total,
    activeJobs: active,
    pendingApproval: pending,
    totalWages: totalWages
  }
})

const filteredJobs = computed(() => {
  return jobs.value.filter(job => {
    const matchesSearch = searchQuery.value === '' || 
      job.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesStatus = selectedStatus.value === '' || job.status === selectedStatus.value
    const matchesType = selectedType.value === '' || job.type === selectedType.value
    const matchesEmployer = selectedEmployer.value === '' || job.employer.id === selectedEmployer.value
    
    return matchesSearch && matchesStatus && matchesType && matchesEmployer
  })
})

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredJobs.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / pageSize.value))

const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endItem = computed(() => {
  const end = currentPage.value * pageSize.value
  return end > filteredJobs.value.length ? filteredJobs.value.length : end
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i)
      pages.push('...')
      pages.push(totalPages.value)
    } else if (currentPage.value >= totalPages.value - 2) {
      pages.push(1)
      pages.push('...')
      for (let i = totalPages.value - 3; i <= totalPages.value; i++) pages.push(i)
    } else {
      pages.push(1)
      pages.push('...')
      pages.push(currentPage.value - 1)
      pages.push(currentPage.value)
      pages.push(currentPage.value + 1)
      pages.push('...')
      pages.push(totalPages.value)
    }
  }
  
  return pages.filter(p => p !== '...')
})

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const formatType = (type) => {
  const typeMap = {
    construction: 'Construction',
    manufacturing: 'Manufacturing',
    domestic: 'Domestic Help',
    driving: 'Driving',
    security: 'Security'
  }
  return typeMap[type] || type
}

const truncateText = (text, length) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedJobs.value = paginatedJobs.value.map(job => job.id)
  } else {
    selectedJobs.value = []
  }
}

const refreshJobs = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In real app: fetch jobs from backend
    // const response = await fetch('/api/jobs')
    // jobs.value = await response.json()
  } catch (error) {
    console.error('Failed to refresh jobs:', error)
  } finally {
    loading.value = false
  }
}

const showNewJobModal = () => {
  showNewJobModalState.value = true
}

const viewJobDetails = (job) => {
  selectedJobDetails.value = job
}

const editJob = (job) => {
  // For now, open details modal
  selectedJobDetails.value = job
}

const toggleJobStatus = (job) => {
  job.status = job.status === 'active' ? 'inactive' : 'active'
}

const showApplications = (job) => {
  console.log('Show applications for:', job.id)
  // Navigate to applications page or show modal
}

const handleNewJob = (newJob) => {
  // Add new job to the list
  jobs.value.unshift({
    ...newJob,
    id: `JOB${String(jobs.value.length + 1).padStart(3, '0')}`,
    currentWorkers: 0,
    applicationCount: 0,
    postedDate: new Date().toISOString().split('T')[0]
  })
  showNewJobModalState.value = false
}

const handleJobUpdate = (updatedJob) => {
  const index = jobs.value.findIndex(j => j.id === updatedJob.id)
  if (index !== -1) {
    jobs.value[index] = { ...jobs.value[index], ...updatedJob }
  }
}

const bulkApprove = () => {
  jobs.value.forEach(job => {
    if (selectedJobs.value.includes(job.id)) {
      job.status = 'active'
    }
  })
  clearSelection()
}

const bulkReject = () => {
  jobs.value.forEach(job => {
    if (selectedJobs.value.includes(job.id)) {
      job.status = 'cancelled'
    }
  })
  clearSelection()
}

const bulkDelete = () => {
  if (confirm(`Are you sure you want to delete ${selectedJobs.value.length} jobs?`)) {
    jobs.value = jobs.value.filter(job => !selectedJobs.value.includes(job.id))
    clearSelection()
  }
}

const clearSelection = () => {
  selectedJobs.value = []
  selectAll.value = false
}

const exportJobs = () => {
  console.log('Exporting jobs data...')
  // Implement export to CSV/Excel
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
  if (page !== '...') {
    currentPage.value = page
  }
}

// Lifecycle
onMounted(() => {
  refreshJobs()
})
</script>

<style scoped>
.job-management {
  padding: 1rem;
}

/* Header */
.management-header {
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
  gap: 0.75rem;
}

.create-job-btn {
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
}

.create-job-btn:hover {
  background: #2563eb;
}

.refresh-btn {
  width: 44px;
  height: 44px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

/* Filters */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-box {
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

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filter-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  background: white;
  min-width: 150px;
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

/* Stats Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Table */
.table-container {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: auto;
  margin-bottom: 1.5rem;
  max-height: 500px;
}

.jobs-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.jobs-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 2px solid #e5e7eb;
  position: sticky;
  top: 0;
}

.jobs-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.jobs-table tr:hover {
  background: #f9fafb;
}

/* Job Cell */
.job-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.job-title {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.job-meta {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.75rem;
}

.job-id {
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.job-location {
  color: #6b7280;
}

.job-description {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
}

/* Employer Cell */
.employer-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.employer-avatar {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
}

.employer-info {
  display: flex;
  flex-direction: column;
}

.employer-name {
  font-weight: 500;
  font-size: 0.875rem;
  color: #1f2937;
}

.employer-rating {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.75rem;
  color: #6b7280;
}

/* Type Badge */
.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.type-construction {
  background: #fef3c7;
  color: #92400e;
}

.type-manufacturing {
  background: #dbeafe;
  color: #1e40af;
}

.type-domestic {
  background: #f3e8ff;
  color: #7c3aed;
}

.type-driving {
  background: #dcfce7;
  color: #166534;
}

.type-security {
  background: #fee2e2;
  color: #991b1b;
}

/* Workers Cell */
.workers-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.workers-count {
  font-weight: 500;
  font-size: 0.875rem;
  color: #1f2937;
}

.workers-progress {
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #10b981;
  border-radius: 9999px;
  transition: width 0.3s;
}

/* Wage Cell */
.wage-cell {
  display: flex;
  align-items: baseline;
  gap: 0.125rem;
}

.wage-amount {
  font-weight: 600;
  color: #1f2937;
}

.wage-period {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Status Badge */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.status-active {
  background: #dcfce7;
  color: #166534;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-completed {
  background: #dbeafe;
  color: #1e40af;
}

.status-cancelled {
  background: #fee2e2;
  color: #991b1b;
}

/* Action Buttons */
.action-buttons {
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
  transition: all 0.2s;
  position: relative;
}

.action-btn.view {
  color: #3b82f6;
}

.action-btn.view:hover {
  background: #dbeafe;
  border-color: #3b82f6;
}

.action-btn.edit {
  color: #10b981;
}

.action-btn.edit:hover {
  background: #dcfce7;
  border-color: #10b981;
}

.action-btn.toggle {
  color: #f59e0b;
}

.action-btn.toggle:hover {
  background: #fef3c7;
  border-color: #f59e0b;
}

.action-btn.applications {
  color: #8b5cf6;
}

.action-btn.applications:hover {
  background: #f3e8ff;
  border-color: #8b5cf6;
}

.application-count {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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

.bulk-btn.approve {
  background: #10b981;
  color: white;
  border: none;
}

.bulk-btn.approve:hover {
  background: #0da271;
}

.bulk-btn.reject {
  background: #ef4444;
  color: white;
  border: none;
}

.bulk-btn.reject:hover {
  background: #dc2626;
}

.bulk-btn.delete {
  background: #6b7280;
  color: white;
  border: none;
}

.bulk-btn.delete:hover {
  background: #4b5563;
}

.bulk-btn.clear {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.bulk-btn.clear:hover {
  background: #f3f4f6;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-info {
  color: #6b7280;
  font-size: 0.875rem;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pagination-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:hover:not(:disabled) {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.page-numbers {
  display: flex;
  gap: 0.25rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.page-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.page-btn:hover:not(.active) {
  background: #f3f4f6;
}

/* Responsive */
@media (max-width: 768px) {
  .management-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    width: 100%;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
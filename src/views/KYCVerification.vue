<template>
  <div class="kyc-verification">
    <!-- Header -->
    <div class="management-header">
      <div class="header-left">
        <h1 class="page-title">KYC Verification</h1>
        <p class="page-subtitle">Review and verify user identity documents</p>
      </div>
      <div class="header-right">
        <div class="stats-badge">
          <AlertCircle class="w-4 h-4" />
          <span>{{ pendingCount }} Pending</span>
        </div>
        <button @click="refreshVerifications" class="refresh-btn" :disabled="loading">
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="verification-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
      >
        {{ tab.label }}
        <span class="tab-count">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon bg-blue-100">
          <Clock class="w-6 h-6 text-blue-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">Pending Review</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-green-100">
          <UserCheck class="w-6 h-6 text-green-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.verified }}</div>
          <div class="stat-label">Verified</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-red-100">
          <UserX class="w-6 h-6 text-red-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.rejected }}</div>
          <div class="stat-label">Rejected</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-purple-100">
          <FileText class="w-6 h-6 text-purple-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Total Submissions</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="search-box">
        <Search class="search-icon" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search by name, ID, or phone..."
          class="search-input"
        />
      </div>
      
      <div class="filter-controls">
        <select v-model="selectedDocType" class="filter-select">
          <option value="">All Document Types</option>
          <option value="aadhaar">Aadhaar Card</option>
          <option value="pan">PAN Card</option>
          <option value="passport">Passport</option>
          <option value="driving">Driving License</option>
          <option value="voter">Voter ID</option>
        </select>
        
        <select v-model="selectedUserType" class="filter-select">
          <option value="">All User Types</option>
          <option value="worker">Worker</option>
          <option value="employer">Employer</option>
        </select>
        
        <input 
          type="date" 
          v-model="dateFrom" 
          class="date-input"
          placeholder="From Date"
        />
        
        <button @click="clearFilters" class="clear-filters-btn">
          <X class="w-4 h-4" />
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Verification Requests Table -->
    <div class="table-container">
      <table class="verifications-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
            </th>
            <th>User</th>
            <th>Document Type</th>
            <th>Document Number</th>
            <th>Status</th>
            <th>Submitted</th>
            <th>Reviewer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="verification in paginatedVerifications" :key="verification.id">
            <td>
              <input type="checkbox" :value="verification.id" v-model="selectedVerifications">
            </td>
            <td>
              <div class="user-cell">
                <div class="user-avatar" :style="{ background: verification.user.avatarColor }">
                  {{ verification.user.name.charAt(0) }}
                </div>
                <div class="user-info">
                  <div class="user-name">{{ verification.user.name }}</div>
                  <div class="user-details">
                    <span class="user-id">ID: {{ verification.user.id }}</span>
                    <span class="user-role">{{ verification.user.role }}</span>
                    <span class="user-phone">{{ verification.user.phone }}</span>
                  </div>
                </div>
              </div>
            </td>
            <td>
              <div class="doc-type-cell">
                <div :class="`doc-icon doc-${verification.documentType}`">
                  <component :is="verification.documentIcon" class="w-4 h-4" />
                </div>
                <span>{{ formatDocType(verification.documentType) }}</span>
              </div>
            </td>
            <td>
              <div class="doc-number">
                {{ verification.documentNumber }}
                <button @click="copyToClipboard(verification.documentNumber)" class="copy-btn" title="Copy">
                  <Copy class="w-3 h-3" />
                </button>
              </div>
            </td>
            <td>
              <div :class="`status-badge status-${verification.status}`">
                {{ verification.status }}
              </div>
            </td>
            <td>
              <div class="date-cell">
                <div class="date">{{ formatDate(verification.submittedDate) }}</div>
                <div class="time">{{ verification.submittedTime }}</div>
              </div>
            </td>
            <td>
              <div v-if="verification.reviewer" class="reviewer-cell">
                <div class="reviewer-avatar">
                  {{ verification.reviewer.name.charAt(0) }}
                </div>
                <div class="reviewer-name">{{ verification.reviewer.name }}</div>
              </div>
              <div v-else class="no-reviewer">Not assigned</div>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="viewVerification(verification)" class="action-btn view" title="View Details">
                  <Eye class="w-4 h-4" />
                </button>
                <button 
                  v-if="verification.status === 'pending'"
                  @click="assignToMe(verification)" 
                  class="action-btn assign" 
                  title="Assign to Me"
                >
                  <UserPlus class="w-4 h-4" />
                </button>
                <button 
                  v-if="verification.status === 'pending' && verification.reviewer?.id === currentUser.id"
                  @click="approveVerification(verification)" 
                  class="action-btn approve" 
                  title="Approve"
                >
                  <Check class="w-4 h-4" />
                </button>
                <button 
                  v-if="verification.status === 'pending' && verification.reviewer?.id === currentUser.id"
                  @click="rejectVerification(verification)" 
                  class="action-btn reject" 
                  title="Reject"
                >
                  <X class="w-4 h-4" />
                </button>
                <button @click="downloadDocuments(verification)" class="action-btn download" title="Download Documents">
                  <Download class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredVerifications.length === 0 && !loading" class="empty-state">
      <FileCheck class="w-16 h-16 text-gray-300" />
      <h3>No verification requests found</h3>
      <p v-if="activeTab === 'pending'">All pending requests have been processed!</p>
      <p v-else>Try adjusting your filters</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <RefreshCw class="w-8 h-8 animate-spin text-blue-500" />
      <span>Loading verification requests...</span>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedVerifications.length > 0" class="bulk-actions">
      <div class="selected-count">
        {{ selectedVerifications.length }} requests selected
      </div>
      <div class="bulk-buttons">
        <button @click="bulkApprove" class="bulk-btn approve" v-if="activeTab === 'pending'">
          <Check class="w-4 h-4" />
          Approve Selected
        </button>
        <button @click="bulkReject" class="bulk-btn reject" v-if="activeTab === 'pending'">
          <X class="w-4 h-4" />
          Reject Selected
        </button>
        <button @click="bulkAssign" class="bulk-btn assign" v-if="activeTab === 'pending'">
          <UserPlus class="w-4 h-4" />
          Assign to Me
        </button>
        <button @click="bulkDownload" class="bulk-btn download">
          <Download class="w-4 h-4" />
          Download Documents
        </button>
        <button @click="clearSelection" class="bulk-btn clear">
          Clear Selection
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <div class="page-info">
        Showing {{ startItem }}-{{ endItem }} of {{ filteredVerifications.length }} requests
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

    <!-- Verification Details Modal -->
    <VerificationDetailsModal 
      v-if="selectedVerification"
      :verification="selectedVerification"
      @close="selectedVerification = null"
      @approve="handleApprove"
      @reject="handleReject"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Search,
  RefreshCw,
  Eye,
  Check,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  Clock,
  UserCheck,
  UserX,
  FileText,
  AlertCircle,
  UserPlus,
  Copy,
  FileCheck,
  CreditCard,
  FileDigit,
  Passport,
  Car,
  User
} from 'lucide-vue-next'
import VerificationDetailsModal from '@/components/modals/VerificationDetailsModal.vue'

// State
const searchQuery = ref('')
const selectedDocType = ref('')
const selectedUserType = ref('')
const dateFrom = ref('')
const activeTab = ref('pending')
const selectedVerifications = ref([])
const selectAll = ref(false)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedVerification = ref(null)

// Current user (admin)
const currentUser = ref({
  id: 'ADMIN001',
  name: 'Admin User',
  role: 'admin'
})

// Tabs
const tabs = ref([
  { id: 'pending', label: 'Pending Review', count: 0 },
  { id: 'verified', label: 'Verified', count: 0 },
  { id: 'rejected', label: 'Rejected', count: 0 },
  { id: 'all', label: 'All', count: 0 }
])

// Sample data (replace with API call)
const verifications = ref([
  {
    id: 'KYC001',
    userId: 'W001',
    documentType: 'aadhaar',
    documentIcon: CreditCard,
    documentNumber: 'XXXX-XXXX-1234',
    status: 'pending',
    submittedDate: '2024-01-20',
    submittedTime: '10:30 AM',
    reviewer: null,
    user: {
      id: 'W001',
      name: 'Ramesh Kumar',
      role: 'worker',
      phone: '9876543210',
      avatarColor: '#3b82f6'
    }
  },
  {
    id: 'KYC002',
    userId: 'E001',
    documentType: 'pan',
    documentIcon: FileDigit,
    documentNumber: 'ABCDE1234F',
    status: 'pending',
    submittedDate: '2024-01-19',
    submittedTime: '02:45 PM',
    reviewer: {
      id: 'ADMIN001',
      name: 'Admin User'
    },
    user: {
      id: 'E001',
      name: 'ABC Enterprises',
      role: 'employer',
      phone: '9876543211',
      avatarColor: '#10b981'
    }
  },
  {
    id: 'KYC003',
    userId: 'W002',
    documentType: 'passport',
    documentIcon: Passport,
    documentNumber: 'Z1234567',
    status: 'verified',
    submittedDate: '2024-01-18',
    submittedTime: '11:15 AM',
    reviewer: {
      id: 'ADMIN001',
      name: 'Admin User'
    },
    verifiedDate: '2024-01-19',
    user: {
      id: 'W002',
      name: 'Suresh Singh',
      role: 'worker',
      phone: '9876543212',
      avatarColor: '#8b5cf6'
    }
  },
  {
    id: 'KYC004',
    userId: 'W003',
    documentType: 'driving',
    documentIcon: Car,
    documentNumber: 'DL0420111234567',
    status: 'rejected',
    submittedDate: '2024-01-17',
    submittedTime: '04:20 PM',
    reviewer: {
      id: 'ADMIN001',
      name: 'Admin User'
    },
    rejectionReason: 'Document image unclear',
    rejectedDate: '2024-01-18',
    user: {
      id: 'W003',
      name: 'Priya Sharma',
      role: 'worker',
      phone: '9876543213',
      avatarColor: '#ec4899'
    }
  },
  {
    id: 'KYC005',
    userId: 'E002',
    documentType: 'aadhaar',
    documentIcon: CreditCard,
    documentNumber: 'XXXX-XXXX-5678',
    status: 'pending',
    submittedDate: '2024-01-16',
    submittedTime: '09:00 AM',
    reviewer: null,
    user: {
      id: 'E002',
      name: 'XYZ Contractors',
      role: 'employer',
      phone: '9876543214',
      avatarColor: '#f59e0b'
    }
  }
])

// Computed Properties
const stats = computed(() => {
  const pending = verifications.value.filter(v => v.status === 'pending').length
  const verified = verifications.value.filter(v => v.status === 'verified').length
  const rejected = verifications.value.filter(v => v.status === 'rejected').length
  const total = verifications.value.length
  
  // Update tab counts
  tabs.value[0].count = pending
  tabs.value[1].count = verified
  tabs.value[2].count = rejected
  tabs.value[3].count = total
  
  return { pending, verified, rejected, total }
})

const pendingCount = computed(() => stats.value.pending)

const filteredVerifications = computed(() => {
  return verifications.value.filter(verification => {
    // Tab filtering
    let matchesTab = true
    if (activeTab.value !== 'all') {
      matchesTab = verification.status === activeTab.value
    }
    
    // Search filtering
    const matchesSearch = searchQuery.value === '' || 
      verification.user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      verification.user.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      verification.user.phone.includes(searchQuery.value) ||
      verification.documentNumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Document type filtering
    const matchesDocType = selectedDocType.value === '' || verification.documentType === selectedDocType.value
    
    // User type filtering
    const matchesUserType = selectedUserType.value === '' || verification.user.role === selectedUserType.value
    
    // Date filtering
    let matchesDate = true
    if (dateFrom.value) {
      const fromDate = new Date(dateFrom.value)
      const submittedDate = new Date(verification.submittedDate)
      matchesDate = submittedDate >= fromDate
    }
    
    return matchesTab && matchesSearch && matchesDocType && matchesUserType && matchesDate
  })
})

const paginatedVerifications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredVerifications.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredVerifications.value.length / pageSize.value))

const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endItem = computed(() => {
  const end = currentPage.value * pageSize.value
  return end > filteredVerifications.value.length ? filteredVerifications.value.length : end
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

const formatDocType = (docType) => {
  const typeMap = {
    aadhaar: 'Aadhaar Card',
    pan: 'PAN Card',
    passport: 'Passport',
    driving: 'Driving License',
    voter: 'Voter ID'
  }
  return typeMap[docType] || docType
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedVerifications.value = paginatedVerifications.value.map(v => v.id)
  } else {
    selectedVerifications.value = []
  }
}

const refreshVerifications = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // In real app: fetch verifications from backend
  } catch (error) {
    console.error('Failed to refresh verifications:', error)
  } finally {
    loading.value = false
  }
}

const viewVerification = (verification) => {
  selectedVerification.value = verification
}

const assignToMe = (verification) => {
  verification.reviewer = { ...currentUser.value }
  // In real app: call API to assign verification
}

const approveVerification = (verification) => {
  if (confirm(`Approve KYC verification for ${verification.user.name}?`)) {
    verification.status = 'verified'
    verification.verifiedDate = new Date().toISOString().split('T')[0]
    // In real app: call API to approve
  }
}

const rejectVerification = (verification) => {
  const reason = prompt('Enter rejection reason:')
  if (reason) {
    verification.status = 'rejected'
    verification.rejectionReason = reason
    verification.rejectedDate = new Date().toISOString().split('T')[0]
    // In real app: call API to reject
  }
}

const downloadDocuments = (verification) => {
  console.log('Downloading documents for:', verification.id)
  // Implement document download
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => {
      // Show success message (you could add a toast notification)
      console.log('Copied to clipboard:', text)
    })
    .catch(err => {
      console.error('Failed to copy:', err)
    })
}

const handleApprove = (verification) => {
  verification.status = 'verified'
  verification.verifiedDate = new Date().toISOString().split('T')[0]
  selectedVerification.value = null
}

const handleReject = (verification) => {
  verification.status = 'rejected'
  verification.rejectedDate = new Date().toISOString().split('T')[0]
  selectedVerification.value = null
}

const bulkApprove = () => {
  if (confirm(`Approve ${selectedVerifications.value.length} verification requests?`)) {
    verifications.value.forEach(v => {
      if (selectedVerifications.value.includes(v.id) && v.status === 'pending') {
        v.status = 'verified'
        v.verifiedDate = new Date().toISOString().split('T')[0]
        if (!v.reviewer) {
          v.reviewer = { ...currentUser.value }
        }
      }
    })
    clearSelection()
  }
}

const bulkReject = () => {
  const reason = prompt('Enter rejection reason for all selected requests:')
  if (reason) {
    verifications.value.forEach(v => {
      if (selectedVerifications.value.includes(v.id) && v.status === 'pending') {
        v.status = 'rejected'
        v.rejectionReason = reason
        v.rejectedDate = new Date().toISOString().split('T')[0]
        if (!v.reviewer) {
          v.reviewer = { ...currentUser.value }
        }
      }
    })
    clearSelection()
  }
}

const bulkAssign = () => {
  verifications.value.forEach(v => {
    if (selectedVerifications.value.includes(v.id) && v.status === 'pending' && !v.reviewer) {
      v.reviewer = { ...currentUser.value }
    }
  })
  clearSelection()
}

const bulkDownload = () => {
  console.log('Bulk download for:', selectedVerifications.value)
  // Implement bulk document download
}

const clearSelection = () => {
  selectedVerifications.value = []
  selectAll.value = false
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedDocType.value = ''
  selectedUserType.value = ''
  dateFrom.value = ''
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
  refreshVerifications()
})
</script>

<style scoped>
.kyc-verification {
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
  align-items: center;
}

.stats-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #fef3c7;
  color: #92400e;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
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

/* Tabs */
.verification-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.tab-btn {
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
  position: relative;
}

.tab-btn:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.tab-btn.active {
  background: #3b82f6;
  color: white;
}

.tab-btn.active::after {
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

.tab-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.tab-btn.active .tab-count {
  background: rgba(255, 255, 255, 0.3);
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

/* Filters */
.filters-section {
  margin-bottom: 2rem;
}

.search-box {
  position: relative;
  width: 300px;
  margin-bottom: 1rem;
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

.date-input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  background: white;
  min-width: 150px;
}

.clear-filters-btn {
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

.clear-filters-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

/* Table */
.table-container {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: auto;
  margin-bottom: 1.5rem;
  max-height: 500px;
}

.verifications-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px;
}

.verifications-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 2px solid #e5e7eb;
  position: sticky;
  top: 0;
}

.verifications-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.verifications-table tr:hover {
  background: #f9fafb;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.user-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.user-id {
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}

.user-role {
  color: #6b7280;
  text-transform: capitalize;
}

.user-phone {
  color: #6b7280;
}

/* Document Type Cell */
.doc-type-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.doc-icon {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doc-aadhaar {
  background: #dbeafe;
  color: #1e40af;
}

.doc-pan {
  background: #dcfce7;
  color: #166534;
}

.doc-passport {
  background: #fef3c7;
  color: #92400e;
}

.doc-driving {
  background: #f3e8ff;
  color: #7c3aed;
}

.doc-voter {
  background: #fee2e2;
  color: #991b1b;
}

/* Document Number */
.doc-number {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Monospace', monospace;
  font-weight: 500;
  color: #1f2937;
}

.copy-btn {
  width: 24px;
  height: 24px;
  border-radius: 0.375rem;
  border: 1px solid #e5e7eb;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.copy-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
  color: #4b5563;
}

/* Status Badge */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  text-transform: capitalize;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-verified {
  background: #dcfce7;
  color: #166534;
}

.status-rejected {
  background: #fee2e2;
  color: #991b1b;
}

/* Date Cell */
.date-cell {
  display: flex;
  flex-direction: column;
}

.date {
  font-weight: 500;
  color: #1f2937;
  font-size: 0.875rem;
}

.time {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Reviewer Cell */
.reviewer-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.reviewer-avatar {
  width: 28px;
  height: 28px;
  border-radius: 0.5rem;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.reviewer-name {
  font-size: 0.875rem;
  color: #4b5563;
}

.no-reviewer {
  font-size: 0.875rem;
  color: #9ca3af;
  font-style: italic;
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
}

.action-btn.view {
  color: #3b82f6;
}

.action-btn.view:hover {
  background: #dbeafe;
  border-color: #3b82f6;
}

.action-btn.assign {
  color: #8b5cf6;
}

.action-btn.assign:hover {
  background: #f3e8ff;
  border-color: #8b5cf6;
}

.action-btn.approve {
  color: #10b981;
}

.action-btn.approve:hover {
  background: #dcfce7;
  border-color: #10b981;
}

.action-btn.reject {
  color: #ef4444;
}

.action-btn.reject:hover {
  background: #fee2e2;
  border-color: #ef4444;
}

.action-btn.download {
  color: #6b7280;
}

.action-btn.download:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
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

.bulk-btn.assign {
  background: #8b5cf6;
  color: white;
  border: none;
}

.bulk-btn.assign:hover {
  background: #7c3aed;
}

.bulk-btn.download {
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.bulk-btn.download:hover {
  background: #f3f4f6;
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
  
  .verification-tabs {
    overflow-x: auto;
    padding-bottom: 0;
  }
  
  .tab-btn {
    white-space: nowrap;
    padding: 0.75rem 1rem;
  }
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select,
  .date-input {
    width: 100%;
  }
  
  .search-box {
    width: 100%;
  }
}
</style>
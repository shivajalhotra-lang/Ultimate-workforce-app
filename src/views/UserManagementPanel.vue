<template>
  <div class="user-management-panel">
    <!-- Filters and Search -->
    <div class="filters-section">
      <div class="search-box">
        <Search class="search-icon" />
        <input v-model="searchQuery" 
               type="text" 
               placeholder="Search by name, phone, or ID..."
               class="search-input">
      </div>
      
      <div class="filter-controls">
        <select v-model="selectedRole" class="filter-select">
          <option value="">All Roles</option>
          <option value="worker">Workers</option>
          <option value="employer">Employers</option>
          <option value="admin">Admins</option>
        </select>
        
        <select v-model="selectedStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
        
        <button @click="exportUsers" class="export-btn">
          <Download class="w-4 h-4" />
          Export
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="users-table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" 
                     v-model="selectAll"
                     @change="toggleSelectAll">
            </th>
            <th>User</th>
            <th>Role</th>
            <th>Phone</th>
            <th>Location</th>
            <th>Status</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" 
              :key="user.id"
              :class="{ 'selected': selectedUsers.includes(user.id) }">
            <td>
              <input type="checkbox" 
                     :value="user.id"
                     v-model="selectedUsers">
            </td>
            <td>
              <div class="user-cell">
                <div class="user-avatar" :style="{ background: user.avatarColor }">
                  {{ user.name.charAt(0) }}
                </div>
                <div class="user-info">
                  <div class="user-name">{{ user.name }}</div>
                  <div class="user-id">ID: {{ user.id }}</div>
                </div>
              </div>
            </td>
            <td>
              <div :class="`role-badge role-${user.role}`">
                {{ user.role }}
              </div>
            </td>
            <td>{{ user.phone }}</td>
            <td>{{ user.location }}</td>
            <td>
              <div class="status-cell">
                <div :class="`status-dot status-${user.status}`"></div>
                <span>{{ user.status }}</span>
                <span v-if="user.kycVerified" class="kyc-badge">KYC</span>
              </div>
            </td>
            <td>{{ formatDate(user.joinedDate) }}</td>
            <td>
              <div class="action-buttons">
                <button @click="viewUser(user.id)" 
                        class="action-btn view"
                        title="View Profile">
                  <Eye class="w-4 h-4" />
                </button>
                <button @click="toggleUserStatus(user.id)" 
                        class="action-btn toggle"
                        :title="user.status === 'verified' ? 'Suspend' : 'Verify'">
                  <component :is="user.status === 'verified' ? UserX : UserCheck" 
                           class="w-4 h-4" />
                </button>
                <button @click="sendMessage(user.id)" 
                        class="action-btn message"
                        title="Send Message">
                  <MessageSquare class="w-4 h-4" />
                </button>
                <button @click="showMoreActions(user)" 
                        class="action-btn more"
                        title="More Actions">
                  <MoreVertical class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedUsers.length > 0" class="bulk-actions">
      <div class="selected-count">
        {{ selectedUsers.length }} users selected
      </div>
      <div class="bulk-buttons">
        <button @click="bulkVerify" class="bulk-btn verify">
          <UserCheck class="w-4 h-4" />
          Verify Selected
        </button>
        <button @click="bulkSuspend" class="bulk-btn suspend">
          <UserX class="w-4 h-4" />
          Suspend Selected
        </button>
        <button @click="bulkMessage" class="bulk-btn message">
          <MessageSquare class="w-4 h-4" />
          Message Selected
        </button>
        <button @click="clearSelection" class="bulk-btn clear">
          Clear Selection
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button @click="prevPage" 
              :disabled="currentPage === 1"
              class="pagination-btn">
        <ChevronLeft class="w-4 h-4" />
      </button>
      
      <div class="page-numbers">
        <button v-for="page in visiblePages" 
                :key="page"
                @click="goToPage(page)"
                :class="['page-btn', { active: currentPage === page }]">
          {{ page }}
        </button>
        <span v-if="showEllipsis" class="ellipsis">...</span>
      </div>
      
      <button @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="pagination-btn">
        <ChevronRight class="w-4 h-4" />
      </button>
      
      <div class="page-info">
        Showing {{ startItem }}-{{ endItem }} of {{ totalUsers }}
      </div>
    </div>

    <!-- User Details Modal -->
    <UserDetailsModal v-if="selectedUser" 
                      :user="selectedUser"
                      @close="selectedUser = null"
                      @update="handleUserUpdate" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Search, Download, Eye, UserCheck, UserX, 
  MessageSquare, MoreVertical, ChevronLeft, ChevronRight
} from 'lucide-vue-next'
import UserDetailsModal from './UserDetailsModal.vue'

// State
const searchQuery = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const selectedUsers = ref([])
const selectAll = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedUser = ref(null)

// Sample users data
const users = ref([
  {
    id: 'W001',
    name: 'Ramesh Kumar',
    role: 'worker',
    phone: '9876543210',
    location: 'Rudrapur',
    status: 'verified',
    kycVerified: true,
    joinedDate: '2024-01-15',
    avatarColor: '#3b82f6'
  },
  {
    id: 'E001',
    name: 'ABC Enterprises',
    role: 'employer',
    phone: '9876543211',
    location: 'Industrial Area',
    status: 'verified',
    kycVerified: true,
    joinedDate: '2024-01-10',
    avatarColor: '#10b981'
  },
  {
    id: 'W002',
    name: 'Suresh Singh',
    role: 'worker',
    phone: '9876543212',
    location: 'Civil Lines',
    status: 'pending',
    kycVerified: false,
    joinedDate: '2024-01-20',
    avatarColor: '#8b5cf6'
  },
  {
    id: 'W003',
    name: 'Priya Sharma',
    role: 'worker',
    phone: '9876543213',
    location: 'Market Road',
    status: 'verified',
    kycVerified: true,
    joinedDate: '2024-01-05',
    avatarColor: '#ec4899'
  },
  {
    id: 'E002',
    name: 'XYZ Contractors',
    role: 'employer',
    phone: '9876543214',
    location: 'Construction Zone',
    status: 'suspended',
    kycVerified: true,
    joinedDate: '2023-12-15',
    avatarColor: '#f59e0b'
  }
])

// Computed
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = searchQuery.value === '' || 
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.phone.includes(searchQuery.value) ||
      user.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesRole = selectedRole.value === '' || user.role === selectedRole.value
    const matchesStatus = selectedStatus.value === '' || user.status === selectedStatus.value
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

const totalUsers = computed(() => filteredUsers.value.length)
const totalPages = computed(() => Math.ceil(totalUsers.value / pageSize.value))

const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endItem = computed(() => {
  const end = currentPage.value * pageSize.value
  return end > totalUsers.value ? totalUsers.value : end
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

const showEllipsis = computed(() => totalPages.value > visiblePages.value.length + 1)

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedUsers.value = filteredUsers.value.map(user => user.id)
  } else {
    selectedUsers.value = []
  }
}

const viewUser = (userId) => {
  selectedUser.value = users.value.find(u => u.id === userId)
}

const toggleUserStatus = (userId) => {
  const user = users.value.find(u => u.id === userId)
  if (user) {
    user.status = user.status === 'verified' ? 'suspended' : 'verified'
  }
}

const sendMessage = (userId) => {
  console.log('Sending message to user:', userId)
  // Implement messaging
}

const showMoreActions = (user) => {
  console.log('More actions for:', user.name)
  // Show dropdown menu
}

const bulkVerify = () => {
  users.value.forEach(user => {
    if (selectedUsers.value.includes(user.id)) {
      user.status = 'verified'
    }
  })
  selectedUsers.value = []
  selectAll.value = false
}

const bulkSuspend = () => {
  users.value.forEach(user => {
    if (selectedUsers.value.includes(user.id)) {
      user.status = 'suspended'
    }
  })
  selectedUsers.value = []
  selectAll.value = false
}

const bulkMessage = () => {
  console.log('Bulk message to:', selectedUsers.value)
  // Implement bulk messaging
}

const clearSelection = () => {
  selectedUsers.value = []
  selectAll.value = false
}

const exportUsers = () => {
  console.log('Exporting users data...')
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

const handleUserUpdate = (updatedUser) => {
  const index = users.value.findIndex(u => u.id === updatedUser.id)
  if (index !== -1) {
    users.value[index] = { ...users.value[index], ...updatedUser }
  }
}

onMounted(() => {
  console.log('User management panel loaded')
})
</script>

<style scoped>
.user-management-panel {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
}

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

.users-table-container {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: auto;
  margin-bottom: 1.5rem;
  max-height: 500px;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.users-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 2px solid #e5e7eb;
  position: sticky;
  top: 0;
}

.users-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.users-table tr:hover {
  background: #f9fafb;
}

.users-table tr.selected {
  background: #dbeafe;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
}

.user-id {
  font-size: 0.75rem;
  color: #6b7280;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.role-worker {
  background: #dbeafe;
  color: #1e40af;
}

.role-employer {
  background: #dcfce7;
  color: #166534;
}

.role-admin {
  background: #f3e8ff;
  color: #7c3aed;
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-verified {
  background: #10b981;
}

.status-pending {
  background: #f59e0b;
}

.status-suspended {
  background: #ef4444;
}

.kyc-badge {
  background: #dbeafe;
  color: #1e40af;
  font-size: 0.625rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-weight: 600;
}

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

.action-btn.toggle {
  color: #10b981;
}

.action-btn.toggle:hover {
  background: #dcfce7;
  border-color: #10b981;
}

.action-btn.message {
  color: #8b5cf6;
}

.action-btn.message:hover {
  background: #f3e8ff;
  border-color: #8b5cf6;
}

.action-btn.more {
  color: #6b7280;
}

.action-btn.more:hover {
  background: #f3f4f6;
  border-color: #6b7280;
}

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

.bulk-btn.verify {
  background: #10b981;
  color: white;
  border: none;
}

.bulk-btn.verify:hover {
  background: #0da271;
}

.bulk-btn.suspend {
  background: #ef4444;
  color: white;
  border: none;
}

.bulk-btn.suspend:hover {
  background: #dc2626;
}

.bulk-btn.message {
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.bulk-btn.message:hover {
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

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
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

.ellipsis {
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  color: #6b7280;
}

.page-info {
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
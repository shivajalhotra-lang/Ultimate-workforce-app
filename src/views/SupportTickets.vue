<template>
  <div class="support-tickets">
    <!-- Header -->
    <div class="management-header">
      <div class="header-left">
        <h1 class="page-title">Support Tickets</h1>
        <p class="page-subtitle">Manage customer support requests and issues</p>
      </div>
      <div class="header-right">
        <div class="urgent-badge" v-if="urgentTickets > 0">
          <AlertCircle class="w-4 h-4" />
          <span>{{ urgentTickets }} Urgent</span>
        </div>
        <button @click="refreshTickets" class="refresh-btn" :disabled="loading">
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon bg-blue-100">
          <MessageSquare class="w-6 h-6 text-blue-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Total Tickets</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-orange-100">
          <Clock class="w-6 h-6 text-orange-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.open }}</div>
          <div class="stat-label">Open</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-green-100">
          <CheckCircle class="w-6 h-6 text-green-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.resolved }}</div>
          <div class="stat-label">Resolved</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-red-100">
          <AlertCircle class="w-6 h-6 text-red-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.urgent }}</div>
          <div class="stat-label">Urgent</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <div class="actions-grid">
        <button @click="filterTickets('open')" class="action-btn" :class="{ active: activeFilter === 'open' }">
          <Inbox class="w-5 h-5" />
          <span>Open Tickets</span>
          <span class="count">{{ stats.open }}</span>
        </button>
        
        <button @click="filterTickets('assigned')" class="action-btn" :class="{ active: activeFilter === 'assigned' }">
          <UserCheck class="w-5 h-5" />
          <span>Assigned to Me</span>
          <span class="count">{{ assignedTickets }}</span>
        </button>
        
        <button @click="filterTickets('urgent')" class="action-btn" :class="{ active: activeFilter === 'urgent' }">
          <AlertCircle class="w-5 h-5" />
          <span>Urgent</span>
          <span class="count">{{ stats.urgent }}</span>
        </button>
        
        <button @click="createNewTicket" class="action-btn create">
          <Plus class="w-5 h-5" />
          <span>Create Ticket</span>
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
          placeholder="Search tickets by ID, subject, or user..."
          class="search-input"
        />
      </div>
      
      <div class="filter-controls">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">All Categories</option>
          <option value="technical">Technical</option>
          <option value="billing">Billing</option>
          <option value="account">Account</option>
          <option value="job">Job Related</option>
          <option value="other">Other</option>
        </select>
        
        <select v-model="selectedPriority" class="filter-select">
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
        
        <select v-model="selectedStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        
        <button @click="clearFilters" class="clear-filters-btn">
          <X class="w-4 h-4" />
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="table-container">
      <table class="tickets-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
            </th>
            <th>Ticket ID</th>
            <th>Subject</th>
            <th>User</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Created</th>
            <th>Last Update</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in paginatedTickets" :key="ticket.id" :class="{ 'urgent-row': ticket.priority === 'urgent' }">
            <td>
              <input type="checkbox" :value="ticket.id" v-model="selectedTickets">
            </td>
            <td>
              <div class="ticket-id">{{ ticket.id }}</div>
            </td>
            <td>
              <div class="subject-cell">
                <div class="subject">{{ ticket.subject }}</div>
                <div class="preview">{{ truncateText(ticket.preview, 60) }}</div>
              </div>
            </td>
            <td>
              <div class="user-cell">
                <div class="user-avatar" :style="{ background: ticket.user.avatarColor }">
                  {{ ticket.user.name.charAt(0) }}
                </div>
                <div class="user-info">
                  <div class="user-name">{{ ticket.user.name }}</div>
                  <div class="user-role">{{ ticket.user.role }}</div>
                </div>
              </div>
            </td>
            <td>
              <div :class="`category-badge category-${ticket.category}`">
                {{ formatCategory(ticket.category) }}
              </div>
            </td>
            <td>
              <div :class="`priority-badge priority-${ticket.priority}`">
                <div class="priority-dot"></div>
                {{ ticket.priority }}
              </div>
            </td>
            <td>
              <div :class="`status-badge status-${ticket.status}`">
                {{ formatStatus(ticket.status) }}
              </div>
            </td>
            <td>
              <div class="date-cell">
                <div class="date">{{ formatDate(ticket.createdDate) }}</div>
                <div class="time">{{ ticket.createdTime }}</div>
              </div>
            </td>
            <td>
              <div class="date-cell">
                <div class="date">{{ formatDate(ticket.updatedDate) }}</div>
                <div class="time">{{ ticket.updatedTime }}</div>
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="viewTicket(ticket)" class="action-btn view" title="View Ticket">
                  <Eye class="w-4 h-4" />
                </button>
                <button 
                  v-if="ticket.status === 'open'"
                  @click="assignToMe(ticket)" 
                  class="action-btn assign" 
                  title="Assign to Me"
                >
                  <UserPlus class="w-4 h-4" />
                </button>
                <button 
                  v-if="ticket.status === 'open' || ticket.status === 'in_progress'"
                  @click="startProgress(ticket)" 
                  class="action-btn progress" 
                  title="Start Progress"
                >
                  <Play class="w-4 h-4" />
                </button>
                <button 
                  v-if="ticket.status === 'in_progress'"
                  @click="resolveTicket(ticket)" 
                  class="action-btn resolve" 
                  title="Resolve"
                >
                  <Check class="w-4 h-4" />
                </button>
                <button @click="replyTicket(ticket)" class="action-btn reply" title="Reply">
                  <Reply class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredTickets.length === 0 && !loading" class="empty-state">
      <Inbox class="w-16 h-16 text-gray-300" />
      <h3>No tickets found</h3>
      <p v-if="activeFilter">No {{ activeFilter }} tickets at the moment</p>
      <p v-else>Try adjusting your filters</p>
      <button @click="createNewTicket" class="create-ticket-btn">
        <Plus class="w-4 h-4" />
        Create New Ticket
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <RefreshCw class="w-8 h-8 animate-spin text-blue-500" />
      <span>Loading tickets...</span>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedTickets.length > 0" class="bulk-actions">
      <div class="selected-count">
        {{ selectedTickets.length }} tickets selected
      </div>
      <div class="bulk-buttons">
        <button @click="bulkAssign" class="bulk-btn assign">
          <UserPlus class="w-4 h-4" />
          Assign to Me
        </button>
        <button @click="bulkStartProgress" class="bulk-btn progress">
          <Play class="w-4 h-4" />
          Start Progress
        </button>
        <button @click="bulkResolve" class="bulk-btn resolve">
          <Check class="w-4 h-4" />
          Resolve Selected
        </button>
        <button @click="bulkClose" class="bulk-btn close">
          <X class="w-4 h-4" />
          Close Selected
        </button>
        <button @click="clearSelection" class="bulk-btn clear">
          Clear Selection
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <div class="page-info">
        Showing {{ startItem }}-{{ endItem }} of {{ filteredTickets.length }} tickets
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

    <!-- Ticket Details Modal -->
    <TicketDetailsModal 
      v-if="selectedTicket"
      :ticket="selectedTicket"
      @close="selectedTicket = null"
      @update="handleTicketUpdate"
    />

    <!-- New Ticket Modal -->
    <NewTicketModal 
      v-if="showNewTicketModal"
      @close="showNewTicketModal = false"
      @save="handleNewTicket"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Search,
  RefreshCw,
  Eye,
  UserPlus,
  Play,
  Check,
  Reply,
  X,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Inbox,
  UserCheck,
  Plus,
  Bell
} from 'lucide-vue-next'
import TicketDetailsModal from '@/components/modals/TicketDetailsModal.vue'
import NewTicketModal from '@/components/modals/NewTicketModal.vue'

// State
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedPriority = ref('')
const selectedStatus = ref('')
const activeFilter = ref('')
const selectedTickets = ref([])
const selectAll = ref(false)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedTicket = ref(null)
const showNewTicketModal = ref(false)

// Current admin
const currentAdmin = ref({
  id: 'ADMIN001',
  name: 'Admin User'
})

// Sample data
const tickets = ref([
  {
    id: 'TICKET001',
    subject: 'Payment not received',
    preview: 'I completed the job but haven\'t received payment yet.',
    category: 'billing',
    priority: 'urgent',
    status: 'open',
    createdDate: '2024-01-20',
    createdTime: '10:30 AM',
    updatedDate: '2024-01-20',
    updatedTime: '10:30 AM',
    user: {
      id: 'W001',
      name: 'Ramesh Kumar',
      role: 'worker',
      avatarColor: '#3b82f6'
    },
    assignedTo: null
  },
  {
    id: 'TICKET002',
    subject: 'Account verification issue',
    preview: 'My KYC verification is stuck for 3 days.',
    category: 'account',
    priority: 'high',
    status: 'in_progress',
    createdDate: '2024-01-19',
    createdTime: '02:45 PM',
    updatedDate: '2024-01-20',
    updatedTime: '09:15 AM',
    user: {
      id: 'E001',
      name: 'ABC Enterprises',
      role: 'employer',
      avatarColor: '#10b981'
    },
    assignedTo: {
      id: 'ADMIN001',
      name: 'Admin User'
    }
  },
  {
    id: 'TICKET003',
    subject: 'Job posting not visible',
    preview: 'I posted a job but it\'s not showing in search results.',
    category: 'technical',
    priority: 'medium',
    status: 'resolved',
    createdDate: '2024-01-18',
    createdTime: '11:15 AM',
    updatedDate: '2024-01-19',
    updatedTime: '03:30 PM',
    user: {
      id: 'E002',
      name: 'XYZ Contractors',
      role: 'employer',
      avatarColor: '#f59e0b'
    },
    assignedTo: {
      id: 'ADMIN001',
      name: 'Admin User'
    }
  },
  {
    id: 'TICKET004',
    subject: 'App crashing on login',
    preview: 'The mobile app crashes every time I try to login.',
    category: 'technical',
    priority: 'high',
    status: 'open',
    createdDate: '2024-01-17',
    createdTime: '04:20 PM',
    updatedDate: '2024-01-17',
    updatedTime: '04:20 PM',
    user: {
      id: 'W002',
      name: 'Suresh Singh',
      role: 'worker',
      avatarColor: '#8b5cf6'
    },
    assignedTo: null
  },
  {
    id: 'TICKET005',
    subject: 'Need to update profile',
    preview: 'How can I update my profile picture?',
    category: 'account',
    priority: 'low',
    status: 'closed',
    createdDate: '2024-01-16',
    createdTime: '09:00 AM',
    updatedDate: '2024-01-16',
    updatedTime: '11:45 AM',
    user: {
      id: 'W003',
      name: 'Priya Sharma',
      role: 'worker',
      avatarColor: '#ec4899'
    },
    assignedTo: {
      id: 'ADMIN001',
      name: 'Admin User'
    }
  }
])

// Computed Properties
const stats = computed(() => {
  const total = tickets.value.length
  const open = tickets.value.filter(t => t.status === 'open').length
  const resolved = tickets.value.filter(t => t.status === 'resolved').length
  const urgent = tickets.value.filter(t => t.priority === 'urgent').length
  
  return { total, open, resolved, urgent }
})

const urgentTickets = computed(() => stats.value.urgent)

const assignedTickets = computed(() => {
  return tickets.value.filter(t => 
    t.assignedTo && t.assignedTo.id === currentAdmin.value.id
  ).length
})

const filteredTickets = computed(() => {
  let filtered = tickets.value

  // Apply active filter
  if (activeFilter.value === 'open') {
    filtered = filtered.filter(t => t.status === 'open')
  } else if (activeFilter.value === 'assigned') {
    filtered = filtered.filter(t => 
      t.assignedTo && t.assignedTo.id === currentAdmin.value.id
    )
  } else if (activeFilter.value === 'urgent') {
    filtered = filtered.filter(t => t.priority === 'urgent')
  }

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(ticket =>
      ticket.id.toLowerCase().includes(query) ||
      ticket.subject.toLowerCase().includes(query) ||
      ticket.preview.toLowerCase().includes(query) ||
      ticket.user.name.toLowerCase().includes(query)
    )
  }

  // Apply filters
  if (selectedCategory.value) {
    filtered = filtered.filter(t => t.category === selectedCategory.value)
  }
  if (selectedPriority.value) {
    filtered = filtered.filter(t => t.priority === selectedPriority.value)
  }
  if (selectedStatus.value) {
    filtered = filtered.filter(t => t.status === selectedStatus.value)
  }

  return filtered
})

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredTickets.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredTickets.value.length / pageSize.value))

const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endItem = computed(() => {
  const end = currentPage.value * pageSize.value
  return end > filteredTickets.value.length ? filteredTickets.value.length : end
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

const formatCategory = (category) => {
  const categoryMap = {
    technical: 'Technical',
    billing: 'Billing',
    account: 'Account',
    job: 'Job Related',
    other: 'Other'
  }
  return categoryMap[category] || category
}

const formatStatus = (status) => {
  const statusMap = {
    open: 'Open',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    closed: 'Closed'
  }
  return statusMap[status] || status
}

const truncateText = (text, length) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedTickets.value = paginatedTickets.value.map(t => t.id)
  } else {
    selectedTickets.value = []
  }
}

const refreshTickets = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Failed to refresh tickets:', error)
  } finally {
    loading.value = false
  }
}

const filterTickets = (filter) => {
  activeFilter.value = activeFilter.value === filter ? '' : filter
  currentPage.value = 1
}

const createNewTicket = () => {
  showNewTicketModal.value = true
}

const viewTicket = (ticket) => {
  selectedTicket.value = ticket
}

const assignToMe = (ticket) => {
  ticket.assignedTo = { ...currentAdmin.value }
  ticket.status = 'in_progress'
  ticket.updatedDate = new Date().toISOString().split('T')[0]
  ticket.updatedTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

const startProgress = (ticket) => {
  if (!ticket.assignedTo) {
    ticket.assignedTo = { ...currentAdmin.value }
  }
  ticket.status = 'in_progress'
  ticket.updatedDate = new Date().toISOString().split('T')[0]
  ticket.updatedTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

const resolveTicket = (ticket) => {
  if (confirm(`Resolve ticket "${ticket.subject}"?`)) {
    ticket.status = 'resolved'
    ticket.updatedDate = new Date().toISOString().split('T')[0]
    ticket.updatedTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }
}

const replyTicket = (ticket) => {
  selectedTicket.value = ticket
}

const handleNewTicket = (newTicket) => {
  tickets.value.unshift({
    ...newTicket,
    id: `TICKET${String(tickets.value.length + 1).padStart(3, '0')}`,
    createdDate: new Date().toISOString().split('T')[0],
    createdTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    updatedDate: new Date().toISOString().split('T')[0],
    updatedTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'open',
    assignedTo: null
  })
  showNewTicketModal.value = false
}

const handleTicketUpdate = (updatedTicket) => {
  const index = tickets.value.findIndex(t => t.id === updatedTicket.id)
  if (index !== -1) {
    tickets.value[index] = { ...tickets.value[index], ...updatedTicket }
  }
}

const bulkAssign = () => {
  tickets.value.forEach(ticket => {
    if (selectedTickets.value.includes(ticket.id) && !ticket.assignedTo) {
      ticket.assignedTo = { ...currentAdmin.value }
      if (ticket.status === 'open') {
        ticket.status = 'in_progress'
      }
    }
  })
  clearSelection()
}

const bulkStartProgress = () => {
  tickets.value.forEach(ticket => {
    if (selectedTickets.value.includes(ticket.id) && (ticket.status === 'open' || ticket.status === 'in_progress')) {
      if (!ticket.assignedTo) {
        ticket.assignedTo = { ...currentAdmin.value }
      }
      ticket.status = 'in_progress'
    }
  })
  clearSelection()
}

const bulkResolve = () => {
  if (confirm(`Resolve ${selectedTickets.value.length} tickets?`)) {
    tickets.value.forEach(ticket => {
      if (selectedTickets.value.includes(ticket.id) && (ticket.status === 'open' || ticket.status === 'in_progress')) {
        ticket.status = 'resolved'
      }
    })
    clearSelection()
  }
}

const bulkClose = () => {
  if (confirm(`Close ${selectedTickets.value.length} tickets?`)) {
    tickets.value.forEach(ticket => {
      if (selectedTickets.value.includes(ticket.id)) {
        ticket.status = 'closed'
      }
    })
    clearSelection()
  }
}

const clearSelection = () => {
  selectedTickets.value = []
  selectAll.value = false
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedPriority.value = ''
  selectedStatus.value = ''
  activeFilter.value = ''
  currentPage.value = 1
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
  refreshTickets()
})
</script>

<style scoped>
.support-tickets {
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

.urgent-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #fee2e2;
  color: #991b1b;
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

.stat-content {
  flex: 1;
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

/* Quick Actions */
.quick-actions {
  margin-bottom: 2rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.75rem;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.action-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.action-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.action-btn.active .count {
  background: rgba(255, 255, 255, 0.2);
}

.action-btn.create {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.action-btn.create:hover {
  background: #0da271;
}

.count {
  margin-left: auto;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.action-btn.active .count {
  background: rgba(255, 255, 255, 0.3);
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

.tickets-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.tickets-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 2px solid #e5e7eb;
  position: sticky;
  top: 0;
}

.tickets-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.tickets-table tr:hover {
  background: #f9fafb;
}

.tickets-table tr.urgent-row {
  background: #fef2f2;
}

.tickets-table tr.urgent-row:hover {
  background: #fee2e2;
}

/* Ticket ID */
.ticket-id {
  font-family: 'Monospace', monospace;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

/* Subject Cell */
.subject-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.subject {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.preview {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
}

/* User Cell */
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  font-size: 0.875rem;
  color: #1f2937;
}

.user-role {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: capitalize;
}

/* Category Badge */
.category-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.category-technical {
  background: #dbeafe;
  color: #1e40af;
}

.category-billing {
  background: #fef3c7;
  color: #92400e;
}

.category-account {
  background: #dcfce7;
  color: #166534;
}

.category-job {
  background: #f3e8ff;
  color: #7c3aed;
}

.category-other {
  background: #f3f4f6;
  color: #4b5563;
}

/* Priority Badge */
.priority-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.priority-urgent {
  background: #fee2e2;
  color: #991b1b;
}

.priority-urgent .priority-dot {
  background: #ef4444;
}

.priority-high {
  background: #fef3c7;
  color: #92400e;
}

.priority-high .priority-dot {
  background: #f59e0b;
}

.priority-medium {
  background: #dbeafe;
  color: #1e40af;
}

.priority-medium .priority-dot {
  background: #3b82f6;
}

.priority-low {
  background: #f3f4f6;
  color: #4b5563;
}

.priority-low .priority-dot {
  background: #9ca3af;
}

/* Status Badge */
.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.status-open {
  background: #fef3c7;
  color: #92400e;
}

.status-in_progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-resolved {
  background: #dcfce7;
  color: #166534;
}

.status-closed {
  background: #f3f4f6;
  color: #4b5563;
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

.action-btn.progress {
  color: #10b981;
}

.action-btn.progress:hover {
  background: #dcfce7;
  border-color: #10b981;
}

.action-btn.resolve {
  color: #059669;
}

.action-btn.resolve:hover {
  background: #d1fae5;
  border-color: #059669;
}

.action-btn.reply {
  color: #6b7280;
}

.action-btn.reply:hover {
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
  margin-bottom: 1.5rem;
}

.create-ticket-btn {
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

.create-ticket-btn:hover {
  background: #2563eb;
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

.bulk-btn.assign {
  background: #8b5cf6;
  color: white;
  border: none;
}

.bulk-btn.assign:hover {
  background: #7c3aed;
}

.bulk-btn.progress {
  background: #10b981;
  color: white;
  border: none;
}

.bulk-btn.progress:hover {
  background: #0da271;
}

.bulk-btn.resolve {
  background: #059669;
  color: white;
  border: none;
}

.bulk-btn.resolve:hover {
  background: #047857;
}

.bulk-btn.close {
  background: #ef4444;
  color: white;
  border: none;
}

.bulk-btn.close:hover {
  background: #dc2626;
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
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select {
    width: 100%;
  }
  
  .search-box {
    width: 100%;
  }
}
</style>
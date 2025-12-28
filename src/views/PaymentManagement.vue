<template>
  <div class="payment-management">
    <!-- Header -->
    <div class="management-header">
      <div class="header-left">
        <h1 class="page-title">Payment Management</h1>
        <p class="page-subtitle">Track payments, wages, and financial transactions</p>
      </div>
      <div class="header-right">
        <button @click="showPaymentModal" class="create-payment-btn">
          <Plus class="w-4 h-4" />
          Add Payment
        </button>
        <button @click="exportPayments" class="export-btn">
          <Download class="w-4 h-4" />
          Export
        </button>
        <button @click="refreshPayments" class="refresh-btn" :disabled="loading">
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': loading }" />
        </button>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="stats-overview">
      <div class="stat-card">
        <div class="stat-icon bg-green-100">
          <DollarSign class="w-6 h-6 text-green-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">₹{{ stats.totalAmount.toLocaleString() }}</div>
          <div class="stat-label">Total Processed</div>
          <div class="stat-change positive">+8.5% from last month</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-blue-100">
          <CheckCircle class="w-6 h-6 text-blue-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completedPayments }}</div>
          <div class="stat-label">Completed</div>
          <div class="stat-change positive">+12% from last month</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-orange-100">
          <Clock class="w-6 h-6 text-orange-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingPayments }}</div>
          <div class="stat-label">Pending</div>
          <div class="stat-change negative">-3% from last month</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon bg-red-100">
          <AlertCircle class="w-6 h-6 text-red-600" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.failedPayments }}</div>
          <div class="stat-label">Failed</div>
          <div class="stat-change">No change</div>
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
          placeholder="Search by ID, user, or reference..."
          class="search-input"
        />
      </div>
      
      <div class="filter-controls">
        <select v-model="selectedStatus" class="filter-select">
          <option value="">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="processing">Processing</option>
        </select>
        
        <select v-model="selectedType" class="filter-select">
          <option value="">All Types</option>
          <option value="salary">Salary/Wage</option>
          <option value="refund">Refund</option>
          <option value="bonus">Bonus</option>
          <option value="commission">Commission</option>
          <option value="other">Other</option>
        </select>
        
        <input 
          type="date" 
          v-model="dateFrom" 
          class="date-input"
          placeholder="From Date"
        />
        
        <input 
          type="date" 
          v-model="dateTo" 
          class="date-input"
          placeholder="To Date"
        />
        
        <button @click="clearFilters" class="clear-filters-btn">
          <X class="w-4 h-4" />
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Payment Methods Distribution -->
    <div class="distribution-section">
      <h3 class="section-title">Payment Methods</h3>
      <div class="method-distribution">
        <div v-for="method in paymentMethods" :key="method.name" class="method-item">
          <div class="method-icon" :style="{ background: method.color }">
            <component :is="method.icon" class="w-5 h-5 text-white" />
          </div>
          <div class="method-info">
            <div class="method-name">{{ method.name }}</div>
            <div class="method-stats">
              <span class="method-count">{{ method.count }} payments</span>
              <span class="method-amount">₹{{ method.amount.toLocaleString() }}</span>
            </div>
            <div class="method-bar">
              <div class="bar-fill" :style="{ width: method.percentage + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payments Table -->
    <div class="table-container">
      <table class="payments-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
            </th>
            <th>Transaction ID</th>
            <th>User</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Method</th>
            <th>Status</th>
            <th>Date</th>
            <th>Reference</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="payment in paginatedPayments" :key="payment.id">
            <td>
              <input type="checkbox" :value="payment.id" v-model="selectedPayments">
            </td>
            <td>
              <div class="transaction-id">{{ payment.id }}</div>
              <div class="transaction-note" v-if="payment.note">{{ payment.note }}</div>
            </td>
            <td>
              <div class="user-cell">
                <div class="user-avatar" :style="{ background: payment.user.avatarColor }">
                  {{ payment.user.name.charAt(0) }}
                </div>
                <div class="user-info">
                  <div class="user-name">{{ payment.user.name }}</div>
                  <div class="user-role">{{ payment.user.role }}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="amount-cell">
                <div class="amount-value">₹{{ payment.amount.toLocaleString() }}</div>
                <div class="amount-tax" v-if="payment.tax">+₹{{ payment.tax }} tax</div>
              </div>
            </td>
            <td>
              <div :class="`type-badge type-${payment.type}`">
                {{ payment.type }}
              </div>
            </td>
            <td>
              <div class="method-cell">
                <div :class="`method-badge method-${payment.method}`">
                  {{ formatMethod(payment.method) }}
                </div>
              </div>
            </td>
            <td>
              <div class="status-cell">
                <div :class="`status-indicator status-${payment.status}`"></div>
                <span>{{ payment.status }}</span>
              </div>
            </td>
            <td>
              <div class="date-cell">
                <div class="date">{{ formatDate(payment.date) }}</div>
                <div class="time">{{ payment.time }}</div>
              </div>
            </td>
            <td>
              <div class="reference-cell">
                <div v-if="payment.jobId" class="reference-job">
                  Job: {{ payment.jobId }}
                </div>
                <div v-if="payment.invoiceId" class="reference-invoice">
                  Invoice: {{ payment.invoiceId }}
                </div>
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button @click="viewPaymentDetails(payment)" class="action-btn view" title="View Details">
                  <Eye class="w-4 h-4" />
                </button>
                <button @click="downloadReceipt(payment)" class="action-btn download" title="Download Receipt">
                  <Download class="w-4 h-4" />
                </button>
                <button @click="retryPayment(payment)" 
                        v-if="payment.status === 'failed' || payment.status === 'pending'"
                        class="action-btn retry" 
                        title="Retry Payment">
                  <RefreshCw class="w-4 h-4" />
                </button>
                <button @click="refundPayment(payment)" 
                        v-if="payment.status === 'completed' && payment.refundable"
                        class="action-btn refund" 
                        title="Issue Refund">
                  <Undo2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPayments.length === 0 && !loading" class="empty-state">
      <CreditCard class="w-16 h-16 text-gray-300" />
      <h3>No payments found</h3>
      <p>Try adjusting your filters</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <RefreshCw class="w-8 h-8 animate-spin text-blue-500" />
      <span>Loading payments...</span>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedPayments.length > 0" class="bulk-actions">
      <div class="selected-count">
        {{ selectedPayments.length }} payments selected
      </div>
      <div class="bulk-buttons">
        <button @click="bulkApprove" class="bulk-btn approve">
          <Check class="w-4 h-4" />
          Approve Selected
        </button>
        <button @click="bulkMarkAsPaid" class="bulk-btn mark-paid">
          <DollarSign class="w-4 h-4" />
          Mark as Paid
        </button>
        <button @click="bulkExport" class="bulk-btn export">
          <Download class="w-4 h-4" />
          Export Selected
        </button>
        <button @click="clearSelection" class="bulk-btn clear">
          Clear Selection
        </button>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <div class="page-info">
        Showing {{ startItem }}-{{ endItem }} of {{ filteredPayments.length }} payments
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

    <!-- Payment Details Modal -->
    <PaymentDetailsModal 
      v-if="selectedPaymentDetails"
      :payment="selectedPaymentDetails"
      @close="selectedPaymentDetails = null"
      @update="handlePaymentUpdate"
    />

    <!-- Add Payment Modal -->
    <AddPaymentModal 
      v-if="showAddPaymentModal"
      @close="showAddPaymentModal = false"
      @save="handleNewPayment"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  Search,
  Download,
  Plus,
  RefreshCw,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Undo2,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Smartphone,
  Building,
  Wallet,
  AlertTriangle
} from 'lucide-vue-next'
import PaymentDetailsModal from '@/components/modals/PaymentDetailsModal.vue'
import AddPaymentModal from '@/components/modals/AddPaymentModal.vue'

// State
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const selectedPayments = ref([])
const selectAll = ref(false)
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedPaymentDetails = ref(null)
const showAddPaymentModal = ref(false)

// Sample data (replace with API call to your backend)
const payments = ref([
  {
    id: 'PAY001',
    amount: 18000,
    tax: 3240,
    type: 'salary',
    method: 'bank_transfer',
    status: 'completed',
    date: '2024-01-15',
    time: '10:30 AM',
    note: 'Salary for January',
    jobId: 'JOB001',
    invoiceId: 'INV001',
    refundable: true,
    user: {
      id: 'W001',
      name: 'Ramesh Kumar',
      role: 'worker',
      avatarColor: '#3b82f6'
    }
  },
  {
    id: 'PAY002',
    amount: 15000,
    tax: 2700,
    type: 'salary',
    method: 'upi',
    status: 'completed',
    date: '2024-01-15',
    time: '11:45 AM',
    note: 'Factory worker salary',
    jobId: 'JOB002',
    invoiceId: 'INV002',
    refundable: false,
    user: {
      id: 'W002',
      name: 'Suresh Singh',
      role: 'worker',
      avatarColor: '#10b981'
    }
  },
  {
    id: 'PAY003',
    amount: 20000,
    tax: 3600,
    type: 'salary',
    method: 'bank_transfer',
    status: 'pending',
    date: '2024-01-16',
    time: '09:15 AM',
    note: 'Delivery driver salary',
    jobId: 'JOB004',
    invoiceId: 'INV003',
    refundable: true,
    user: {
      id: 'W003',
      name: 'Priya Sharma',
      role: 'worker',
      avatarColor: '#8b5cf6'
    }
  },
  {
    id: 'PAY004',
    amount: 5000,
    tax: 900,
    type: 'bonus',
    method: 'wallet',
    status: 'completed',
    date: '2024-01-14',
    time: '02:20 PM',
    note: 'Performance bonus',
    refundable: false,
    user: {
      id: 'W001',
      name: 'Ramesh Kumar',
      role: 'worker',
      avatarColor: '#3b82f6'
    }
  },
  {
    id: 'PAY005',
    amount: 12000,
    tax: 2160,
    type: 'salary',
    method: 'cash',
    status: 'failed',
    date: '2024-01-17',
    time: '04:45 PM',
    note: 'Domestic helper salary',
    jobId: 'JOB003',
    invoiceId: 'INV004',
    refundable: true,
    user: {
      id: 'W004',
      name: 'Anita Verma',
      role: 'worker',
      avatarColor: '#ec4899'
    }
  }
])

// Stats
const stats = computed(() => {
  const totalAmount = payments.value.reduce((sum, p) => sum + p.amount, 0)
  const completed = payments.value.filter(p => p.status === 'completed').length
  const pending = payments.value.filter(p => p.status === 'pending').length
  const failed = payments.value.filter(p => p.status === 'failed').length
  
  return {
    totalAmount,
    completedPayments: completed,
    pendingPayments: pending,
    failedPayments: failed
  }
})

// Payment Methods Distribution
const paymentMethods = computed(() => {
  const methods = {
    bank_transfer: { name: 'Bank Transfer', icon: Building, color: '#3b82f6', count: 0, amount: 0 },
    upi: { name: 'UPI', icon: Smartphone, color: '#10b981', count: 0, amount: 0 },
    wallet: { name: 'Wallet', icon: Wallet, color: '#8b5cf6', count: 0, amount: 0 },
    cash: { name: 'Cash', icon: DollarSign, color: '#f59e0b', count: 0, amount: 0 }
  }
  
  payments.value.forEach(payment => {
    if (methods[payment.method]) {
      methods[payment.method].count++
      methods[payment.method].amount += payment.amount
    }
  })
  
  const totalAmount = Object.values(methods).reduce((sum, m) => sum + m.amount, 0)
  
  return Object.values(methods).map(method => ({
    ...method,
    percentage: totalAmount > 0 ? (method.amount / totalAmount) * 100 : 0
  }))
})

// Computed Properties
const filteredPayments = computed(() => {
  return payments.value.filter(payment => {
    const matchesSearch = searchQuery.value === '' || 
      payment.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      payment.user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (payment.note && payment.note.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesStatus = selectedStatus.value === '' || payment.status === selectedStatus.value
    const matchesType = selectedType.value === '' || payment.type === selectedType.value
    
    // Date filtering
    let matchesDate = true
    if (dateFrom.value) {
      const fromDate = new Date(dateFrom.value)
      const paymentDate = new Date(payment.date)
      matchesDate = matchesDate && paymentDate >= fromDate
    }
    if (dateTo.value) {
      const toDate = new Date(dateTo.value)
      const paymentDate = new Date(payment.date)
      matchesDate = matchesDate && paymentDate <= toDate
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate
  })
})

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPayments.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredPayments.value.length / pageSize.value))

const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1)
const endItem = computed(() => {
  const end = currentPage.value * pageSize.value
  return end > filteredPayments.value.length ? filteredPayments.value.length : end
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

const formatMethod = (method) => {
  const methodMap = {
    bank_transfer: 'Bank Transfer',
    upi: 'UPI',
    wallet: 'Wallet',
    cash: 'Cash'
  }
  return methodMap[method] || method
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedPayments.value = paginatedPayments.value.map(payment => payment.id)
  } else {
    selectedPayments.value = []
  }
}

const refreshPayments = async () => {
  loading.value = true
  try {
    // Simulate API call to your backend
    // const response = await fetch('/api/payments')
    // payments.value = await response.json()
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Failed to refresh payments:', error)
  } finally {
    loading.value = false
  }
}

const showPaymentModal = () => {
  showAddPaymentModal.value = true
}

const viewPaymentDetails = (payment) => {
  selectedPaymentDetails.value = payment
}

const downloadReceipt = (payment) => {
  console.log('Downloading receipt for:', payment.id)
  // Implement receipt download
}

const retryPayment = (payment) => {
  payment.status = 'processing'
  // In real app: call API to retry payment
  console.log('Retrying payment:', payment.id)
}

const refundPayment = (payment) => {
  if (confirm(`Issue refund of ₹${payment.amount} to ${payment.user.name}?`)) {
    payment.status = 'refunded'
    // In real app: call API to process refund
    console.log('Processing refund for:', payment.id)
  }
}

const handleNewPayment = (newPayment) => {
  // Add new payment to the list
  payments.value.unshift({
    ...newPayment,
    id: `PAY${String(payments.value.length + 1).padStart(3, '0')}`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    status: 'pending'
  })
  showAddPaymentModal.value = false
}

const handlePaymentUpdate = (updatedPayment) => {
  const index = payments.value.findIndex(p => p.id === updatedPayment.id)
  if (index !== -1) {
    payments.value[index] = { ...payments.value[index], ...updatedPayment }
  }
}

const bulkApprove = () => {
  payments.value.forEach(payment => {
    if (selectedPayments.value.includes(payment.id)) {
      payment.status = 'completed'
    }
  })
  clearSelection()
}

const bulkMarkAsPaid = () => {
  payments.value.forEach(payment => {
    if (selectedPayments.value.includes(payment.id)) {
      payment.status = 'completed'
    }
  })
  clearSelection()
}

const bulkExport = () => {
  const selectedData = payments.value.filter(p => selectedPayments.value.includes(p.id))
  console.log('Exporting selected payments:', selectedData)
  // Implement export logic
}

const clearSelection = () => {
  selectedPayments.value = []
  selectAll.value = false
}

const exportPayments = () => {
  console.log('Exporting all payments...')
  // Implement export to CSV/Excel
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedType.value = ''
  dateFrom.value = ''
  dateTo.value = ''
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
  refreshPayments()
})
</script>

<style scoped>
.payment-management {
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

.create-payment-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.create-payment-btn:hover {
  background: #0da271;
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
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.75rem;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
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

/* Distribution Section */
.distribution-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.method-distribution {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.method-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #f3f4f6;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.method-item:hover {
  background: #f9fafb;
}

.method-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.method-info {
  flex: 1;
  min-width: 0;
}

.method-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.method-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.method-bar {
  width: 100%;
  height: 4px;
  background: #f3f4f6;
  border-radius: 9999px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 9999px;
  transition: width 0.3s;
}

/* Table */
.table-container {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: auto;
  margin-bottom: 1.5rem;
  max-height: 500px;
}

.payments-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

.payments-table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 2px solid #e5e7eb;
  position: sticky;
  top: 0;
}

.payments-table td {
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.payments-table tr:hover {
  background: #f9fafb;
}

/* Transaction ID */
.transaction-id {
  font-family: 'Monospace', monospace;
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.transaction-note {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  line-height: 1.2;
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

/* Amount Cell */
.amount-cell {
  display: flex;
  flex-direction: column;
}

.amount-value {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.amount-tax {
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
  text-transform: capitalize;
}

.type-salary {
  background: #dcfce7;
  color: #166534;
}

.type-bonus {
  background: #fef3c7;
  color: #92400e;
}

.type-refund {
  background: #dbeafe;
  color: #1e40af;
}

.type-commission {
  background: #f3e8ff;
  color: #7c3aed;
}

.type-other {
  background: #f3f4f6;
  color: #4b5563;
}

/* Method Badge */
.method-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
  text-align: center;
  min-width: 80px;
}

.method-bank_transfer {
  background: #dbeafe;
  color: #1e40af;
  border: 1px solid #93c5fd;
}

.method-upi {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.method-wallet {
  background: #f3e8ff;
  color: #7c3aed;
  border: 1px solid #d8b4fe;
}

.method-cash {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fcd34d;
}

/* Status Cell */
.status-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-completed {
  background: #10b981;
}

.status-pending {
  background: #f59e0b;
}

.status-failed {
  background: #ef4444;
}

.status-processing {
  background: #3b82f6;
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

/* Reference Cell */
.reference-cell {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.reference-job,
.reference-invoice {
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  background: #f3f4f6;
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

.action-btn.download {
  color: #10b981;
}

.action-btn.download:hover {
  background: #dcfce7;
  border-color: #10b981;
}

.action-btn.retry {
  color: #f59e0b;
}

.action-btn.retry:hover {
  background: #fef3c7;
  border-color: #f59e0b;
}

.action-btn.refund {
  color: #8b5cf6;
}

.action-btn.refund:hover {
  background: #f3e8ff;
  border-color: #8b5cf6;
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

.bulk-btn.mark-paid {
  background: #3b82f6;
  color: white;
  border: none;
}

.bulk-btn.mark-paid:hover {
  background: #2563eb;
}

.bulk-btn.export {
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.bulk-btn.export:hover {
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
    flex-wrap: wrap;
  }
  
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .method-distribution {
    grid-template-columns: 1fr;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-select,
  .date-input {
    width: 100%;
  }
}
</style>
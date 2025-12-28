<template>
  <div class="wallet-page">
    <!-- Wallet Header -->
    <div class="wallet-header">
      <div class="header-content">
        <h1 class="page-title">Your Wallet</h1>
        <p class="page-subtitle">Manage your earnings and payments</p>
      </div>
      <div class="header-actions">
        <button @click="showAddMoneyModal = true" class="btn-primary">
          <Plus class="w-4 h-4" />
          Add Money
        </button>
        <button @click="showWithdrawModal = true" class="btn-outline">
          <ArrowUpRight class="w-4 h-4" />
          Withdraw
        </button>
      </div>
    </div>

    <!-- Balance Overview -->
    <div class="balance-overview">
      <div class="balance-card">
        <div class="balance-header">
          <div class="balance-icon">
            <Wallet class="w-6 h-6" />
          </div>
          <div class="balance-actions">
            <button @click="refreshBalance" class="refresh-btn">
              <RefreshCw class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div class="balance-amount">
          <div class="amount-label">Available Balance</div>
          <div class="amount-value">₹{{ formatNumber(balance) }}</div>
        </div>
        <div class="balance-breakdown">
          <div class="breakdown-item">
            <div class="breakdown-label">Today's Earnings</div>
            <div class="breakdown-value positive">+₹{{ formatNumber(todayEarnings) }}</div>
          </div>
          <div class="breakdown-item">
            <div class="breakdown-label">Pending Clearance</div>
            <div class="breakdown-value">₹{{ formatNumber(pendingAmount) }}</div>
          </div>
        </div>
      </div>

      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon total-earned">
            <TrendingUp class="w-5 h-5" />
          </div>
          <div class="stat-value">₹{{ formatNumber(totalEarned) }}</div>
          <div class="stat-label">Total Earned</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon total-withdrawn">
            <ArrowUpRight class="w-5 h-5" />
          </div>
          <div class="stat-value">₹{{ formatNumber(totalWithdrawn) }}</div>
          <div class="stat-label">Total Withdrawn</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon total-jobs">
            <Briefcase class="w-5 h-5" />
          </div>
          <div class="stat-value">{{ completedJobs }}</div>
          <div class="stat-label">Jobs Completed</div>
        </div>
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

    <!-- Transaction History -->
    <div class="transaction-section">
      <div class="section-header">
        <h2 class="section-title">Recent Transactions</h2>
        <div class="transaction-filters">
          <select v-model="transactionFilter" class="filter-select">
            <option value="all">All Transactions</option>
            <option value="credit">Credits</option>
            <option value="debit">Debits</option>
            <option value="withdrawal">Withdrawals</option>
          </select>
          <button @click="downloadStatement" class="btn-outline">
            <Download class="w-4 h-4" />
            Statement
          </button>
        </div>
      </div>

      <div class="transactions-list">
        <div v-for="transaction in filteredTransactions" 
             :key="transaction.id"
             class="transaction-item">
          <div class="transaction-icon" :class="`type-${transaction.type}`">
            <component :is="transaction.icon" class="w-5 h-5" />
          </div>
          <div class="transaction-details">
            <div class="transaction-title">{{ transaction.title }}</div>
            <div class="transaction-meta">
              <span>{{ transaction.date }}</span>
              <span>{{ transaction.time }}</span>
              <span v-if="transaction.jobId">Job #{{ transaction.jobId }}</span>
            </div>
          </div>
          <div class="transaction-amount" :class="transaction.amountClass">
            {{ transaction.amount }}
          </div>
          <div class="transaction-status">
            <div :class="`status-badge status-${transaction.status}`">
              {{ transaction.status }}
            </div>
          </div>
          <button @click="viewTransaction(transaction.id)" 
                  class="transaction-action">
            <Eye class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div v-if="filteredTransactions.length === 0" class="empty-state">
        <div class="empty-icon">💸</div>
        <h3>No transactions found</h3>
        <p>Your transaction history will appear here</p>
      </div>
    </div>

    <!-- Payment Methods -->
    <div class="payment-methods">
      <div class="section-header">
        <h2 class="section-title">Payment Methods</h2>
        <button @click="addPaymentMethod" class="btn-outline">
          <Plus class="w-4 h-4" />
          Add Method
        </button>
      </div>
      <div class="methods-list">
        <div v-for="method in paymentMethods" 
             :key="method.id"
             class="method-card"
             :class="{ 'default': method.isDefault }">
          <div class="method-icon">
            <component :is="method.icon" class="w-6 h-6" />
          </div>
          <div class="method-details">
            <div class="method-name">{{ method.name }}</div>
            <div class="method-info">{{ method.details }}</div>
          </div>
          <div class="method-actions">
            <button v-if="!method.isDefault" 
                    @click="setDefaultMethod(method.id)"
                    class="action-btn set-default">
              Set as Default
            </button>
            <button @click="removeMethod(method.id)" 
                    class="action-btn remove">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Withdrawal History -->
    <div class="withdrawal-history">
      <h2 class="section-title">Recent Withdrawals</h2>
      <div class="withdrawals-table">
        <div class="table-header">
          <div class="table-cell">Date</div>
          <div class="table-cell">Amount</div>
          <div class="table-cell">Method</div>
          <div class="table-cell">Status</div>
          <div class="table-cell">Reference</div>
        </div>
        <div v-for="withdrawal in recentWithdrawals" 
             :key="withdrawal.id"
             class="table-row">
          <div class="table-cell">{{ withdrawal.date }}</div>
          <div class="table-cell amount">₹{{ withdrawal.amount }}</div>
          <div class="table-cell">{{ withdrawal.method }}</div>
          <div class="table-cell">
            <div :class="`status-badge status-${withdrawal.status}`">
              {{ withdrawal.status }}
            </div>
          </div>
          <div class="table-cell reference">{{ withdrawal.reference }}</div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddMoneyModal v-if="showAddMoneyModal" @close="showAddMoneyModal = false" />
    <WithdrawModal v-if="showWithdrawModal" @close="showWithdrawModal = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Plus, ArrowUpRight, Wallet, RefreshCw, TrendingUp,
  Briefcase, Download, Eye, Trash2, CreditCard, 
  Smartphone, Bank, CheckCircle, XCircle, Clock
} from 'lucide-vue-next'

// State
const balance = ref(2450)
const todayEarnings = ref(350)
const pendingAmount = ref(800)
const totalEarned = ref(12500)
const totalWithdrawn = ref(8500)
const completedJobs = ref(24)
const transactionFilter = ref('all')
const showAddMoneyModal = ref(false)
const showWithdrawModal = ref(false)

// Quick Actions
const quickActions = ref([
  { icon: CreditCard, label: 'Bank Transfer', handler: () => bankTransfer() },
  { icon: Smartphone, label: 'UPI Payment', handler: () () => upiPayment() },
  { icon: Bank, label: 'Auto Withdraw', handler: () => setupAutoWithdraw() },
  { icon: Download, label: 'Tax Certificate', handler: () => downloadTaxCert() }
])

// Transactions
const transactions = ref([
  {
    id: 1,
    type: 'credit',
    icon: CheckCircle,
    title: 'Payment for Electrical Work',
    date: 'Today',
    time: '10:30 AM',
    jobId: 'J001',
    amount: '+₹800',
    amountClass: 'credit',
    status: 'completed'
  },
  {
    id: 2,
    type: 'debit',
    icon: XCircle,
    title: 'Platform Fee',
    date: 'Today',
    time: '10:30 AM',
    jobId: 'J001',
    amount: '-₹30',
    amountClass: 'debit',
    status: 'completed'
  },
  {
    id: 3,
    type: 'withdrawal',
    icon: ArrowUpRight,
    title: 'Withdrawal to Bank',
    date: 'Yesterday',
    time: '3:45 PM',
    amount: '-₹500',
    amountClass: 'debit',
    status: 'processing'
  },
  {
    id: 4,
    type: 'credit',
    icon: CheckCircle,
    title: 'Payment for Plumbing Job',
    date: 'Jan 14',
    time: '2:15 PM',
    jobId: 'J002',
    amount: '+₹500',
    amountClass: 'credit',
    status: 'completed'
  }
])

// Payment Methods
const paymentMethods = ref([
  {
    id: 1,
    icon: Bank,
    name: 'Bank Account',
    details: 'HDFC Bank •••• 4321',
    isDefault: true
  },
  {
    id: 2,
    icon: Smartphone,
    name: 'UPI ID',
    details: 'ramesh@upi',
    isDefault: false
  },
  {
    id: 3,
    icon: CreditCard,
    name: 'Paytm Wallet',
    details: '•••• 9876',
    isDefault: false
  }
])

// Withdrawals
const recentWithdrawals = ref([
  {
    id: 1,
    date: 'Jan 15, 2024',
    amount: 500,
    method: 'Bank Transfer',
    status: 'completed',
    reference: 'TXN123456'
  },
  {
    id: 2,
    date: 'Jan 10, 2024',
    amount: 1000,
    method: 'UPI',
    status: 'completed',
    reference: 'TXN123455'
  },
  {
    id: 3,
    date: 'Jan 5, 2024',
    amount: 750,
    method: 'Paytm',
    status: 'failed',
    reference: 'TXN123454'
  }
])

// Computed
const filteredTransactions = computed(() => {
  if (transactionFilter.value === 'all') return transactions.value
  return transactions.value.filter(t => t.type === transactionFilter.value)
})

const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Methods
const refreshBalance = () => {
  console.log('Refreshing balance...')
  // In real app, fetch from API
}

const bankTransfer = () => {
  console.log('Initiating bank transfer...')
}

const upiPayment = () => {
  console.log('Initiating UPI payment...')
}

const setupAutoWithdraw = () => {
  console.log('Setting up auto-withdraw...')
}

const downloadTaxCert = () => {
  console.log('Downloading tax certificate...')
}

const downloadStatement = () => {
  console.log('Downloading statement...')
}

const viewTransaction = (id) => {
  console.log('Viewing transaction:', id)
}

const addPaymentMethod = () => {
  console.log('Adding payment method...')
}

const setDefaultMethod = (id) => {
  paymentMethods.value.forEach(method => {
    method.isDefault = method.id === id
  })
}

const removeMethod = (id) => {
  paymentMethods.value = paymentMethods.value.filter(m => m.id !== id)
}
</script>

<style scoped>
.wallet-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.wallet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-content .page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6b7280;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
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

.btn-outline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
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

.balance-overview {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .balance-overview {
    grid-template-columns: 1fr;
  }
}

.balance-card {
  background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
  border-radius: 1.5rem;
  padding: 2rem;
  color: white;
  position: relative;
  overflow: hidden;
}

.balance-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
}

.balance-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.balance-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.refresh-btn {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.balance-amount {
  margin-bottom: 2rem;
}

.amount-label {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.amount-value {
  font-size: 3rem;
  font-weight: 700;
  line-height: 1;
}

.balance-breakdown {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.breakdown-item {
  display: flex;
  flex-direction: column;
}

.breakdown-label {
  font-size: 0.875rem;
  opacity: 0.8;
  margin-bottom: 0.25rem;
}

.breakdown-value {
  font-size: 1.25rem;
  font-weight: 600;
}

.breakdown-value.positive {
  color: #86efac;
}

.stats-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.stat-icon.total-earned {
  background: linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%);
  color: #1e40af;
}

.stat-icon.total-withdrawn {
  background: linear-gradient(135deg, #dcfce7 0%, #86efac 100%);
  color: #166534;
}

.stat-icon.total-jobs {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

.transaction-section {
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
  flex-wrap: wrap;
  gap: 1rem;
}

.transaction-filters {
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

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  transition: all 0.2s;
}

.transaction-item:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.transaction-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.transaction-icon.type-credit {
  background: #dcfce7;
  color: #166534;
}

.transaction-icon.type-debit {
  background: #fee2e2;
  color: #dc2626;
}

.transaction-icon.type-withdrawal {
  background: #dbeafe;
  color: #1e40af;
}

.transaction-details {
  flex: 1;
}

.transaction-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.transaction-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.transaction-amount {
  font-size: 1.125rem;
  font-weight: 700;
  min-width: 100px;
  text-align: right;
}

.transaction-amount.credit {
  color: #10b981;
}

.transaction-amount.debit {
  color: #ef4444;
}

.transaction-status {
  min-width: 100px;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.status-completed {
  background: #dcfce7;
  color: #166534;
}

.status-processing {
  background: #fef3c7;
  color: #92400e;
}

.status-failed {
  background: #fee2e2;
  color: #dc2626;
}

.transaction-action {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.transaction-action:hover {
  background: #f3f4f6;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
}

.payment-methods {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.methods-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.method-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  transition: all 0.2s;
}

.method-card.default {
  border-color: #3b82f6;
  background: linear-gradient(to right, #eff6ff, white);
}

.method-card:hover {
  border-color: #3b82f6;
}

.method-icon {
  width: 56px;
  height: 56px;
  border-radius: 0.75rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.method-card.default .method-icon {
  background: #dbeafe;
  color: #1e40af;
}

.method-details {
  flex: 1;
}

.method-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.method-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.method-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.action-btn.set-default {
  background: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.action-btn.set-default:hover {
  background: #dbeafe;
}

.action-btn.remove {
  width: 40px;
  height: 40px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn.remove:hover {
  background: #fee2e2;
  color: #dc2626;
  border-color: #fca5a5;
}

.withdrawal-history {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.5rem;
}

.withdrawals-table {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
  background: #f8fafc;
  padding: 1rem;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 2px solid #e5e7eb;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 2fr;
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

.table-cell.amount {
  font-weight: 600;
  color: #1f2937;
}

.table-cell.reference {
  font-family: monospace;
  color: #6b7280;
  font-size: 0.875rem;
}
</style>
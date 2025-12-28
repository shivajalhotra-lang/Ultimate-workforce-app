<template>
  <div class="reports-panel">
    <!-- Reports Header -->
    <div class="reports-header">
      <h3>Reports & Analytics</h3>
      <div class="header-actions">
        <button @click="generateReport" class="btn-primary">
          <FileText class="w-4 h-4" />
          Generate New Report
        </button>
        <button @click="scheduleReport" class="btn-outline">
          <Calendar class="w-4 h-4" />
          Schedule Report
        </button>
      </div>
    </div>

    <!-- Report Types Grid -->
    <div class="report-types">
      <h4>Quick Reports</h4>
      <div class="types-grid">
        <div v-for="type in reportTypes" 
             :key="type.id"
             @click="generateQuickReport(type.id)"
             class="report-type-card">
          <div class="type-icon" :style="{ background: type.color }">
            <component :is="type.icon" class="w-5 h-5" />
          </div>
          <div class="type-info">
            <div class="type-name">{{ type.name }}</div>
            <div class="type-desc">{{ type.description }}</div>
          </div>
          <div class="type-action">
            <Download class="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>

    <!-- Date Range Selector -->
    <div class="date-range-section">
      <h4>Custom Date Range</h4>
      <div class="date-controls">
        <div class="date-input-group">
          <label>From Date</label>
          <input type="date" v-model="dateRange.start" class="date-input">
        </div>
        <div class="date-input-group">
          <label>To Date</label>
          <input type="date" v-model="dateRange.end" class="date-input">
        </div>
        <button @click="applyDateRange" class="btn-primary">
          Apply Range
        </button>
        <button @click="resetDateRange" class="btn-outline">
          Reset
        </button>
      </div>
    </div>

    <!-- Report Templates -->
    <div class="report-templates">
      <h4>Report Templates</h4>
      <div class="templates-grid">
        <div v-for="template in templates" 
             :key="template.id"
             class="template-card">
          <div class="template-header">
            <div class="template-icon">
              <FileText class="w-5 h-5" />
            </div>
            <div class="template-info">
              <div class="template-name">{{ template.name }}</div>
              <div class="template-size">{{ template.size }}</div>
            </div>
            <div class="template-actions">
              <button @click="useTemplate(template.id)" 
                      class="action-btn"
                      title="Use Template">
                <Copy class="w-4 h-4" />
              </button>
              <button @click="downloadTemplate(template.id)" 
                      class="action-btn"
                      title="Download">
                <Download class="w-4 h-4" />
              </button>
            </div>
          </div>
          <div class="template-footer">
            <div class="template-meta">
              <span>Last used: {{ template.lastUsed }}</span>
              <span>Format: {{ template.format }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Generated Reports -->
    <div class="generated-reports">
      <h4>Recently Generated Reports</h4>
      <div class="reports-list">
        <div v-for="report in generatedReports" 
             :key="report.id"
             class="report-item">
          <div class="report-info">
            <div class="report-icon">
              <FileText class="w-5 h-5" />
            </div>
            <div class="report-details">
              <div class="report-name">{{ report.name }}</div>
              <div class="report-meta">
                <span>Generated: {{ report.generatedAt }}</span>
                <span>Size: {{ report.size }}</span>
                <span>Rows: {{ report.rows }}</span>
              </div>
            </div>
          </div>
          <div class="report-actions">
            <button @click="downloadReport(report.id)" 
                    class="btn-outline">
              <Download class="w-4 h-4" />
            </button>
            <button @click="deleteReport(report.id)" 
                    class="btn-danger">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Preview Modal -->
    <div v-if="showPreview" class="modal-overlay" @click.self="showPreview = false">
      <div class="modal-content preview-modal">
        <div class="modal-header">
          <h3>Report Preview</h3>
          <div class="modal-actions">
            <button @click="downloadPreview" class="btn-outline">
              Download
            </button>
            <button @click="showPreview = false" class="close-btn">
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div class="modal-body">
          <div class="preview-content">
            <!-- Report preview content here -->
            <p>Report preview will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  FileText, Calendar, Download, Copy, Trash2, X,
  Users, TrendingUp, Wallet, Map, BarChart, PieChart
} from 'lucide-vue-next'

const dateRange = ref({
  start: new Date().toISOString().split('T')[0],
  end: new Date().toISOString().split('T')[0]
})

const showPreview = ref(false)

const reportTypes = ref([
  {
    id: 'users',
    name: 'User Statistics',
    description: 'Active users, registrations, verifications',
    icon: Users,
    color: '#3b82f6'
  },
  {
    id: 'transactions',
    name: 'Transaction Report',
    description: 'All payments, withdrawals, commissions',
    icon: Wallet,
    color: '#10b981'
  },
  {
    id: 'jobs',
    name: 'Job Analytics',
    description: 'Posted jobs, completions, categories',
    icon: TrendingUp,
    color: '#f59e0b'
  },
  {
    id: 'geographic',
    name: 'Geographic Report',
    description: 'District-wise job distribution',
    icon: Map,
    color: '#8b5cf6'
  },
  {
    id: 'revenue',
    name: 'Revenue Report',
    description: 'Platform earnings, projections',
    icon: BarChart,
    color: '#ec4899'
  },
  {
    id: 'compliance',
    name: 'Compliance Report',
    description: 'Wage compliance, audits',
    icon: PieChart,
    color: '#6366f1'
  }
])

const templates = ref([
  {
    id: 1,
    name: 'Monthly MIS Report',
    size: '2.4 MB',
    lastUsed: '2 days ago',
    format: 'PDF + Excel'
  },
  {
    id: 2,
    name: 'Wage Compliance',
    size: '1.8 MB',
    lastUsed: '1 week ago',
    format: 'Excel'
  },
  {
    id: 3,
    name: 'User Activity',
    size: '3.2 MB',
    lastUsed: '3 days ago',
    format: 'CSV'
  }
])

const generatedReports = ref([
  {
    id: 1,
    name: 'Daily Summary - Jan 15, 2024',
    generatedAt: 'Today, 10:30 AM',
    size: '1.2 MB',
    rows: '1,245'
  },
  {
    id: 2,
    name: 'Weekly Transaction Report',
    generatedAt: 'Jan 14, 2024',
    size: '2.8 MB',
    rows: '3,456'
  },
  {
    id: 3,
    name: 'Monthly User Statistics',
    generatedAt: 'Jan 10, 2024',
    size: '4.5 MB',
    rows: '5,678'
  }
])

const generateReport = () => {
  console.log('Generating new report...')
  showPreview.value = true
}

const scheduleReport = () => {
  console.log('Scheduling report...')
}

const generateQuickReport = (typeId) => {
  console.log('Generating quick report:', typeId)
  showPreview.value = true
}

const applyDateRange = () => {
  console.log('Applying date range:', dateRange.value)
}

const resetDateRange = () => {
  const today = new Date().toISOString().split('T')[0]
  dateRange.value = { start: today, end: today }
}

const useTemplate = (templateId) => {
  console.log('Using template:', templateId)
}

const downloadTemplate = (templateId) => {
  console.log('Downloading template:', templateId)
}

const downloadReport = (reportId) => {
  console.log('Downloading report:', reportId)
}

const deleteReport = (reportId) => {
  generatedReports.value = generatedReports.value.filter(r => r.id !== reportId)
}

const downloadPreview = () => {
  console.log('Downloading preview...')
}
</script>

<style scoped>
.reports-panel {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
}

.reports-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.reports-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
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
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-outline {
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #4b5563;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-danger {
  padding: 0.75rem 1.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}

.report-types h4,
.date-range-section h4,
.report-templates h4,
.generated-reports h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.types-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.report-type-card {
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.report-type-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.type-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.type-info {
  flex: 1;
}

.type-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.type-desc {
  font-size: 0.875rem;
  color: #6b7280;
}

.type-action {
  color: #9ca3af;
}

.date-range-section {
  margin-bottom: 2rem;
}

.date-controls {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-input-group label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.date-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  min-width: 150px;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.template-card {
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s;
}

.template-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.1);
}

.template-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.template-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  display: flex;
  align-items: center;
  justify-content: center;
}

.template-info {
  flex: 1;
}

.template-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.template-size {
  font-size: 0.875rem;
  color: #6b7280;
}

.template-actions {
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.action-btn:hover {
  background: #f3f4f6;
}

.template-footer {
  border-top: 1px solid #f3f4f6;
  padding-top: 1rem;
}

.template-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #9ca3af;
}

.reports-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.report-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
}

.report-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.report-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.report-details .report-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.report-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-modal {
  background: white;
  border-radius: 1.5rem;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
}

.modal-body {
  padding: 1.5rem;
}

.preview-content {
  min-height: 400px;
  background: #f8fafc;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
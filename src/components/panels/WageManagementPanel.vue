<template>
  <div class="wage-management-panel">
    <!-- Panel Header -->
    <div class="panel-header">
      <h3>Wage Band Management</h3>
      <div class="header-actions">
        <button @click="showAddModal = true" class="btn-primary">
          <Plus class="w-4 h-4" />
          Add New Band
        </button>
        <button @click="applyToAll" class="btn-outline">
          Apply to All Districts
        </button>
      </div>
    </div>

    <!-- Current Wage Bands -->
    <div class="wage-bands-list">
      <div class="bands-header">
        <div class="band-column">Category</div>
        <div class="band-column">Skill Level</div>
        <div class="band-column">Min Wage (₹)</div>
        <div class="band-column">Max Wage (₹)</div>
        <div class="band-column">Platform Fee (₹)</div>
        <div class="band-column">Status</div>
        <div class="band-column">Actions</div>
      </div>
      
      <div v-for="band in wageBands" 
           :key="band.id"
           class="band-row">
        <div class="band-column">
          <div class="category-info">
            <span class="category-icon">{{ band.icon }}</span>
            <span class="category-name">{{ band.category }}</span>
          </div>
        </div>
        <div class="band-column">
          <div :class="`skill-badge skill-${band.skillLevel}`">
            {{ formatSkillLevel(band.skillLevel) }}
          </div>
        </div>
        <div class="band-column">
          <input v-model.number="band.minWage" 
                 type="number"
                 min="200"
                 class="wage-input"
                 @change="updateBand(band.id, 'minWage', band.minWage)">
        </div>
        <div class="band-column">
          <input v-model.number="band.maxWage" 
                 type="number"
                 :min="band.minWage"
                 class="wage-input"
                 @change="updateBand(band.id, 'maxWage', band.maxWage)">
        </div>
        <div class="band-column">
          <div class="platform-fee">₹{{ calculatePlatformFee(band) }}</div>
        </div>
        <div class="band-column">
          <div class="status-indicator">
            <div class="status-dot" :class="`status-${band.status}`"></div>
            <span>{{ band.status }}</span>
          </div>
        </div>
        <div class="band-column">
          <div class="band-actions">
            <button @click="saveBand(band.id)" 
                    class="action-btn save"
                    :disabled="!band.dirty">
              <Save class="w-4 h-4" />
            </button>
            <button @click="resetBand(band.id)" 
                    class="action-btn reset"
                    :disabled="!band.dirty">
              <RotateCcw class="w-4 h-4" />
            </button>
            <button @click="toggleBandStatus(band.id)" 
                    class="action-btn toggle"
                    :title="band.status === 'active' ? 'Deactivate' : 'Activate'">
              <Power class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Wage Statistics -->
    <div class="wage-statistics">
      <div class="stat-card">
        <div class="stat-label">Average Daily Wage</div>
        <div class="stat-value">₹{{ averageWage }}</div>
        <div class="stat-trend">Across all categories</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Highest Paying</div>
        <div class="stat-value">{{ highestPayingCategory }}</div>
        <div class="stat-trend">₹{{ highestPayingWage }}/day</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Most Jobs</div>
        <div class="stat-value">{{ mostJobsCategory }}</div>
        <div class="stat-trend">{{ mostJobsCount }} jobs this month</div>
      </div>
    </div>

    <!-- Wage Distribution Chart -->
    <div class="wage-distribution">
      <h4>Wage Distribution by Skill Level</h4>
      <div class="distribution-chart">
        <div v-for="level in ['unskilled', 'semi_skilled', 'skilled', 'premium']" 
             :key="level"
             class="distribution-bar">
          <div class="bar-label">{{ formatSkillLevel(level) }}</div>
          <div class="bar-container">
            <div class="bar-fill" 
                 :style="{ height: `${getDistributionPercentage(level)}%` }">
              <div class="bar-value">₹{{ getAverageForLevel(level) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Band Modal -->
    <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add New Wage Band</h3>
          <button @click="showAddModal = false" class="close-btn">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="modal-body">
          <!-- Add form for new wage band -->
          <p>Form will be implemented here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Save, RotateCcw, Power, X } from 'lucide-vue-next'

// Sample wage bands data
const wageBands = ref([
  {
    id: 1,
    category: 'Electrician',
    icon: '⚡',
    skillLevel: 'skilled',
    minWage: 700,
    maxWage: 1200,
    status: 'active',
    dirty: false
  },
  {
    id: 2,
    category: 'Plumber',
    icon: '🔧',
    skillLevel: 'skilled',
    minWage: 600,
    maxWage: 1000,
    status: 'active',
    dirty: false
  },
  {
    id: 3,
    category: 'Driver',
    icon: '🚗',
    skillLevel: 'semi_skilled',
    minWage: 400,
    maxWage: 600,
    status: 'active',
    dirty: false
  },
  {
    id: 4,
    category: 'Domestic Helper',
    icon: '🏠',
    skillLevel: 'unskilled',
    minWage: 200,
    maxWage: 350,
    status: 'active',
    dirty: false
  },
  {
    id: 5,
    category: 'Carpenter',
    icon: '🪚',
    skillLevel: 'skilled',
    minWage: 600,
    maxWage: 900,
    status: 'inactive',
    dirty: false
  }
])

const showAddModal = ref(false)

// Computed properties
const averageWage = computed(() => {
  const total = wageBands.value.reduce((sum, band) => sum + (band.minWage + band.maxWage) / 2, 0)
  return Math.round(total / wageBands.value.length)
})

const highestPayingCategory = computed(() => {
  const band = wageBands.value.reduce((highest, current) => 
    current.maxWage > highest.maxWage ? current : highest
  )
  return band.category
})

const highestPayingWage = computed(() => {
  return Math.max(...wageBands.value.map(b => b.maxWage))
})

const mostJobsCategory = computed(() => {
  // In real app, fetch from API
  return 'Electrician'
})

const mostJobsCount = computed(() => {
  // In real app, fetch from API
  return 45
})

// Methods
const formatSkillLevel = (level) => {
  const map = {
    'unskilled': 'Unskilled',
    'semi_skilled': 'Semi-Skilled',
    'skilled': 'Skilled',
    'premium': 'Premium'
  }
  return map[level] || level
}

const calculatePlatformFee = (band) => {
  // Platform fee logic (8-12% of average wage)
  const avgWage = (band.minWage + band.maxWage) / 2
  const fee = avgWage * 0.1 // 10%
  return Math.round(fee)
}

const updateBand = (id, field, value) => {
  const band = wageBands.value.find(b => b.id === id)
  if (band) {
    band.dirty = true
  }
}

const saveBand = (id) => {
  const band = wageBands.value.find(b => b.id === id)
  if (band) {
    console.log('Saving wage band:', band)
    band.dirty = false
    // In real app, make API call
  }
}

const resetBand = (id) => {
  const band = wageBands.value.find(b => b.id === id)
  if (band) {
    // Reset to original values (in real app, fetch from server)
    band.dirty = false
  }
}

const toggleBandStatus = (id) => {
  const band = wageBands.value.find(b => b.id === id)
  if (band) {
    band.status = band.status === 'active' ? 'inactive' : 'active'
    band.dirty = true
  }
}

const applyToAll = () => {
  console.log('Applying wage bands to all districts')
  // In real app, make API call
}

const getDistributionPercentage = (level) => {
  const bands = wageBands.value.filter(b => b.skillLevel === level)
  if (bands.length === 0) return 0
  const avg = bands.reduce((sum, b) => sum + (b.minWage + b.maxWage) / 2, 0) / bands.length
  const maxWage = Math.max(...wageBands.value.map(b => b.maxWage))
  return (avg / maxWage) * 100
}

const getAverageForLevel = (level) => {
  const bands = wageBands.value.filter(b => b.skillLevel === level)
  if (bands.length === 0) return 0
  const avg = bands.reduce((sum, b) => sum + (b.minWage + b.maxWage) / 2, 0) / bands.length
  return Math.round(avg)
}
</script>

<style scoped>
.wage-management-panel {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.panel-header h3 {
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

.wage-bands-list {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.bands-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr auto;
  background: #f8fafc;
  padding: 1rem;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}

.band-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr auto;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
}

.band-row:hover {
  background: #f9fafb;
}

.band-row:last-child {
  border-bottom: none;
}

.band-column {
  padding: 0 0.5rem;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.category-icon {
  font-size: 1.25rem;
}

.category-name {
  font-weight: 500;
}

.skill-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.skill-unskilled {
  background: #f3f4f6;
  color: #6b7280;
}

.skill-semi_skilled {
  background: #fef3c7;
  color: #92400e;
}

.skill-skilled {
  background: #dbeafe;
  color: #1e40af;
}

.skill-premium {
  background: #f3e8ff;
  color: #7c3aed;
}

.wage-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  text-align: center;
}

.platform-fee {
  font-weight: 600;
  color: #10b981;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-active {
  background: #10b981;
}

.status-inactive {
  background: #6b7280;
}

.band-actions {
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
}

.action-btn.save {
  color: #10b981;
}

.action-btn.save:hover {
  background: #dcfce7;
  border-color: #10b981;
}

.action-btn.reset {
  color: #6b7280;
}

.action-btn.reset:hover {
  background: #f3f4f6;
  border-color: #6b7280;
}

.action-btn.toggle {
  color: #3b82f6;
}

.action-btn.toggle:hover {
  background: #dbeafe;
  border-color: #3b82f6;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.wage-statistics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-trend {
  font-size: 0.75rem;
  color: #9ca3af;
}

.wage-distribution {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
}

.wage-distribution h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.distribution-chart {
  display: flex;
  align-items: flex-end;
  height: 200px;
  gap: 1rem;
  padding: 0 1rem;
}

.distribution-bar {
  flex: 1;
  text-align: center;
}

.bar-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.bar-container {
  height: 150px;
  background: #e5e7eb;
  border-radius: 0.375rem;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, #3b82f6, #8b5cf6);
  border-radius: 0.375rem 0.375rem 0 0;
  transition: height 0.3s;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
}

.bar-value {
  background: white;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1f2937;
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

.modal-content {
  background: white;
  border-radius: 1.5rem;
  width: 90%;
  max-width: 500px;
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
</style>
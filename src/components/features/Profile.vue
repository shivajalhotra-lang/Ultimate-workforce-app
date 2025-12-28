<template>
  <div class="profile-page">
    <!-- Profile Header -->
    <div class="profile-header">
      <div class="header-content">
        <h1 class="page-title">Your Profile</h1>
        <p class="page-subtitle">Manage your personal and professional details</p>
      </div>
      <div class="header-actions">
        <button @click="downloadProfile" class="btn-outline">
          <Download class="w-4 h-4" />
          Download
        </button>
        <button @click="saveProfile" class="btn-primary">
          <Save class="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>

    <!-- Profile Completion -->
    <div class="profile-completion">
      <div class="completion-header">
        <h3>Profile Completion</h3>
        <span class="completion-percentage">{{ completionPercentage }}%</span>
      </div>
      <div class="completion-bar">
        <div class="bar-fill" :style="{ width: `${completionPercentage}%` }"></div>
      </div>
      <div class="completion-steps">
        <div v-for="step in completionSteps" 
             :key="step.label"
             class="step-item"
             :class="{ 'completed': step.completed }">
          <CheckCircle v-if="step.completed" class="w-4 h-4" />
          <Circle v-else class="w-4 h-4" />
          <span>{{ step.label }}</span>
        </div>
      </div>
    </div>

    <!-- Profile Sections -->
    <div class="profile-sections">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Personal Information -->
        <div class="section-card">
          <div class="section-header">
            <h3 class="section-title">Personal Information</h3>
            <button @click="editPersonalInfo" class="edit-section-btn">
              <Edit class="w-4 h-4" />
            </button>
          </div>
          
          <div class="personal-info">
            <div class="profile-avatar-section">
              <div class="avatar-container">
                <div class="profile-avatar" :style="{ background: avatarColor }">
                  {{ userInitials }}
                </div>
                <button @click="changeAvatar" class="avatar-change-btn">
                  <Camera class="w-4 h-4" />
                </button>
              </div>
              <div class="avatar-info">
                <div class="verification-status">
                  <BadgeCheck v-if="isVerified" class="w-5 h-5 text-green-500" />
                  <AlertCircle v-else class="w-5 h-5 text-yellow-500" />
                  <span>{{ isVerified ? 'Verified Profile' : 'Verification Pending' }}</span>
                </div>
                <button v-if="!isVerified" @click="startVerification" class="verify-btn">
                  Verify Now
                </button>
              </div>
            </div>

            <div class="info-grid">
              <div class="info-group">
                <label>Full Name</label>
                <input v-model="profile.name" 
                       type="text"
                       class="info-input"
                       placeholder="Enter your full name">
              </div>
              <div class="info-group">
                <label>Phone Number</label>
                <div class="phone-input">
                  <span class="country-code">+91</span>
                  <input v-model="profile.phone" 
                         type="tel"
                         class="info-input"
                         disabled>
                  <span class="verified-badge">Verified</span>
                </div>
              </div>
              <div class="info-group">
                <label>Email Address</label>
                <input v-model="profile.email" 
                       type="email"
                       class="info-input"
                       placeholder="you@example.com">
              </div>
              <div class="info-group">
                <label>Date of Birth</label>
                <input v-model="profile.dob" 
                       type="date"
                       class="info-input">
              </div>
              <div class="info-group">
                <label>Gender</label>
                <select v-model="profile.gender" class="info-select">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div class="info-group full-width">
                <label>Address</label>
                <textarea v-model="profile.address" 
                          class="info-textarea"
                          placeholder="Your complete address"
                          rows="3"></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Professional Information -->
        <div class="section-card">
          <div class="section-header">
            <h3 class="section-title">Professional Information</h3>
            <button @click="editProfessionalInfo" class="edit-section-btn">
              <Edit class="w-4 h-4" />
            </button>
          </div>

          <div class="professional-info">
            <div class="info-group">
              <label>Primary Skill Category</label>
              <CategorySelector v-model="profile.primarySkill" />
            </div>

            <div class="info-group">
              <label>Secondary Skills</label>
              <div class="skills-input">
                <div class="skills-tags">
                  <span v-for="skill in profile.skills" 
                        :key="skill"
                        class="skill-tag">
                    {{ skill }}
                    <button @click="removeSkill(skill)" class="remove-skill">
                      <X class="w-3 h-3" />
                    </button>
                  </span>
                </div>
                <div class="skill-add">
                  <input v-model="newSkill" 
                         type="text"
                         placeholder="Add a skill"
                         class="skill-input"
                         @keyup.enter="addSkill">
                  <button @click="addSkill" class="add-skill-btn">
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div class="info-group">
              <label>Years of Experience</label>
              <select v-model="profile.experience" class="info-select">
                <option value="">Select</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-10">5-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>

            <div class="info-group">
              <label>Expected Daily Wage</label>
              <div class="wage-range">
                <span class="currency">₹</span>
                <input v-model.number="profile.minWage" 
                       type="number"
                       class="wage-input"
                       placeholder="Min">
                <span class="range-separator">to</span>
                <input v-model.number="profile.maxWage" 
                       type="number"
                       class="wage-input"
                       placeholder="Max">
                <span class="wage-unit">per day</span>
              </div>
            </div>

            <div class="info-group full-width">
              <label>Professional Bio</label>
              <textarea v-model="profile.bio" 
                        class="info-textarea"
                        placeholder="Describe your experience, expertise, and work style..."
                        rows="4"></textarea>
              <div class="char-count">{{ profile.bio.length }}/500</div>
            </div>
          </div>
        </div>

        <!-- Documents -->
        <div class="section-card">
          <div class="section-header">
            <h3 class="section-title">Documents & Certificates</h3>
            <button @click="uploadDocument" class="edit-section-btn">
              <Upload class="w-4 h-4" />
            </button>
          </div>

          <div class="documents-list">
            <div v-for="doc in documents" 
                 :key="doc.id"
                 class="document-item">
              <div class="document-icon">
                <FileText class="w-5 h-5" />
              </div>
              <div class="document-info">
                <div class="document-name">{{ doc.name }}</div>
                <div class="document-meta">
                  <span>Uploaded: {{ doc.uploaded }}</span>
                  <span>Status: </span>
                  <span :class="`status-${doc.status}`">{{ doc.status }}</span>
                </div>
              </div>
              <div class="document-actions">
                <button @click="viewDocument(doc.id)" class="action-btn">
                  <Eye class="w-4 h-4" />
                </button>
                <button @click="downloadDocument(doc.id)" class="action-btn">
                  <Download class="w-4 h-4" />
                </button>
                <button @click="deleteDocument(doc.id)" class="action-btn delete">
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div class="upload-area" @click="uploadDocument">
            <Upload class="w-8 h-8" />
            <div class="upload-text">
              <div class="upload-title">Upload Documents</div>
              <div class="upload-subtitle">Aadhaar, Certificates, Portfolio</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Profile Stats -->
        <div class="section-card profile-stats">
          <h3 class="section-title">Profile Stats</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-icon completed">
                <CheckCircle class="w-5 h-5" />
              </div>
              <div class="stat-value">{{ stats.completedJobs }}</div>
              <div class="stat-label">Jobs Completed</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon rating">
                <Star class="w-5 h-5" />
              </div>
              <div class="stat-value">{{ stats.rating }}/5</div>
              <div class="stat-label">Average Rating</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon earnings">
                <Wallet class="w-5 h-5" />
              </div>
              <div class="stat-value">₹{{ formatNumber(stats.totalEarned) }}</div>
              <div class="stat-label">Total Earned</div>
            </div>
            <div class="stat-item">
              <div class="stat-icon response">
                <Clock class="w-5 h-5" />
              </div>
              <div class="stat-value">{{ stats.responseRate }}%</div>
              <div class="stat-label">Response Rate</div>
            </div>
          </div>
        </div>

        <!-- Availability -->
        <div class="section-card availability">
          <div class="section-header">
            <h3 class="section-title">Availability</h3>
            <button @click="editAvailability" class="edit-section-btn">
              <Edit class="w-4 h-4" />
            </button>
          </div>

          <div class="availability-settings">
            <div class="setting-item">
              <label class="toggle-label">
                <span>Available for Work</span>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="availability.available">
                  <span class="toggle-slider"></span>
                </label>
              </label>
            </div>

            <div class="setting-item">
              <label>Preferred Work Days</label>
              <div class="days-selector">
                <button v-for="day in daysOfWeek" 
                        :key="day.id"
                        @click="toggleDay(day.id)"
                        :class="['day-btn', { 'selected': availability.days.includes(day.id) }]">
                  {{ day.short }}
                </button>
              </div>
            </div>

            <div class="setting-item">
              <label>Preferred Shift</label>
              <select v-model="availability.shift" class="info-select">
                <option value="any">Any Shift</option>
                <option value="morning">Morning (6AM-2PM)</option>
                <option value="afternoon">Afternoon (2PM-10PM)</option>
                <option value="night">Night (10PM-6AM)</option>
              </select>
            </div>

            <div class="setting-item">
              <label>Maximum Distance</label>
              <div class="distance-slider">
                <input v-model.number="availability.maxDistance" 
                       type="range" 
                       min="1" 
                       max="50" 
                       class="slider">
                <div class="slider-value">{{ availability.maxDistance }} km</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Portfolio -->
        <div class="section-card portfolio">
          <div class="section-header">
            <h3 class="section-title">Portfolio</h3>
            <button @click="addPortfolioItem" class="edit-section-btn">
              <Plus class="w-4 h-4" />
            </button>
          </div>

          <div class="portfolio-items">
            <div v-for="item in portfolioItems" 
                 :key="item.id"
                 class="portfolio-item">
              <div class="portfolio-image">
                <img :src="item.image" :alt="item.title" v-if="item.image">
                <div class="image-placeholder" v-else>
                  <Image class="w-8 h-8" />
                </div>
              </div>
              <div class="portfolio-info">
                <div class="portfolio-title">{{ item.title }}</div>
                <div class="portfolio-desc">{{ item.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="section-card privacy">
          <h3 class="section-title">Privacy Settings</h3>
          <div class="privacy-settings">
            <div class="setting-item">
              <label class="toggle-label">
                <span>Show Profile to Employers</span>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="privacy.showProfile">
                  <span class="toggle-slider"></span>
                </label>
              </label>
            </div>
            <div class="setting-item">
              <label class="toggle-label">
                <span>Show Contact Information</span>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="privacy.showContact">
                  <span class="toggle-slider"></span>
                </label>
              </label>
            </div>
            <div class="setting-item">
              <label class="toggle-label">
                <span>Show Earnings History</span>
                <label class="toggle-switch">
                  <input type="checkbox" v-model="privacy.showEarnings">
                  <span class="toggle-slider"></span>
                </label>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="danger-zone">
      <h3 class="danger-title">Danger Zone</h3>
      <div class="danger-actions">
        <button @click="deactivateAccount" class="danger-btn deactivate">
          <Power class="w-4 h-4" />
          Deactivate Account
        </button>
        <button @click="deleteAccount" class="danger-btn delete">
          <Trash2 class="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  Download, Save, Edit, Camera, BadgeCheck, AlertCircle,
  CheckCircle, Circle, Plus, X, Upload, FileText, Eye,
  Trash2, Wallet, Star, Clock, Image, Power
} from 'lucide-vue-next'
import CategorySelector from '../components/CategorySelector.vue'

// State
const profile = ref({
  name: 'Ramesh Kumar',
  phone: '9876543210',
  email: 'ramesh.kumar@example.com',
  dob: '1990-01-15',
  gender: 'male',
  address: '123 Gandhi Nagar, Rudrapur, Uttarakhand',
  primarySkill: 'electrician',
  skills: ['Wiring', 'AC Repair', 'Home Appliances', 'Solar Installation'],
  experience: '5-10',
  minWage: 700,
  maxWage: 1200,
  bio: 'Experienced electrician with 8 years of expertise in residential and commercial wiring. Specialized in AC repair and solar installations.'
})

const newSkill = ref('')

const isVerified = ref(true)

const completionSteps = ref([
  { label: 'Basic Info', completed: true },
  { label: 'Skills Added', completed: true },
  { label: 'Documents Uploaded', completed: false },
  { label: 'Profile Verified', completed: true },
  { label: 'Portfolio Added', completed: false }
])

const stats = ref({
  completedJobs: 24,
  rating: 4.7,
  totalEarned: 24500,
  responseRate: 92
})

const documents = ref([
  { id: 1, name: 'Aadhaar Card', uploaded: 'Jan 10, 2024', status: 'verified' },
  { id: 2, name: 'ITI Certificate', uploaded: 'Jan 12, 2024', status: 'pending' },
  { id: 3, name: 'Experience Letter', uploaded: 'Jan 5, 2024', status: 'verified' }
])

const availability = ref({
  available: true,
  days: [1, 2, 3, 4, 5], // Mon-Fri
  shift: 'any',
  maxDistance: 10
})

const daysOfWeek = ref([
  { id: 1, name: 'Monday', short: 'M' },
  { id: 2, name: 'Tuesday', short: 'T' },
  { id: 3, name: 'Wednesday', short: 'W' },
  { id: 4, name: 'Thursday', short: 'T' },
  { id: 5, name: 'Friday', short: 'F' },
  { id: 6, name: 'Saturday', short: 'S' },
  { id: 7, name: 'Sunday', short: 'S' }
])

const portfolioItems = ref([
  { id: 1, title: 'House Wiring Project', description: 'Complete rewiring of 3BHK house', image: null },
  { id: 2, title: 'Solar Installation', description: '5kW solar panel installation', image: null }
])

const privacy = ref({
  showProfile: true,
  showContact: false,
  showEarnings: false
})

// Computed
const completionPercentage = computed(() => {
  const completed = completionSteps.value.filter(step => step.completed).length
  return Math.round((completed / completionSteps.value.length) * 100)
})

const userInitials = computed(() => {
  const name = profile.value.name
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const avatarColor = computed(() => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  ]
  const index = profile.value.name.length % colors.length
  return colors[index]
})

// Methods
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

const editPersonalInfo = () => {
  console.log('Editing personal info...')
}

const changeAvatar = () => {
  console.log('Changing avatar...')
}

const startVerification = () => {
  console.log('Starting verification...')
  isVerified.value = true
}

const editProfessionalInfo = () => {
  console.log('Editing professional info...')
}

const addSkill = () => {
  if (newSkill.value.trim() && !profile.value.skills.includes(newSkill.value.trim())) {
    profile.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (skill) => {
  profile.value.skills = profile.value.skills.filter(s => s !== skill)
}

const uploadDocument = () => {
  console.log('Uploading document...')
}

const viewDocument = (id) => {
  console.log('Viewing document:', id)
}

const downloadDocument = (id) => {
  console.log('Downloading document:', id)
}

const deleteDocument = (id) => {
  documents.value = documents.value.filter(doc => doc.id !== id)
}

const editAvailability = () => {
  console.log('Editing availability...')
}

const toggleDay = (dayId) => {
  const index = availability.value.days.indexOf(dayId)
  if (index > -1) {
    availability.value.days.splice(index, 1)
  } else {
    availability.value.days.push(dayId)
  }
}

const addPortfolioItem = () => {
  console.log('Adding portfolio item...')
}

const downloadProfile = () => {
  console.log('Downloading profile...')
}

const saveProfile = () => {
  console.log('Saving profile...', profile.value)
  // In real app, make API call
}

const deactivateAccount = () => {
  if (confirm('Are you sure you want to deactivate your account?')) {
    console.log('Deactivating account...')
  }
}

const deleteAccount = () => {
  if (confirm('This action cannot be undone. Are you sure?')) {
    console.log('Deleting account...')
  }
}

onMounted(() => {
  console.log('Profile page loaded')
})
</script>

<style scoped>
.profile-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header {
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

.btn-outline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  color: #4b5563;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
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

.profile-completion {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.completion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.completion-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.completion-percentage {
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
}

.completion-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(to right, #10b981, #3b82f6);
  border-radius: 4px;
  transition: width 0.3s;
}

.completion-steps {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.step-item.completed {
  color: #10b981;
}

.step-item .check-circle {
  color: #10b981;
}

.step-item .circle {
  color: #d1d5db;
}

.profile-sections {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .profile-sections {
    grid-template-columns: 1fr;
  }
}

.left-column, .right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.edit-section-btn {
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

.edit-section-btn:hover {
  background: #f3f4f6;
}

.personal-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-avatar-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.avatar-container {
  position: relative;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.avatar-change-btn {
  position: absolute;
  bottom: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  border: 2px solid white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-info {
  flex: 1;
  min-width: 200px;
}

.verification-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.verify-btn {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

.info-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-group.full-width {
  grid-column: 1 / -1;
}

.info-group label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.info-input, .info-select, .info-textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  font-family: inherit;
}

.info-input:focus, .info-select:focus, .info-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.info-textarea {
  resize: vertical;
  min-height: 80px;
}

.phone-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.country-code {
  color: #6b7280;
  font-weight: 500;
}

.verified-badge {
  background: #10b981;
  color: white;
  font-size: 0.75rem;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-weight: 500;
}

.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.professional-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.skills-input {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: #dbeafe;
  color: #1e40af;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.remove-skill {
  background: none;
  border: none;
  color: #1e40af;
  cursor: pointer;
  padding: 0.125rem;
}

.skill-add {
  display: flex;
  gap: 0.5rem;
}

.skill-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
}

.add-skill-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.wage-range {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.currency {
  font-weight: 600;
  color: #1f2937;
}

.wage-input {
  width: 80px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  text-align: center;
}

.range-separator {
  color: #6b7280;
}

.wage-unit {
  color: #6b7280;
  font-size: 0.875rem;
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
}

.document-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.document-info {
  flex: 1;
}

.document-name {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.document-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.status-verified {
  color: #10b981;
  font-weight: 500;
}

.status-pending {
  color: #f59e0b;
  font-weight: 500;
}

.document-actions {
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
  color: #6b7280;
}

.action-btn.delete {
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.upload-text {
  text-align: center;
}

.upload-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.upload-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.profile-stats .stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
}

.stat-icon.completed {
  background: #dcfce7;
  color: #166534;
}

.stat-icon.rating {
  background: #fef3c7;
  color: #92400e;
}

.stat-icon.earnings {
  background: #dbeafe;
  color: #1e40af;
}

.stat-icon.response {
  background: #f3e8ff;
  color: #7c3aed;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.availability-settings,
.privacy-settings {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toggle-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  color: #374151;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db;
  transition: .4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #10b981;
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.days-selector {
  display: flex;
  gap: 0.5rem;
}

.day-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.day-btn.selected {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.distance-slider {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.slider-value {
  min-width: 40px;
  text-align: right;
  font-weight: 600;
  color: #1f2937;
}

.portfolio-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.portfolio-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
}

.portfolio-image {
  width: 60px;
  height: 60px;
  border-radius: 0.5rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  overflow: hidden;
}

.portfolio-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.portfolio-info {
  flex: 1;
}

.portfolio-title {
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.portfolio-desc {
  font-size: 0.75rem;
  color: #6b7280;
}

.danger-zone {
  background: white;
  border: 1px solid #fee2e2;
  border-radius: 1.25rem;
  padding: 1.5rem;
  margin-top: 2rem;
}

.danger-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #dc2626;
  margin-bottom: 1rem;
}

.danger-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.danger-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.danger-btn.deactivate {
  background: white;
  color: #dc2626;
  border: 1px solid #dc2626;
}

.danger-btn.deactivate:hover {
  background: #fee2e2;
}

.danger-btn.delete {
  background: #dc2626;
  color: white;
  border: none;
}

.danger-btn.delete:hover {
  background: #b91c1c;
}
</style>
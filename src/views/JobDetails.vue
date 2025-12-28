<template>
  <div class="job-details-page">
    <!-- Back Navigation -->
    <div class="back-navigation">
      <button @click="goBack" class="back-btn">
        <ArrowLeft class="w-5 h-5" />
        Back to Jobs
      </button>
    </div>

    <!-- Job Header -->
    <div class="job-header">
      <div class="job-basic-info">
        <div class="job-category">
          <span class="category-icon">{{ job.categoryIcon }}</span>
          <span class="category-name">{{ job.category }}</span>
        </div>
        <h1 class="job-title">{{ job.title }}</h1>
        <div class="job-meta">
          <div class="meta-item">
            <MapPin class="w-4 h-4" />
            <span>{{ job.location }}</span>
            <span class="distance">{{ job.distance }} km away</span>
          </div>
          <div class="meta-item">
            <Calendar class="w-4 h-4" />
            <span>{{ job.date }}</span>
            <span class="duration">{{ job.duration }}</span>
          </div>
          <div class="meta-item">
            <Clock class="w-4 h-4" />
            <span>Posted {{ job.postedTime }}</span>
            <span class="urgency" v-if="job.urgent">Urgent Hiring</span>
          </div>
        </div>
      </div>
      
      <div class="job-actions">
        <div class="job-wage">
          <div class="wage-amount">₹{{ job.wage }}</div>
          <div class="wage-note">Platform fee: ₹{{ job.platformFee }}</div>
        </div>
        <div class="action-buttons">
          <button v-if="userRole === 'worker' && !hasApplied" 
                  @click="applyToJob"
                  class="apply-btn">
            <Check class="w-5 h-5" />
            Apply Now
          </button>
          <button v-if="userRole === 'worker' && hasApplied" 
                  class="applied-btn" disabled>
            <CheckCircle class="w-5 h-5" />
            Applied
          </button>
          <button v-if="userRole === 'employer'" 
                  @click="editJob"
                  class="edit-btn">
            <Edit class="w-5 h-5" />
            Edit Job
          </button>
          <button @click="shareJob" class="share-btn">
            <Share2 class="w-5 h-5" />
            Share
          </button>
          <button @click="saveJob" class="save-btn">
            <Bookmark class="w-5 h-5" :fill="isSaved ? 'currentColor' : 'none'" />
            {{ isSaved ? 'Saved' : 'Save' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Job Details Sections -->
    <div class="job-sections">
      <!-- Left Column -->
      <div class="left-column">
        <!-- Job Description -->
        <div class="section-card">
          <h2 class="section-title">Job Description</h2>
          <div class="job-description">
            <p>{{ job.description }}</p>
            <div v-if="job.responsibilities" class="responsibilities">
              <h4>Responsibilities:</h4>
              <ul>
                <li v-for="(resp, index) in job.responsibilities" 
                    :key="index">{{ resp }}</li>
              </ul>
            </div>
            <div v-if="job.requirements" class="requirements">
              <h4>Requirements:</h4>
              <ul>
                <li v-for="(req, index) in job.requirements" 
                    :key="index">{{ req }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Employer Info -->
        <div class="section-card">
          <h2 class="section-title">About the Employer</h2>
          <div class="employer-info">
            <div class="employer-header">
              <div class="employer-avatar">
                {{ employer.name.charAt(0) }}
              </div>
              <div class="employer-details">
                <h3>{{ employer.name }}</h3>
                <div class="employer-meta">
                  <div class="employer-rating">
                    <Star class="w-4 h-4 fill-current" />
                    <span>{{ employer.rating }}</span>
                    <span class="review-count">({{ employer.reviewCount }} reviews)</span>
                  </div>
                  <div class="employer-verified" v-if="employer.verified">
                    <BadgeCheck class="w-4 h-4" />
                    <span>Verified Employer</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="employer-stats">
              <div class="stat-item">
                <div class="stat-value">{{ employer.totalJobs }}</div>
                <div class="stat-label">Jobs Posted</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ employer.hireRate }}%</div>
                <div class="stat-label">Hire Rate</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ employer.responseTime }}</div>
                <div class="stat-label">Avg. Response</div>
              </div>
            </div>
            <button @click="contactEmployer" class="contact-btn">
              <MessageSquare class="w-4 h-4" />
              Contact Employer
            </button>
          </div>
        </div>

        <!-- Location Map -->
        <div class="section-card">
          <h2 class="section-title">Job Location</h2>
          <div class="location-map">
            <!-- Simple map visualization -->
            <div class="map-placeholder">
              <MapPin class="w-12 h-12" />
              <div class="map-address">{{ job.address }}</div>
              <div class="map-note">{{ job.distance }} km from your location</div>
            </div>
            <button @click="viewOnMap" class="view-map-btn">
              <Map class="w-4 h-4" />
              View on Map
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="right-column">
        <!-- Wage Breakdown -->
        <div class="section-card wage-breakdown">
          <h2 class="section-title">Wage Breakdown</h2>
          <div class="breakdown-list">
            <div class="breakdown-item">
              <span>Daily Wage</span>
              <span class="amount">₹{{ job.wage }}</span>
            </div>
            <div class="breakdown-item">
              <span>Platform Fee</span>
              <span class="amount fee">-₹{{ job.platformFee }}</span>
            </div>
            <div class="breakdown-item total">
              <span>Your Take Home</span>
              <span class="amount total">₹{{ job.wage - job.platformFee }}</span>
            </div>
          </div>
          <div class="payment-info">
            <div class="info-item">
              <CreditCard class="w-4 h-4" />
              <span>Payment on job completion</span>
            </div>
            <div class="info-item">
              <Shield class="w-4 h-4" />
              <span>Payment protection guaranteed</span>
            </div>
          </div>
        </div>

        <!-- Application Stats -->
        <div v-if="userRole === 'employer'" class="section-card application-stats">
          <h2 class="section-title">Applications</h2>
          <div class="stats-overview">
            <div class="stat-circle">
              <div class="circle-value">{{ job.applications }}</div>
              <div class="circle-label">Total</div>
            </div>
            <div class="stat-circle">
              <div class="circle-value">{{ job.shortlisted }}</div>
              <div class="circle-label">Shortlisted</div>
            </div>
            <div class="stat-circle">
              <div class="circle-value">{{ job.hired }}</div>
              <div class="circle-label">Hired</div>
            </div>
          </div>
          <button @click="viewApplications" class="view-applications-btn">
            View All Applications
          </button>
        </div>

        <!-- Similar Jobs -->
        <div v-if="userRole === 'worker'" class="section-card similar-jobs">
          <h2 class="section-title">Similar Jobs</h2>
          <div class="similar-jobs-list">
            <div v-for="similarJob in similarJobs" 
                 :key="similarJob.id"
                 class="similar-job-card"
                 @click="viewJob(similarJob.id)">
              <div class="similar-job-header">
                <div class="similar-job-category">{{ similarJob.category }}</div>
                <div class="similar-job-distance">{{ similarJob.distance }} km</div>
              </div>
              <h4 class="similar-job-title">{{ similarJob.title }}</h4>
              <div class="similar-job-wage">₹{{ similarJob.wage }}</div>
            </div>
          </div>
          <button @click="browseSimilar" class="browse-more-btn">
            Browse More Jobs
          </button>
        </div>

        <!-- Important Notes -->
        <div class="section-card important-notes">
          <h2 class="section-title">Important Notes</h2>
          <div class="notes-list">
            <div class="note-item">
              <AlertCircle class="w-4 h-4" />
              <span>Carry your Aadhaar card for verification</span>
            </div>
            <div class="note-item">
              <AlertCircle class="w-4 h-4" />
              <span>Report any issues within 2 hours of job start</span>
            </div>
            <div class="note-item">
              <AlertCircle class="w-4 h-4" />
              <span>Payment released within 24 hours of completion</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Application Modal -->
    <div v-if="showApplicationModal" class="modal-overlay" @click.self="closeApplicationModal">
      <div class="modal-content application-modal">
        <div class="modal-header">
          <h3>Apply for this Job</h3>
          <button @click="closeApplicationModal" class="close-btn">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="modal-body">
          <div class="application-form">
            <div class="form-group">
              <label>Why are you suitable for this job?</label>
              <textarea v-model="applicationMessage" 
                        placeholder="Tell the employer why you're the right fit..."
                        rows="4"
                        class="application-textarea"></textarea>
              <div class="char-count">{{ applicationMessage.length }}/500</div>
            </div>
            <div class="form-group">
              <label>Expected Completion Time</label>
              <select v-model="expectedTime" class="time-select">
                <option value="">Select time</option>
                <option value="2">2 hours</option>
                <option value="4">4 hours</option>
                <option value="8">Full day (8 hours)</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div class="application-summary">
              <h4>Application Summary</h4>
              <div class="summary-item">
                <span>Job:</span>
                <span>{{ job.title }}</span>
              </div>
              <div class="summary-item">
                <span>Wage:</span>
                <span>₹{{ job.wage }} (Take home: ₹{{ job.wage - job.platformFee }})</span>
              </div>
              <div class="summary-item">
                <span>Platform Fee:</span>
                <span>₹{{ job.platformFee }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeApplicationModal" class="btn-outline">
            Cancel
          </button>
          <button @click="submitApplication" 
                  :disabled="!applicationMessage.trim()"
                  class="btn-primary">
            Submit Application
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccessToast" class="success-toast">
      <div class="toast-content">
        <CheckCircle class="w-5 h-5" />
        <div class="toast-message">
          <div class="toast-title">Application Submitted!</div>
          <div class="toast-subtitle">The employer will review your application</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  ArrowLeft, MapPin, Calendar, Clock, Check, CheckCircle,
  Edit, Share2, Bookmark, Star, BadgeCheck, MessageSquare,
  Map, CreditCard, Shield, AlertCircle, X
} from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const job = ref({
  id: 1,
  title: 'Electrician for House Wiring',
  category: 'Electrician',
  categoryIcon: '⚡',
  description: 'Need an experienced electrician to fix wiring issues in a 3BHK house. The job involves checking the main electrical panel, fixing faulty switches, and ensuring all connections are safe.',
  responsibilities: [
    'Check main electrical panel',
    'Fix faulty switches and sockets',
    'Ensure all wiring is safe and up to code',
    'Provide basic maintenance tips'
  ],
  requirements: [
    'Minimum 2 years experience',
    'Own tools required',
    'Aadhaar verification needed',
    'Good communication skills'
  ],
  location: 'Civil Lines, Rudrapur',
  distance: 2.5,
  address: '123 Main Street, Civil Lines, Rudrapur, Uttarakhand',
  date: 'Tomorrow, 15 Jan 2024',
  duration: '4-6 hours',
  postedTime: '2 hours ago',
  urgent: true,
  wage: 800,
  platformFee: 30,
  applications: 5,
  shortlisted: 2,
  hired: 0
})

const employer = ref({
  name: 'Rajesh Kumar',
  rating: 4.8,
  reviewCount: 42,
  verified: true,
  totalJobs: 24,
  hireRate: 85,
  responseTime: '2 hours'
})

const similarJobs = ref([
  { id: 2, category: 'Electrician', title: 'Office Wiring Repair', wage: 900, distance: 3.2 },
  { id: 3, category: 'Electrician', title: 'AC Installation', wage: 1200, distance: 1.8 },
  { id: 4, category: 'Plumber', title: 'Bathroom Pipe Fix', wage: 500, distance: 2.1 }
])

const hasApplied = ref(false)
const isSaved = ref(false)
const showApplicationModal = ref(false)
const showSuccessToast = ref(false)
const applicationMessage = ref('')
const expectedTime = ref('')

// Computed
const userRole = computed(() => authStore.user?.role || 'worker')

// Methods
const goBack = () => {
  router.go(-1)
}

const applyToJob = () => {
  if (userRole.value !== 'worker') {
    router.push('/login')
    return
  }
  showApplicationModal.value = true
}

const closeApplicationModal = () => {
  showApplicationModal.value = false
  applicationMessage.value = ''
  expectedTime.value = ''
}

const submitApplication = () => {
  console.log('Submitting application:', {
    jobId: job.value.id,
    message: applicationMessage.value,
    expectedTime: expectedTime.value
  })
  
  hasApplied.value = true
  showApplicationModal.value = false
  showSuccessToast.value = true
  
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

const editJob = () => {
  console.log('Editing job:', job.value.id)
  router.push(`/job/edit/${job.value.id}`)
}

const shareJob = () => {
  if (navigator.share) {
    navigator.share({
      title: job.value.title,
      text: `Check out this job: ${job.value.title} - ₹${job.value.wage}`,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
  }
}

const saveJob = () => {
  isSaved.value = !isSaved.value
  console.log(isSaved.value ? 'Job saved' : 'Job unsaved')
}

const contactEmployer = () => {
  console.log('Contacting employer:', employer.value.name)
  router.push(`/messages?to=${employer.value.name}`)
}

const viewOnMap = () => {
  console.log('Viewing job on map')
  // Open in Google Maps
  const address = encodeURIComponent(job.value.address)
  window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank')
}

const viewApplications = () => {
  router.push(`/job/${job.value.id}/applications`)
}

const viewJob = (jobId) => {
  router.push(`/job/${jobId}`)
}

const browseSimilar = () => {
  router.push(`/jobs?category=${job.value.category}`)
}

onMounted(() => {
  const jobId = route.params.id
  console.log('Loading job details for:', jobId)
  // In real app, fetch job details from API
})
</script>

<style scoped>
.job-details-page {
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.back-navigation {
  margin-bottom: 1.5rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.back-btn:hover {
  background: #f3f4f6;
}

.job-header {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 2rem;
}

.job-basic-info {
  flex: 1;
  min-width: 300px;
}

.job-category {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.category-icon {
  font-size: 1.5rem;
}

.category-name {
  font-weight: 600;
  color: #4b5563;
  background: #f3f4f6;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.job-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.job-meta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.distance, .duration, .urgency {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.urgency {
  background: #fee2e2;
  color: #dc2626;
}

.job-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: flex-end;
}

.job-wage {
  text-align: right;
}

.wage-amount {
  font-size: 2.5rem;
  font-weight: 800;
  color: #10b981;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.wage-note {
  font-size: 0.875rem;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.apply-btn, .applied-btn, .edit-btn, .share-btn, .save-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.apply-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
}

.apply-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
}

.applied-btn {
  background: #d1fae5;
  color: #065f46;
  border: none;
  cursor: default;
}

.edit-btn {
  background: #3b82f6;
  color: white;
  border: none;
}

.edit-btn:hover {
  background: #2563eb;
}

.share-btn {
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.share-btn:hover {
  background: #f3f4f6;
}

.save-btn {
  background: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.save-btn:hover {
  background: #fef3c7;
  border-color: #f59e0b;
  color: #92400e;
}

.job-sections {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .job-sections {
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

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.25rem;
}

.job-description p {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.responsibilities, .requirements {
  margin-top: 1.5rem;
}

.responsibilities h4, .requirements h4 {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.responsibilities ul, .requirements ul {
  list-style-type: none;
  padding-left: 0;
}

.responsibilities li, .requirements li {
  color: #6b7280;
  padding: 0.25rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.responsibilities li:before, .requirements li:before {
  content: '•';
  color: #3b82f6;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.employer-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.employer-avatar {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.employer-details h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.employer-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.employer-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #f59e0b;
  font-weight: 600;
}

.review-count {
  color: #9ca3af;
  font-weight: normal;
}

.employer-verified {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #10b981;
  font-weight: 500;
  font-size: 0.875rem;
}

.employer-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.75rem;
}

.stat-item {
  text-align: center;
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

.contact-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  justify-content: center;
}

.contact-btn:hover {
  background: #2563eb;
}

.location-map {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.map-placeholder {
  background: #f8fafc;
  border: 2px dashed #d1d5db;
  border-radius: 1rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #6b7280;
}

.map-address {
  font-weight: 500;
  color: #4b5563;
  text-align: center;
}

.map-note {
  font-size: 0.875rem;
  color: #9ca3af;
}

.view-map-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  justify-content: center;
}

.view-map-btn:hover {
  background: #dbeafe;
}

.wage-breakdown {
  background: linear-gradient(to bottom right, #f0f9ff, #e0f2fe);
  border-color: #bae6fd;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 0.5rem;
}

.breakdown-item.total {
  background: #dbeafe;
  border: 2px solid #3b82f6;
}

.amount {
  font-weight: 600;
  color: #1f2937;
}

.amount.fee {
  color: #ef4444;
}

.amount.total {
  color: #1e40af;
  font-size: 1.125rem;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.application-stats {
  text-align: center;
}

.stats-overview {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.stat-circle {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circle-value {
  width: 60px;
  height: 60px;
  border: 3px solid #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.circle-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.view-applications-btn {
  width: 100%;
  padding: 0.75rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.view-applications-btn:hover {
  background: #2563eb;
}

.similar-jobs-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.similar-job-card {
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.similar-job-card:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.similar-job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.similar-job-category {
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.similar-job-distance {
  font-size: 0.75rem;
  color: #9ca3af;
}

.similar-job-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.similar-job-wage {
  font-weight: 700;
  color: #10b981;
  font-size: 1rem;
}

.browse-more-btn {
  width: 100%;
  padding: 0.75rem;
  background: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}

.browse-more-btn:hover {
  background: #dbeafe;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.note-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
}

.note-item .alert-circle {
  color: #f59e0b;
  flex-shrink: 0;
  margin-top: 0.125rem;
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

.application-modal {
  background: white;
  border-radius: 1.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
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

.application-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.application-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
}

.application-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.char-count {
  text-align: right;
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.time-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
}

.application-summary {
  background: #f8fafc;
  border-radius: 0.75rem;
  padding: 1rem;
}

.application-summary h4 {
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.summary-item:last-child {
  border-bottom: none;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
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

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.success-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #10b981;
  border-radius: 1rem;
  padding: 1rem 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  animation: slideUp 0.3s ease;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toast-content .check-circle {
  color: #10b981;
}

.toast-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.toast-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}
</style>
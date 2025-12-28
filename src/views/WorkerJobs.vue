<template>
  <div class="worker-jobs">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Available Jobs</h1>
      <p class="text-gray-600 mt-2">Find work that matches your skills</p>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-lg shadow p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Search -->
        <div class="md:col-span-2">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search jobs by title, category, or location..."
              class="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <!-- Category Filter -->
        <div>
          <select
            v-model="selectedCategory"
            class="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Location Filter -->
        <div>
          <select
            v-model="selectedLocation"
            class="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Locations</option>
            <option value="nearby">Nearby Jobs</option>
            <option v-for="location in locations" :key="location" :value="location">
              {{ location }}
            </option>
          </select>
        </div>
      </div>

      <!-- Advanced Filters Toggle -->
      <div class="mt-4">
        <button
          @click="showAdvancedFilters = !showAdvancedFilters"
          class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <span>Advanced Filters</span>
          <svg
            :class="['ml-1 h-4 w-4 transform transition-transform', showAdvancedFilters ? 'rotate-180' : '']"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Advanced Filters -->
        <div v-if="showAdvancedFilters" class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Wage Range -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Wage Range (₹)</label>
            <div class="flex items-center space-x-2">
              <input
                v-model="minWage"
                type="number"
                placeholder="Min"
                class="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <span class="text-gray-500">to</span>
              <input
                v-model="maxWage"
                type="number"
                placeholder="Max"
                class="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Work Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Work Type</label>
            <select
              v-model="selectedWorkType"
              class="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Type</option>
              <option v-for="type in workTypes" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>

          <!-- Experience Level -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <select
              v-model="selectedExperience"
              class="block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Any Level</option>
              <option v-for="level in experienceLevels" :key="level.id" :value="level.id">
                {{ level.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Jobs Grid -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="text-center py-12">
      <div class="text-red-600 mb-2">Error loading jobs</div>
      <button @click="fetchJobs" class="text-blue-600 hover:text-blue-800">Try Again</button>
    </div>

    <div v-else>
      <!-- Job Count -->
      <div class="mb-4 text-sm text-gray-600">
        Showing {{ filteredJobs.length }} of {{ totalJobs }} jobs
      </div>

      <!-- Jobs Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="job in filteredJobs"
          :key="job._id"
          class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
        >
          <!-- Job Header -->
          <div class="p-4 border-b border-gray-100">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {{ job.title }}
                </h3>
                <div class="flex items-center mt-1">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ getCategoryName(job.category) }}
                  </span>
                  <span v-if="job.subcategory" class="ml-2 text-sm text-gray-600">
                    • {{ job.subcategory }}
                  </span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-xl font-bold text-gray-900">₹{{ job.wage }}</div>
                <div class="text-sm text-gray-500">{{ job.wageType }}/{{ job.duration }}</div>
              </div>
            </div>
          </div>

          <!-- Job Details -->
          <div class="p-4">
            <div class="mb-3">
              <p class="text-gray-600 text-sm line-clamp-2">{{ job.description }}</p>
            </div>

            <!-- Location -->
            <div class="flex items-center text-gray-600 mb-2">
              <svg class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-sm">{{ job.location.city }}, {{ job.location.state }}</span>
            </div>

            <!-- Requirements -->
            <div class="mb-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="skill in job.requirements.skills?.slice(0, 3)"
                  :key="skill"
                  class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ skill }}
                </span>
                <span v-if="job.requirements.skills?.length > 3" class="text-xs text-gray-500">
                  +{{ job.requirements.skills.length - 3 }} more
                </span>
              </div>
            </div>

            <!-- Job Footer -->
            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span class="text-blue-600 font-semibold text-sm">
                      {{ getInitials(job.employerName) }}
                    </span>
                  </div>
                </div>
                <div class="ml-2">
                  <p class="text-sm font-medium text-gray-900">{{ job.employerName }}</p>
                  <p class="text-xs text-gray-500">Posted {{ formatDate(job.postedAt) }}</p>
                </div>
              </div>

              <div>
                <button
                  v-if="!job.hasApplied"
                  @click="applyForJob(job._id)"
                  :disabled="applyingJobId === job._id"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <span v-if="applyingJobId === job._id" class="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                  Apply Now
                </button>
                <span
                  v-else
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100"
                >
                  Applied
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No Jobs Message -->
      <div v-if="filteredJobs.length === 0" class="text-center py-12">
        <div class="text-gray-500 mb-2">No jobs match your filters</div>
        <button @click="clearFilters" class="text-blue-600 hover:text-blue-800">
          Clear filters
        </button>
      </div>

      <!-- Pagination -->
      <div v-if="filteredJobs.length > 0" class="mt-8 flex justify-center">
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { jobCategories, workTypes, experienceLevels } from '@/utils/categories'

const router = useRouter()
const jobsStore = useJobsStore()

// Refs
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedLocation = ref('')
const selectedWorkType = ref('')
const selectedExperience = ref('')
const minWage = ref('')
const maxWage = ref('')
const showAdvancedFilters = ref(false)
const applyingJobId = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(12)

// Computed
const filteredJobs = computed(() => {
  let filtered = jobsStore.jobs

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(job =>
      job.title.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query) ||
      job.category.toLowerCase().includes(query) ||
      job.location.city.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(job => job.category === selectedCategory.value)
  }

  // Location filter
  if (selectedLocation.value) {
    if (selectedLocation.value === 'nearby') {
      // Implement nearby logic
    } else {
      filtered = filtered.filter(job => job.location.city === selectedLocation.value)
    }
  }

  // Wage filter
  if (minWage.value) {
    filtered = filtered.filter(job => job.wage >= parseFloat(minWage.value))
  }
  if (maxWage.value) {
    filtered = filtered.filter(job => job.wage <= parseFloat(maxWage.value))
  }

  // Work type filter
  if (selectedWorkType.value) {
    filtered = filtered.filter(job => job.workType === selectedWorkType.value)
  }

  // Experience filter
  if (selectedExperience.value) {
    filtered = filtered.filter(job => job.requirements.experience === selectedExperience.value)
  }

  return filtered
})

const totalJobs = computed(() => jobsStore.jobs.length)
const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage.value))
const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredJobs.value.slice(start, end)
})

const categories = computed(() => jobCategories)
const locations = computed(() => {
  const allLocations = [...new Set(jobsStore.jobs.map(job => job.location.city))]
  return allLocations.sort()
})

// Methods
const fetchJobs = async () => {
  try {
    await jobsStore.fetchJobs()
  } catch (error) {
    console.error('Error fetching jobs:', error)
  }
}

const applyForJob = async (jobId) => {
  applyingJobId.value = jobId
  try {
    await jobsStore.applyForJob(jobId)
    // Show success message
  } catch (error) {
    console.error('Error applying for job:', error)
  } finally {
    applyingJobId.value = null
  }
}

const getCategoryName = (categoryId) => {
  const category = jobCategories.find(c => c.id === categoryId)
  return category ? category.name : categoryId
}

const getInitials = (name) => {
  if (!name) return '??'
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return date.toLocaleDateString()
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedLocation.value = ''
  selectedWorkType.value = ''
  selectedExperience.value = ''
  minWage.value = ''
  maxWage.value = ''
  currentPage.value = 1
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Watchers
watch([selectedCategory, selectedLocation, searchQuery], () => {
  currentPage.value = 1
})

// Lifecycle
onMounted(() => {
  fetchJobs()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
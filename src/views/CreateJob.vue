<template>
  <div class="create-job">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Post a New Job</h1>
            <p class="text-gray-600 mt-2">Fill in the details to find the right workers</p>
          </div>
          <button
            @click="router.back()"
            class="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <svg class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>
      </div>

      <!-- Progress Steps -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div v-for="(step, index) in steps" :key="step.id" class="flex items-center">
            <div
              :class="[
                'flex items-center justify-center w-8 h-8 rounded-full border-2',
                currentStep >= index + 1
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-gray-300 text-gray-500'
              ]"
            >
              {{ index + 1 }}
            </div>
            <span
              :class="[
                'ml-2 text-sm font-medium',
                currentStep >= index + 1 ? 'text-blue-600' : 'text-gray-500'
              ]"
            >
              {{ step.name }}
            </span>
            <div
              v-if="index < steps.length - 1"
              :class="[
                'ml-2 w-16 h-0.5',
                currentStep > index + 1 ? 'bg-blue-600' : 'bg-gray-300'
              ]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Step 1: Job Details -->
        <div v-if="currentStep === 1" class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
            
            <!-- Job Title -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Job Title *
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="e.g., Construction Worker, Delivery Driver, Office Assistant"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="mt-1 text-sm text-gray-500">
                Be specific about the job role
              </p>
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                required
                placeholder="Describe the job responsibilities, duties, and expectations..."
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
              <p class="mt-1 text-sm text-gray-500">
                Detailed descriptions attract better applicants
              </p>
            </div>

            <!-- Category Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Job Category *
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  v-for="category in jobCategories"
                  :key="category.id"
                  type="button"
                  @click="selectCategory(category)"
                  :class="[
                    'p-3 rounded-lg border-2 text-left transition-all',
                    form.category === category.id
                      ? 'border-blue-500 bg-blue-50 transform scale-105'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  ]"
                >
                  <div class="flex items-center">
                    <span class="text-xl mr-2">{{ category.icon }}</span>
                    <div>
                      <div class="font-medium text-gray-900">{{ category.name }}</div>
                      <div class="text-xs text-gray-500 mt-1">{{ category.description }}</div>
                    </div>
                  </div>
                </button>
              </div>
              <div v-if="form.category" class="mt-4 p-3 bg-blue-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-blue-900">
                      {{ selectedCategory?.name }}
                    </div>
                    <div class="text-sm text-blue-700 mt-1">
                      {{ selectedCategory?.description }}
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="form.category = ''; form.subcategory = ''"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    Change
                  </button>
                </div>
                
                <!-- Subcategory Selection -->
                <div v-if="selectedCategory?.subcategories.length > 0" class="mt-3">
                  <label class="block text-sm font-medium text-blue-900 mb-1">
                    Select Subcategory (Optional)
                  </label>
                  <select
                    v-model="form.subcategory"
                    class="block w-full border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Choose a subcategory</option>
                    <option
                      v-for="sub in selectedCategory.subcategories"
                      :key="sub"
                      :value="sub"
                    >
                      {{ sub }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Work Type -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Work Type *
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
                <button
                  v-for="type in workTypes"
                  :key="type.id"
                  type="button"
                  @click="form.workType = type.id"
                  :class="[
                    'p-3 rounded-lg border text-center transition-colors',
                    form.workType === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  ]"
                >
                  <div class="text-lg">{{ type.icon }}</div>
                  <div class="text-sm font-medium mt-1">{{ type.name }}</div>
                  <div class="text-xs text-gray-500 mt-1">{{ type.description }}</div>
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              type="button"
              @click="nextStep"
              :disabled="!canProceedToStep2"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Location & Requirements
            </button>
          </div>
        </div>

        <!-- Step 2: Location & Requirements -->
        <div v-if="currentStep === 2" class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Location & Requirements</h2>
            
            <!-- Location Type -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Work Location
              </label>
              <div class="space-y-4">
                <!-- On-site Location -->
                <div v-if="!form.location.isRemote">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        v-model="form.location.address"
                        type="text"
                        placeholder="Street and building number"
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        v-model="form.location.city"
                        type="text"
                        required
                        placeholder="City"
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        v-model="form.location.state"
                        type="text"
                        required
                        placeholder="State"
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Pincode *
                      </label>
                      <input
                        v-model="form.location.pincode"
                        type="text"
                        required
                        placeholder="6-digit pincode"
                        pattern="[0-9]{6}"
                        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <!-- Use Current Location -->
                  <div class="mt-4">
                    <button
                      type="button"
                      @click="useCurrentLocation"
                      :disabled="gettingLocation"
                      class="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                      <svg
                        v-if="gettingLocation"
                        class="animate-spin h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {{ gettingLocation ? 'Getting location...' : 'Use my current location' }}
                    </button>
                  </div>
                </div>
                
                <!-- Remote Work Option -->
                <div class="flex items-center">
                  <input
                    id="remote-work"
                    v-model="form.location.isRemote"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="remote-work" class="ml-2 block text-sm text-gray-900">
                    This is a remote/work-from-home job
                  </label>
                </div>
              </div>
            </div>

            <!-- Requirements -->
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                
                <!-- Experience Level -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Experience Required
                  </label>
                  <select
                    v-model="form.requirements.experience"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">No experience required</option>
                    <option
                      v-for="level in experienceLevels"
                      :key="level.id"
                      :value="level.id"
                    >
                      {{ level.name }}
                    </option>
                  </select>
                </div>

                <!-- Skills -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Required Skills (Optional)
                  </label>
                  <div class="flex flex-wrap gap-2 mb-2">
                    <span
                      v-for="(skill, index) in form.requirements.skills"
                      :key="index"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {{ skill }}
                      <button
                        type="button"
                        @click="removeSkill(index)"
                        class="ml-1.5 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  </div>
                  <div class="flex">
                    <input
                      v-model="newSkill"
                      type="text"
                      placeholder="Add a skill (e.g., carpentry, driving, cooking)"
                      @keyup.enter="addSkill"
                      class="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      @click="addSkill"
                      class="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-200"
                    >
                      Add
                    </button>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">
                    Press Enter or click Add to include a skill
                  </p>
                </div>

                <!-- Gender Preference -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Gender Preference
                  </label>
                  <select
                    v-model="form.requirements.genderPreference"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="any">Any Gender</option>
                    <option value="male">Male Only</option>
                    <option value="female">Female Only</option>
                    <option value="transgender">Transgender</option>
                    <option value="no-preference">No Preference</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between">
            <button
              type="button"
              @click="prevStep"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <button
              type="button"
              @click="nextStep"
              :disabled="!canProceedToStep3"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next: Payment & Duration
            </button>
          </div>
        </div>

        <!-- Step 3: Payment & Duration -->
        <div v-if="currentStep === 3" class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Payment & Duration</h2>
            
            <!-- Payment Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Wage/Salary *
                </label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    v-model="form.wage"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    class="block w-full pl-7 pr-12 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div class="absolute inset-y-0 right-0 flex items-center">
                    <select
                      v-model="form.wageType"
                      class="h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 focus:ring-blue-500 focus:border-blue-500 rounded-r-md"
                    >
                      <option value="hourly">per hour</option>
                      <option value="daily">per day</option>
                      <option value="weekly">per week</option>
                      <option value="monthly">per month</option>
                      <option value="fixed">fixed amount</option>
                    </select>
                  </div>
                </div>
                <p class="mt-1 text-sm text-gray-500">
                  Competitive wages attract better candidates
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Workers Needed *
                </label>
                <input
                  v-model="form.workersNeeded"
                  type="number"
                  required
                  min="1"
                  max="100"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <p class="mt-1 text-sm text-gray-500">
                  How many workers do you need?
                </p>
              </div>
            </div>

            <!-- Duration -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Job Duration
              </label>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  v-for="duration in durations"
                  :key="duration.id"
                  type="button"
                  @click="form.duration = duration.id"
                  :class="[
                    'p-3 rounded-lg border text-center transition-colors',
                    form.duration === duration.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  ]"
                >
                  <div class="text-lg">{{ duration.icon }}</div>
                  <div class="text-sm font-medium mt-1">{{ duration.name }}</div>
                  <div v-if="duration.id !== 'one-time'" class="mt-2">
                    <input
                      v-model="form.estimatedDuration"
                      type="number"
                      min="1"
                      placeholder="Number"
                      class="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                      @click.stop
                    />
                    <span class="text-xs text-gray-500 ml-1">{{ duration.id }}</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Dates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  v-model="form.startDate"
                  type="date"
                  :min="today"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <input
                  v-model="form.endDate"
                  type="date"
                  :min="form.startDate || today"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <!-- Facilities -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Facilities Provided (Optional)
              </label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input
                    id="accommodation"
                    v-model="form.accommodationProvided"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="accommodation" class="ml-2 block text-sm text-gray-900">
                    Accommodation Provided
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="food"
                    v-model="form.foodProvided"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="food" class="ml-2 block text-sm text-gray-900">
                    Food Provided
                  </label>
                </div>
                <div class="flex items-center">
                  <input
                    id="transportation"
                    v-model="form.transportationProvided"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="transportation" class="ml-2 block text-sm text-gray-900">
                    Transportation Provided
                  </label>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Payment Method *
              </label>
              <select
                v-model="form.paymentMethod"
                required
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select payment method</option>
                <option value="cash">Cash</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="upi">UPI</option>
                <option value="wallet">Wallet</option>
                <option value="cheque">Cheque</option>
              </select>
            </div>
          </div>

          <!-- Step 3 Actions -->
          <div class="flex justify-between">
            <button
              type="button"
              @click="prevStep"
              class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            <div class="space-x-3">
              <button
                type="button"
                @click="saveDraft"
                :disabled="loading"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                :disabled="loading || !canSubmit"
                class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="animate-spin h-4 w-4 inline-block border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Post Job
              </button>
            </div>
          </div>
        </div>
      </form>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-lg max-w-md w-full p-6">
          <div class="text-center">
            <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Job Posted Successfully!</h3>
            <p class="text-sm text-gray-500 mb-4">
              Your job listing is now live and visible to workers.
            </p>
            <div class="space-y-3">
              <button
                @click="goToJobListings"
                class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View Job Listings
              </button>
              <button
                @click="postAnotherJob"
                class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Post Another Job
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useJobsStore } from '@/stores/jobs'
import { useAuthStore } from '@/stores/auth'
import { jobCategories, workTypes, experienceLevels } from '@/utils/categories'

const router = useRouter()
const jobsStore = useJobsStore()
const authStore = useAuthStore()

// Steps
const steps = [
  { id: 1, name: 'Job Details' },
  { id: 2, name: 'Location & Requirements' },
  { id: 3, name: 'Payment & Duration' }
]

// Durations
const durations = [
  { id: 'hours', name: 'Hourly', icon: '⏰' },
  { id: 'days', name: 'Daily', icon: '📅' },
  { id: 'weeks', name: 'Weekly', icon: '🗓️' },
  { id: 'months', name: 'Monthly', icon: '📆' },
  { id: 'one-time', name: 'One-time', icon: '✅' }
]

// Form Data
const form = ref({
  title: '',
  description: '',
  category: '',
  subcategory: '',
  workType: 'daily-wage',
  location: {
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    isRemote: false
  },
  requirements: {
    experience: '',
    skills: [],
    genderPreference: 'any',
    ageRange: {
      min: null,
      max: null
    }
  },
  duration: 'days',
  estimatedDuration: 1,
  startDate: '',
  endDate: '',
  workersNeeded: 1,
  wage: '',
  wageType: 'daily',
  paymentMethod: 'cash',
  accommodationProvided: false,
  foodProvided: false,
  transportationProvided: false
})

// UI State
const currentStep = ref(1)
const loading = ref(false)
const showSuccessModal = ref(false)
const newSkill = ref('')
const gettingLocation = ref(false)
const today = new Date().toISOString().split('T')[0]

// Computed
const selectedCategory = computed(() => {
  return jobCategories.find(c => c.id === form.value.category)
})

const canProceedToStep2 = computed(() => {
  return form.value.title && form.value.description && form.value.category
})

const canProceedToStep3 = computed(() => {
  return form.value.location.city && form.value.location.state && form.value.location.pincode
})

const canSubmit = computed(() => {
  return form.value.wage && form.value.paymentMethod
})

// Methods
const nextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const selectCategory = (category) => {
  form.value.category = category.id
  form.value.subcategory = ''
}

const addSkill = () => {
  if (newSkill.value.trim() && !form.value.requirements.skills.includes(newSkill.value.trim())) {
    form.value.requirements.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (index) => {
  form.value.requirements.skills.splice(index, 1)
}

const useCurrentLocation = () => {
  gettingLocation.value = true
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Reverse geocode would go here (using a geocoding API)
        // For now, we'll just log the coordinates
        console.log('Coordinates:', latitude, longitude)
        
        // Simulate getting location data
        setTimeout(() => {
          form.value.location.city = 'Your City'
          form.value.location.state = 'Your State'
          gettingLocation.value = false
        }, 1000)
      },
      (error) => {
        console.error('Error getting location:', error)
        gettingLocation.value = false
      }
    )
  } else {
    alert('Geolocation is not supported by your browser')
    gettingLocation.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    // Prepare job data
    const jobData = {
      ...form.value,
      status: 'active',
      employer: authStore.user?.id,
      employerName: authStore.user?.fullName || `${authStore.user?.firstName} ${authStore.user?.lastName}`
    }
    
    await jobsStore.createJob(jobData)
    showSuccessModal.value = true
    
  } catch (error) {
    console.error('Error creating job:', error)
    alert('Failed to create job. Please try again.')
  } finally {
    loading.value = false
  }
}

const saveDraft = async () => {
  loading.value = true
  
  try {
    const jobData = {
      ...form.value,
      status: 'draft',
      employer: authStore.user?.id,
      employerName: authStore.user?.fullName
    }
    
    await jobsStore.createJob(jobData)
    alert('Job saved as draft successfully!')
    
  } catch (error) {
    console.error('Error saving draft:', error)
    alert('Failed to save draft.')
  } finally {
    loading.value = false
  }
}

const goToJobListings = () => {
  showSuccessModal.value = false
  router.push('/employer/jobs')
}

const postAnotherJob = () => {
  showSuccessModal.value = false
  // Reset form
  Object.assign(form.value, {
    title: '',
    description: '',
    category: '',
    subcategory: '',
    workType: 'daily-wage',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
      isRemote: false
    },
    requirements: {
      experience: '',
      skills: [],
      genderPreference: 'any',
      ageRange: {
        min: null,
        max: null
      }
    },
    duration: 'days',
    estimatedDuration: 1,
    startDate: '',
    endDate: '',
    workersNeeded: 1,
    wage: '',
    wageType: 'daily',
    paymentMethod: 'cash',
    accommodationProvided: false,
    foodProvided: false,
    transportationProvided: false
  })
  currentStep.value = 1
}

// Initialize start date to tomorrow
onMounted(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  form.value.startDate = tomorrow.toISOString().split('T')[0]
})
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}
</style>
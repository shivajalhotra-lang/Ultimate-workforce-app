<template>
  <div class="not-found">
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div class="max-w-md w-full text-center">
        <!-- Illustration -->
        <div class="mb-8">
          <div class="relative w-64 h-64 mx-auto">
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-48 h-48 bg-blue-100 rounded-full"></div>
            </div>
            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="h-32 w-32 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Content -->
        <h1 class="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p class="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>

        <!-- Actions -->
        <div class="space-y-4">
          <button
            @click="goHome"
            class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Go to Homepage
          </button>
          
          <div class="grid grid-cols-2 gap-4">
            <button
              @click="goBack"
              class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              Go Back
            </button>
            <button
              @click="goToJobs"
              class="px-6 py-3 border border-blue-300 text-blue-600 font-medium rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        </div>

        <!-- Help Links -->
        <div class="mt-12 pt-8 border-t border-gray-200">
          <p class="text-sm text-gray-500 mb-4">Here are some helpful links:</p>
          <div class="flex flex-wrap justify-center gap-4">
            <router-link to="/" class="text-sm text-blue-600 hover:text-blue-800">
              Home
            </router-link>
            <router-link v-if="isAuthenticated && userRole === 'worker'" to="/worker/jobs" class="text-sm text-blue-600 hover:text-blue-800">
              Find Jobs
            </router-link>
            <router-link v-if="isAuthenticated && userRole === 'employer'" to="/employer/jobs/create" class="text-sm text-blue-600 hover:text-blue-800">
              Post a Job
            </router-link>
            <router-link to="/login" class="text-sm text-blue-600 hover:text-blue-800">
              Sign In
            </router-link>
            <router-link to="/register" class="text-sm text-blue-600 hover:text-blue-800">
              Sign Up
            </router-link>
          </div>
        </div>

        <!-- Search -->
        <div class="mt-8">
          <p class="text-sm text-gray-500 mb-3">Or search for what you need:</p>
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search jobs, workers, employers..."
              @keyup.enter="performSearch"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              @click="performSearch"
              class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Fun Facts -->
      <div class="mt-12 w-full max-w-2xl">
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Did you know?</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="flex items-start">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">Thousands of Jobs</h4>
                <p class="text-sm text-gray-600 mt-1">
                  We have over 10,000+ daily wage jobs posted every month
                </p>
              </div>
            </div>
            <div class="flex items-start">
              <div class="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <svg class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 class="font-medium text-gray-900">50,000+ Workers</h4>
                <p class="text-sm text-gray-600 mt-1">
                  Join our community of skilled workers across India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')

// Computed
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userRole = computed(() => authStore.user?.role)

// Methods
const goHome = () => {
  if (isAuthenticated.value) {
    switch (userRole.value) {
      case 'worker':
        router.push('/worker')
        break
      case 'employer':
        router.push('/employer')
        break
      case 'admin':
        router.push('/admin')
        break
      default:
        router.push('/')
    }
  } else {
    router.push('/')
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    goHome()
  }
}

const goToJobs = () => {
  if (isAuthenticated.value && userRole.value === 'worker') {
    router.push('/worker/jobs')
  } else {
    router.push('/')
  }
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    // Redirect to search page with query
    router.push(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
}
</style>
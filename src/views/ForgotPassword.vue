<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Or
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            back to login
          </router-link>
        </p>
      </div>
      
      <div v-if="!emailSent" class="mt-8 space-y-6">
        <form @submit.prevent="handleForgotPassword">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div v-if="error" class="mt-4 text-red-600 text-sm text-center">
            {{ error }}
          </div>

          <div class="mt-6">
            <button
              type="submit"
              :disabled="loading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading ? 'Sending...' : 'Send reset link' }}
            </button>
          </div>
        </form>
      </div>

      <div v-else class="mt-8 text-center">
        <div class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                Check your email
              </h3>
              <div class="mt-2 text-sm text-green-700">
                <p>We've sent a password reset link to {{ email }}</p>
                <p class="mt-2">Please check your inbox and follow the instructions.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <router-link to="/login" class="font-medium text-blue-600 hover:text-blue-500">
            ← Back to login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { authService } from '@/services/auth';

const email = ref('');
const loading = ref(false);
const error = ref('');
const emailSent = ref(false);

const handleForgotPassword = async () => {
  loading.value = true;
  error.value = '';

  try {
    await authService.forgotPassword(email.value);
    emailSent.value = true;
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to send reset email';
  } finally {
    loading.value = false;
  }
};
</script>
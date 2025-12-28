<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="text-xl font-bold text-blue-600">
              Ultimate Workforce
            </router-link>
          </div>
          <div v-if="isAuthenticated" class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.to"
              :class="[
                $route.path.startsWith(item.to)
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
              ]"
            >
              {{ item.name }}
            </router-link>
          </div>
        </div>
        
        <div class="flex items-center">
          <div v-if="isAuthenticated" class="flex items-center space-x-4">
            <router-link
              to="/notifications"
              class="relative p-1 text-gray-400 hover:text-gray-500"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span
                v-if="unreadCount > 0"
                class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"
              />
            </router-link>
            
            <div class="relative">
              <button
                @click="showDropdown = !showDropdown"
                class="flex items-center space-x-2 focus:outline-none"
              >
                <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span class="text-blue-600 font-semibold">
                    {{ userInitials }}
                  </span>
                </div>
                <span class="text-sm font-medium text-gray-700">
                  {{ userName }}
                </span>
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
              
              <!-- Dropdown menu -->
              <div
                v-if="showDropdown"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              >
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showDropdown = false"
                >
                  Your Profile
                </router-link>
                <router-link
                  to="/settings"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showDropdown = false"
                >
                  Settings
                </router-link>
                <div class="border-t border-gray-100"></div>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="flex items-center space-x-4">
            <router-link
              to="/login"
              class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign in
            </router-link>
            <router-link
              to="/register"
              class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign up
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const showDropdown = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const user = computed(() => authStore.user);
const userInitials = computed(() => {
  if (!user.value) return '';
  return `${user.value.firstName?.[0] || ''}${user.value.lastName?.[0] || ''}`.toUpperCase();
});
const userName = computed(() => {
  if (!user.value) return '';
  return `${user.value.firstName} ${user.value.lastName}`;
});

const unreadCount = ref(0);

const navigation = computed(() => {
  if (!user.value) return [];
  
  switch (user.value.role) {
    case 'worker':
      return [
        { name: 'Dashboard', to: '/worker' },
        { name: 'Find Jobs', to: '/worker/jobs' },
        { name: 'Wallet', to: '/worker/wallet' },
        { name: 'Applications', to: '/worker/applications' }
      ];
    case 'employer':
      return [
        { name: 'Dashboard', to: '/employer' },
        { name: 'My Jobs', to: '/employer/jobs' },
        { name: 'Post Job', to: '/employer/jobs/create' },
        { name: 'Workers', to: '/employer/workers' }
      ];
    case 'admin':
      return [
        { name: 'Dashboard', to: '/admin' },
        { name: 'Users', to: '/admin/users' },
        { name: 'Reports', to: '/admin/reports' },
        { name: 'Settings', to: '/admin/settings' }
      ];
    default:
      return [];
  }
});

const handleLogout = async () => {
  showDropdown.value = false;
  authStore.logout();
  window.location.href = '/login';
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
<!-- File: /src/views/auth/Login.vue -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
    <!-- Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-20 -right-20 w-64 h-64 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
    </div>

    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Back Button -->
      <button @click="router.back()" class="absolute -top-16 left-0 flex items-center text-gray-600 hover:text-primary-600 transition-colors">
        <ChevronLeft class="w-5 h-5 mr-1" />
        Back
      </button>

      <!-- Card -->
      <div class="bg-white/80 backdrop-blur-xs rounded-3xl p-8 shadow-2xl border border-white/20">
        <!-- Logo -->
        <div class="flex justify-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Briefcase class="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 class="text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p class="text-gray-600 text-center mb-8">Sign in to continue to your dashboard</p>

        <!-- Phone Input -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500">+91</span>
            </div>
            <input 
              v-model="phone"
              type="tel"
              placeholder="Enter your 10-digit number"
              class="pl-16 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              @keyup.enter="sendOTP"
            />
          </div>
        </div>

        <!-- OTP Input (shown after phone entry) -->
        <div v-if="showOTP" class="mb-6 animate-slide-in">
          <label class="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
          <div class="flex space-x-3">
            <input 
              v-for="i in 6"
              :key="i"
              v-model="otp[i-1]"
              type="text"
              maxlength="1"
              class="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200"
              @input="onOtpInput(i-1, $event)"
              @keydown.delete="onOtpDelete(i-1, $event)"
              ref="otpInputs"
            />
          </div>
          <div class="flex justify-between items-center mt-3">
            <span class="text-sm text-gray-500">Didn't receive OTP?</span>
            <button @click="resendOTP" class="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Resend OTP
            </button>
          </div>
        </div>

        <!-- Role Selection (after OTP verification) -->
        <div v-if="showRoleSelection" class="mb-6 animate-slide-in">
          <label class="block text-sm font-medium text-gray-700 mb-3">Continue as</label>
          <div class="grid grid-cols-3 gap-3">
            <button 
              v-for="role in roles"
              :key="role.id"
              @click="selectRole(role.id)"
              :class="[
                'p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center',
                selectedRole === role.id 
                  ? 'border-primary-500 bg-primary-50 shadow-md transform scale-105' 
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              ]"
            >
              <component :is="role.icon" class="w-6 h-6 mb-2" :class="selectedRole === role.id ? 'text-primary-600' : 'text-gray-400'" />
              <span class="text-sm font-medium">{{ role.name }}</span>
            </button>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <button 
            v-if="!showOTP"
            @click="sendOTP"
            :disabled="!isPhoneValid"
            :class="[
              'w-full py-3 rounded-xl font-semibold transition-all duration-300',
              isPhoneValid
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            Send OTP
          </button>

          <button 
            v-if="showOTP && !showRoleSelection"
            @click="verifyOTP"
            :disabled="!isOtpComplete"
            :class="[
              'w-full py-3 rounded-xl font-semibold transition-all duration-300',
              isOtpComplete
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            Verify & Continue
          </button>

          <button 
            v-if="showRoleSelection"
            @click="login"
            :disabled="!selectedRole"
            :class="[
              'w-full py-3 rounded-xl font-semibold transition-all duration-300',
              selectedRole
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            Enter Dashboard
          </button>
        </div>

        <!-- Divider -->
        <div class="my-8 flex items-center">
          <div class="flex-1 border-t border-gray-300"></div>
          <span class="mx-4 text-sm text-gray-500">or</span>
          <div class="flex-1 border-t border-gray-300"></div>
        </div>

        <!-- Demo Login -->
        <div class="text-center">
          <p class="text-sm text-gray-600 mb-4">Want to explore? Try demo login</p>
          <div class="grid grid-cols-3 gap-2">
            <button 
              v-for="demo in demoLogins"
              :key="demo.role"
              @click="useDemoLogin(demo)"
              class="py-2 text-xs rounded-lg border border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              {{ demo.label }}
            </button>
          </div>
        </div>

        <!-- Register Link -->
        <div class="text-center mt-8">
          <p class="text-gray-600">
            New user? 
            <router-link to="/register" class="text-primary-600 hover:text-primary-700 font-medium">
              Create an account
            </router-link>
          </p>
        </div>
      </div>

      <!-- Language Toggle -->
      <div class="flex justify-center mt-6">
        <button 
          @click="toggleLanguage"
          class="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors"
        >
          <Globe class="w-4 h-4 mr-2" />
          {{ currentLanguage === 'en' ? 'हिंदी' : 'English' }}
        </button>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toast.show" class="fixed top-4 right-4 z-50 animate-fade-in">
      <div :class="[
        'px-4 py-3 rounded-xl shadow-lg flex items-center space-x-3',
        toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
        toast.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
        'bg-blue-50 border border-blue-200 text-blue-800'
      ]">
        <CheckCircle v-if="toast.type === 'success'" class="w-5 h-5" />
        <XCircle v-if="toast.type === 'error'" class="w-5 h-5" />
        <span class="font-medium">{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, 
  Briefcase, 
  Shield,
  ChevronLeft,
  Globe,
  CheckCircle,
  XCircle
} from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

// State
const phone = ref('')
const showOTP = ref(false)
const otp = ref(Array(6).fill(''))
const showRoleSelection = ref(false)
const selectedRole = ref('')
const currentLanguage = ref('en')
const toast = ref({ show: false, message: '', type: 'success' })
const otpInputs = ref([])

// Demo logins
const demoLogins = [
  { phone: '9876543210', otp: '123456', role: 'worker', label: '👷 Worker Demo' },
  { phone: '9876543211', otp: '123456', role: 'employer', label: '👔 Employer Demo' },
  { phone: '9876543212', otp: '123456', role: 'admin', label: '🛡️ Admin Demo' }
]

const roles = [
  { id: 'worker', name: 'Worker', icon: User },
  { id: 'employer', name: 'Employer', icon: Briefcase },
  { id: 'admin', name: 'Admin', icon: Shield }
]

// Computed
const isPhoneValid = computed(() => {
  return /^[6-9]\d{9}$/.test(phone.value)
})

const isOtpComplete = computed(() => {
  return otp.value.every(digit => digit !== '') && otp.value.length === 6
})

// Methods
const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

const sendOTP = async () => {
  if (!isPhoneValid.value) return
  
  // Simulate API call
  showToast('OTP sent to your phone', 'success')
  showOTP.value = true
  
  await nextTick()
  if (otpInputs.value[0]) {
    otpInputs.value[0].focus()
  }
}

const resendOTP = () => {
  showToast('New OTP sent', 'success')
  otp.value = Array(6).fill('')
  if (otpInputs.value[0]) {
    otpInputs.value[0].focus()
  }
}

const onOtpInput = (index, event) => {
  const value = event.target.value
  if (value && index < 5) {
    otpInputs.value[index + 1]?.focus()
  }
}

const onOtpDelete = (index, event) => {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    otpInputs.value[index - 1]?.focus()
  }
}

const verifyOTP = () => {
  // Simulate OTP verification
  if (otp.value.join('') === '123456') {
    showToast('OTP verified successfully', 'success')
    showRoleSelection.value = true
  } else {
    showToast('Invalid OTP. Try 123456 for demo', 'error')
  }
}

const selectRole = (role) => {
  selectedRole.value = role
}

const login = async () => {
  if (!selectedRole.value) return
  
  try {
    await authStore.login({
      phone: phone.value,
      role: selectedRole.value
    })
    
    showToast(`Welcome ${selectedRole.value}!`, 'success')
    
    // Navigate to dashboard based on role
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
    
  } catch (error) {
    showToast('Login failed. Please try again.', 'error')
  }
}

const useDemoLogin = (demo) => {
  phone.value = demo.phone
  sendOTP()
  setTimeout(() => {
    otp.value = demo.otp.split('')
    verifyOTP()
    setTimeout(() => {
      selectedRole.value = demo.role
      login()
    }, 500)
  }, 1000)
}

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'en' ? 'hi' : 'en'
  // In real app, update i18n locale
}
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
<!-- File: /src/views/Landing.vue -->
<template>
  <div class="landing-page min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-slow"></div>
    </div>

    <!-- Navigation -->
    <nav class="relative z-10 px-6 py-4">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <div class="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Briefcase class="w-6 h-6 text-white" />
          </div>
          <span class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            ShramikConnect
          </span>
        </div>
        <div class="hidden md:flex items-center space-x-8">
          <a href="#" class="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium">Features</a>
          <a href="#" class="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium">Pricing</a>
          <a href="#" class="text-gray-600 hover:text-primary-600 transition-colors duration-200 font-medium">About</a>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="router.push('/login')" class="px-4 py-2 text-primary-600 font-medium hover:text-primary-700 transition-colors">
            Sign In
          </button>
          <button @click="router.push('/register')" class="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-medium rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
            Get Started
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <main class="relative z-10 px-6 py-12 md:py-24">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <h1 class="text-5xl md:text-7xl font-bold mb-6">
            <span class="block text-gray-900">Connecting </span>
            <span class="block bg-gradient-to-r from-primary-600 via-secondary-600 to-success-600 bg-clip-text text-transparent">
              Workforce with Opportunities
            </span>
          </h1>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            India's most beautiful platform connecting skilled workers with employers. 
            Transparent wages, instant payments, and government-verified trust.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button @click="router.push('/register')" class="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2">
              <User class="w-5 h-5" />
              <span>Register as Worker</span>
            </button>
            <button @click="router.push('/register')" class="px-8 py-4 bg-gradient-to-r from-success-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2">
              <Briefcase class="w-5 h-5" />
              <span>Register as Employer</span>
            </button>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="grid md:grid-cols-3 gap-8 mb-20">
          <div v-for="feature in features" :key="feature.title" class="bg-white/80 backdrop-blur-xs rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-white/20">
            <div class="w-14 h-14 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center mb-6 shadow-lg">
              <component :is="feature.icon" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="bg-gradient-to-r from-primary-500/10 to-secondary-500/10 backdrop-blur-xs rounded-3xl p-8 mb-20">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <div class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                {{ stat.value }}
              </div>
              <div class="text-gray-600 font-medium">{{ stat.label }}</div>
            </div>
          </div>
        </div>

        <!-- How It Works -->
        <div class="mb-20">
          <h2 class="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div class="relative">
            <!-- Timeline -->
            <div class="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary-500 to-secondary-500"></div>
            
            <div class="space-y-12">
              <div v-for="(step, index) in steps" :key="step.title" class="relative">
                <div :class="['flex flex-col md:flex-row items-center', index % 2 === 0 ? 'md:flex-row-reverse' : '']">
                  <div class="md:w-1/2 mb-6 md:mb-0 md:px-12">
                    <div class="bg-white rounded-2xl p-8 shadow-lg">
                      <div class="flex items-center mb-4">
                        <div class="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {{ index + 1 }}
                        </div>
                        <h3 class="text-2xl font-bold ml-4">{{ step.title }}</h3>
                      </div>
                      <p class="text-gray-600">{{ step.description }}</p>
                    </div>
                  </div>
                  <div class="md:w-1/2 md:px-12">
                    <div class="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-2xl p-6">
                      <img :src="step.image" :alt="step.title" class="rounded-xl shadow-lg w-full h-48 object-cover">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-6 md:mb-0">
            <div class="flex items-center space-x-2 mb-4">
              <div class="w-10 h-10 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                <Briefcase class="w-6 h-6 text-white" />
              </div>
              <span class="text-2xl font-bold">ShramikConnect</span>
            </div>
            <p class="text-gray-400">Empowering India's workforce with technology</p>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© 2024 ShramikConnect. A Government-verified platform.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { User, Briefcase, Wallet, Shield, Clock, TrendingUp } from 'lucide-vue-next'

const router = useRouter()

const features = [
  {
    icon: Wallet,
    title: 'Instant Payments',
    description: 'Get paid directly to your bank or UPI within hours of job completion'
  },
  {
    icon: Shield,
    title: 'Government Verified',
    description: 'All workers and employers are verified with Aadhaar for trust and safety'
  },
  {
    icon: Clock,
    title: 'Real-time Matching',
    description: 'Find jobs or workers instantly with our intelligent matching algorithm'
  },
  {
    icon: TrendingUp,
    title: 'Fair Wages',
    description: 'Transparent wage ranges set according to government guidelines'
  }
]

const stats = [
  { value: '10,000+', label: 'Active Workers' },
  { value: '2,500+', label: 'Verified Employers' },
  { value: '₹50L+', label: 'Wages Processed' },
  { value: '98%', label: 'Satisfaction Rate' }
]

const steps = [
  {
    title: 'Create Your Profile',
    description: 'Register with Aadhaar verification and showcase your skills',
    image: 'https://images.unsplash.com/photo-1551836026-d5c2c5af78e4?auto=format&fit=crop&w=600'
  },
  {
    title: 'Browse & Apply',
    description: 'Find jobs matching your skills and location',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w-600'
  },
  {
    title: 'Get Hired & Work',
    description: 'Accept job offers and complete work with clear guidelines',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600'
  },
  {
    title: 'Get Paid Instantly',
    description: 'Receive payment directly to your account upon completion',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600'
  }
]
</script>

<style scoped>
.page-transition {
  animation: fadeOut 0.3s ease-out;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0.5; }
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.landing-page {
  position: relative;
  overflow-x: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2563eb, #7c3aed);
}
</style>
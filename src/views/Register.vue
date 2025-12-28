<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
    <!-- Loading Overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white p-8 rounded-2xl shadow-2xl text-center">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
        <p class="mt-6 text-lg font-semibold text-gray-700">Creating your account...</p>
        <p class="text-gray-500 mt-2">Setting up your {{ formData.role }} dashboard</p>
      </div>
    </div>

    <!-- Main Registration Card -->
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden">
      <!-- Progress Bar -->
      <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
        <div class="flex justify-between items-center mb-2">
          <h1 class="text-2xl font-bold text-white">Join Ultimate Workforce</h1>
          <span class="text-white/90">Step {{ currentStep }} of 3</span>
        </div>
        
        <!-- Progress Steps -->
        <div class="flex items-center">
          <div v-for="step in 3" :key="step" class="flex-1">
            <div class="flex items-center">
              <div 
                :class="[
                  'h-8 w-8 rounded-full flex items-center justify-center font-bold transition-all duration-300',
                  step < currentStep ? 'bg-green-500 text-white' :
                  step === currentStep ? 'bg-white text-blue-600' :
                  'bg-white/30 text-white'
                ]"
              >
                {{ step }}
              </div>
              <div 
                v-if="step < 3"
                :class="[
                  'flex-1 h-1 mx-2 transition-all duration-300',
                  step < currentStep ? 'bg-green-500' : 'bg-white/30'
                ]"
              ></div>
            </div>
            <p class="text-xs mt-2 text-white/90 text-center">
              {{ step === 1 ? 'Personal Info' : step === 2 ? 'Role & Skills' : 'Account Setup' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="submitError" class="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-shake">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          <span class="text-red-600 font-medium">{{ submitError }}</span>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="registrationSuccess" class="mx-6 mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="text-green-600 font-medium">Registration successful! Redirecting to your dashboard...</span>
        </div>
      </div>

      <!-- Form Content -->
      <div class="p-8">
        <!-- Step 1: Personal Information -->
        <div v-if="currentStep === 1" class="animate-fade-in">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Tell us about yourself</h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Full Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                v-model="formData.fullName"
                type="text"
                :class="[
                  'w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
                  v$.fullName.$error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                placeholder="John Doe"
                @blur="v$.fullName.$touch()"
              >
              <p v-if="v$.fullName.$error" class="mt-1 text-sm text-red-600">
                Please enter your full name
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <div class="relative">
                <input
                  v-model="formData.email"
                  type="email"
                  :class="[
                    'w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
                    v$.email.$error ? 'border-red-300 bg-red-50' : 'border-gray-300',
                    emailChecking ? 'pr-12' : 'pr-4'
                  ]"
                  placeholder="john@example.com"
                  @blur="v$.email.$touch(); checkEmailAvailability()"
                >
                <div v-if="emailChecking" class="absolute right-3 top-3">
                  <div class="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
                <div v-if="emailAvailable === false && formData.email && v$.email.$dirty" class="absolute right-3 top-3 text-red-500">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div v-if="emailAvailable === true" class="absolute right-3 top-3 text-green-500">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </div>
              <p v-if="v$.email.$error" class="mt-1 text-sm text-red-600">
                Please enter a valid email address
              </p>
              <p v-if="emailAvailable === false" class="mt-1 text-sm text-red-600">
                This email is already registered
              </p>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                v-model="formData.phone"
                type="tel"
                :class="[
                  'w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
                  v$.phone.$error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                placeholder="+1 (555) 123-4567"
                @blur="v$.phone.$touch()"
              >
              <p v-if="v$.phone.$error" class="mt-1 text-sm text-red-600">
                Please enter a valid phone number
              </p>
            </div>

            <!-- Location -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                v-model="formData.location"
                type="text"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="City, Country"
              >
            </div>
          </div>
        </div>

        <!-- Step 2: Role & Skills -->
        <div v-if="currentStep === 2" class="animate-fade-in">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Choose your role</h2>
          
          <!-- Role Selection -->
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <!-- Worker Card -->
            <div
              @click="selectRole('worker')"
              :class="[
                'cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 transform hover:scale-[1.02]',
                formData.role === 'worker'
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-blue-300'
              ]"
            >
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-800">Worker</h3>
                  <p class="text-gray-600 text-sm">Find jobs, get hired, earn money</p>
                </div>
              </div>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  Browse available jobs
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  Apply with one click
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  Secure payment system
                </li>
              </ul>
            </div>

            <!-- Employer Card -->
            <div
              @click="selectRole('employer')"
              :class="[
                'cursor-pointer rounded-xl border-2 p-6 transition-all duration-300 transform hover:scale-[1.02]',
                formData.role === 'employer'
                  ? 'border-purple-500 bg-purple-50 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300'
              ]"
            >
              <div class="flex items-center mb-4">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-800">Employer</h3>
                  <p class="text-gray-600 text-sm">Post jobs, hire talent, grow business</p>
                </div>
              </div>
              <ul class="text-sm text-gray-600 space-y-2">
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  Post unlimited jobs
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  Access talent pool
                </li>
                <li class="flex items-center">
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                  </svg>
                  Manage hires & payments
                </li>
              </ul>
            </div>
          </div>

          <!-- Dynamic Fields Based on Role -->
          <div v-if="formData.role === 'worker'" class="mt-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Worker Details</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div class="flex flex-wrap gap-2 mb-3">
                  <span
                    v-for="(skill, index) in formData.skills"
                    :key="index"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {{ skill }}
                    <button
                      @click="removeSkill(index)"
                      class="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                </div>
                <div class="flex">
                  <input
                    v-model="newSkill"
                    type="text"
                    class="flex-1 px-4 py-2 rounded-l-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add a skill"
                    @keyup.enter="addSkill"
                  >
                  <button
                    @click="addSkill"
                    class="px-4 py-2 bg-blue-500 text-white rounded-r-xl hover:bg-blue-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                <select
                  v-model="formData.experience"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select experience</option>
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (5+ years)</option>
                  <option value="expert">Expert (10+ years)</option>
                </select>
              </div>
            </div>
          </div>

          <div v-if="formData.role === 'employer'" class="mt-8">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Company Details</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  v-model="formData.companyName"
                  type="text"
                  :class="[
                    'w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
                    v$.companyName.$error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  ]"
                  placeholder="Acme Inc."
                  @blur="v$.companyName.$touch()"
                >
                <p v-if="v$.companyName.$error" class="mt-1 text-sm text-red-600">
                  Please enter company name
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  v-model="formData.industry"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select industry</option>
                  <option value="tech">Technology</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="finance">Finance</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Account Setup -->
        <div v-if="currentStep === 3" class="animate-fade-in">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Account Security</h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Password *</label>
              <input
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                :class="[
                  'w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
                  v$.password.$error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                placeholder="Create a strong password"
                @input="checkPasswordStrength"
                @blur="v$.password.$touch()"
              >
              <div class="flex items-center mt-2">
                <button
                  @click="showPassword = !showPassword"
                  type="button"
                  class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  {{ showPassword ? 'Hide' : 'Show' }} password
                </button>
              </div>

              <!-- Password Strength Meter -->
              <div v-if="formData.password" class="mt-4">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-medium text-gray-700">Password strength</span>
                  <span :class="passwordStrengthClass" class="text-sm font-semibold">
                    {{ passwordStrengthText }}
                  </span>
                </div>
                <div class="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    :class="[
                      'h-full rounded-full transition-all duration-500',
                      passwordStrength === 'weak' && 'bg-red-500 w-1/4',
                      passwordStrength === 'fair' && 'bg-orange-500 w-2/4',
                      passwordStrength === 'good' && 'bg-yellow-500 w-3/4',
                      passwordStrength === 'strong' && 'bg-green-500 w-full'
                    ]"
                  ></div>
                </div>
                <ul class="mt-2 text-xs text-gray-600 space-y-1">
                  <li :class="formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'">
                    ✓ At least 8 characters
                  </li>
                  <li :class="/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-400'">
                    ✓ Uppercase & lowercase letters
                  </li>
                  <li :class="/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-400'">
                    ✓ At least one number
                  </li>
                  <li :class="/(?=.*[@$!%*?&])/.test(formData.password) ? 'text-green-600' : 'text-gray-400'">
                    ✓ Special character
                  </li>
                </ul>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
              <input
                v-model="formData.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                :class="[
                  'w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all',
                  v$.confirmPassword.$error || passwordMatchError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                ]"
                placeholder="Re-enter your password"
                @blur="v$.confirmPassword.$touch(); checkPasswordMatch()"
              >
              <div class="flex items-center mt-2">
                <button
                  @click="showConfirmPassword = !showConfirmPassword"
                  type="button"
                  class="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="showConfirmPassword" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  {{ showConfirmPassword ? 'Hide' : 'Show' }} password
                </button>
              </div>
              <p v-if="passwordMatchError" class="mt-1 text-sm text-red-600">
                Passwords do not match
              </p>
            </div>
          </div>

          <!-- Terms & Conditions -->
          <div class="mt-8">
            <label class="flex items-start">
              <input
                v-model="formData.acceptedTerms"
                type="checkbox"
                class="mt-1 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">
                I agree to the 
                <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">Terms of Service</a> 
                and 
                <a href="#" class="text-blue-600 hover:text-blue-800 font-medium">Privacy Policy</a>. 
                I understand that my data will be processed in accordance with these policies.
              </span>
            </label>
            <p v-if="v$.acceptedTerms.$error" class="mt-1 text-sm text-red-600">
              You must accept the terms and conditions
            </p>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            type="button"
            class="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            :disabled="isLoading"
          >
            ← Back
          </button>
          <div v-else></div>

          <button
            v-if="currentStep < 3"
            @click="nextStep"
            type="button"
            :disabled="!canProceed"
            :class="[
              'px-6 py-3 rounded-xl font-medium transition-colors',
              canProceed
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            ]"
          >
            Continue →
          </button>

          <button
            v-else
            @click="handleSubmit"
            type="button"
            :disabled="!canSubmit || isLoading"
            :class="[
              'px-8 py-3 rounded-xl font-medium transition-all duration-300',
              canSubmit && !isLoading
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            ]"
          >
            <span v-if="isLoading">Creating Account...</span>
            <span v-else>Create Account 🚀</span>
          </button>
        </div>

        <!-- Login Link -->
        <div class="text-center mt-6 pt-6 border-t border-gray-200">
          <p class="text-gray-600">
            Already have an account? 
            <router-link to="/login" class="text-blue-600 hover:text-blue-800 font-semibold">
              Sign in here
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, sameAs } from '@vuelidate/validators';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Form state
const currentStep = ref(1);
const isLoading = ref(false);
const submitError = ref('');
const registrationSuccess = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const emailChecking = ref(false);
const emailAvailable = ref(null);
const newSkill = ref('');
const passwordStrength = ref('weak');

// Form data
const formData = ref({
  fullName: '',
  email: '',
  phone: '',
  location: '',
  role: 'worker',
  skills: [],
  experience: '',
  companyName: '',
  industry: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false
});

// Validation rules
const rules = {
  fullName: { required },
  email: { required, email },
  phone: { required },
  password: { required, minLength: minLength(8) },
  confirmPassword: { required, sameAsPassword: sameAs(computed(() => formData.value.password)) },
  acceptedTerms: { sameAs: sameAs(true) },
  companyName: { 
    required: computed(() => formData.value.role === 'employer') 
  }
};

const v$ = useVuelidate(rules, formData);

// Computed properties
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return formData.value.fullName && 
           formData.value.email && 
           formData.value.phone &&
           !v$.value.email.$error &&
           emailAvailable.value !== false;
  }
  if (currentStep.value === 2) {
    return formData.value.role && 
           (formData.value.role !== 'employer' || formData.value.companyName);
  }
  return false;
});

const canSubmit = computed(() => {
  return !v$.value.$invalid && 
         formData.value.acceptedTerms && 
         !passwordMatchError.value;
});

const passwordStrengthClass = computed(() => {
  switch (passwordStrength.value) {
    case 'weak': return 'text-red-500';
    case 'fair': return 'text-orange-500';
    case 'good': return 'text-yellow-500';
    case 'strong': return 'text-green-500';
    default: return 'text-gray-500';
  }
});

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 'weak': return 'Weak';
    case 'fair': return 'Fair';
    case 'good': return 'Good';
    case 'strong': return 'Strong';
    default: return 'None';
  }
});

const passwordMatchError = ref(false);

// Methods
const selectRole = (role) => {
  formData.value.role = role;
  if (role === 'worker') {
    formData.value.companyName = '';
  }
};

const addSkill = () => {
  if (newSkill.value.trim() && !formData.value.skills.includes(newSkill.value.trim())) {
    formData.value.skills.push(newSkill.value.trim());
    newSkill.value = '';
  }
};

const removeSkill = (index) => {
  formData.value.skills.splice(index, 1);
};

const checkPasswordStrength = () => {
  const password = formData.value.password;
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/(?=.*[a-z])(?=.*[A-Z])/.test(password)) strength++;
  if (/(?=.*\d)/.test(password)) strength++;
  if (/(?=.*[@$!%*?&])/.test(password)) strength++;
  
  if (strength <= 2) passwordStrength.value = 'weak';
  else if (strength === 3) passwordStrength.value = 'fair';
  else if (strength === 4) passwordStrength.value = 'good';
  else passwordStrength.value = 'strong';
};

const checkPasswordMatch = () => {
  passwordMatchError.value = formData.value.password !== formData.value.confirmPassword;
};

const checkEmailAvailability = async () => {
  if (!formData.value.email || v$.value.email.$error) {
    emailAvailable.value = null;
    return;
  }
  
  emailChecking.value = true;
  
  try {
    // Simulate API check - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For demo: Assume email is available unless it contains "existing"
    emailAvailable.value = !formData.value.email.includes('existing');
    
  } catch (error) {
    console.error('Email check failed:', error);
    emailAvailable.value = null;
  } finally {
    emailChecking.value = false;
  }
};

const nextStep = () => {
  if (canProceed.value) {
    currentStep.value++;
    submitError.value = '';
  }
};

const prevStep = () => {
  currentStep.value--;
  submitError.value = '';
};

const handleSubmit = async () => {
  if (!canSubmit.value || isLoading.value) return;
  
  isLoading.value = true;
  submitError.value = '';
  
  try {
    // Prepare data for API
    const userData = {
      name: formData.value.fullName,
      email: formData.value.email,
      password: formData.value.password,
      phone: formData.value.phone,
      role: formData.value.role,
      location: formData.value.location,
      ...(formData.value.role === 'worker' && {
        skills: formData.value.skills,
        experience: formData.value.experience
      }),
      ...(formData.value.role === 'employer' && {
        companyName: formData.value.companyName,
        industry: formData.value.industry
      })
    };
    
    // Call auth store to register
    await authStore.register(userData);
    
    // Show success message
    registrationSuccess.value = true;
    
    // Redirect after delay
    setTimeout(() => {
      const redirectPath = formData.value.role === 'worker' ? '/worker' : '/employer';
      router.push(redirectPath);
    }, 2000);
    
  } catch (error) {
    submitError.value = error.message || 'Registration failed. Please try again.';
    console.error('Registration error:', error);
  } finally {
    isLoading.value = false;
  }
};

// Watch for email changes
watch(() => formData.value.email, (newEmail, oldEmail) => {
  if (newEmail !== oldEmail && v$.value.email.$dirty) {
    checkEmailAvailability();
  }
});

// Watch for password changes
watch(() => formData.value.password, () => {
  checkPasswordStrength();
  checkPasswordMatch();
});

// Watch for confirm password changes
watch(() => formData.value.confirmPassword, () => {
  checkPasswordMatch();
});
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
</style>

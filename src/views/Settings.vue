<template>
  <div class="settings">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="text-gray-600 mt-2">Manage your account preferences and security</p>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <nav class="flex space-x-4 border-b border-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-3 px-1 border-b-2 font-medium text-sm',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            {{ tab.name }}
            <span
              v-if="tab.badge"
              :class="[
                'ml-2 py-0.5 px-2 text-xs rounded-full',
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              ]"
            >
              {{ tab.badge }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Profile Settings -->
      <div v-if="activeTab === 'profile'" class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
          
          <!-- Profile Image -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div class="flex items-center space-x-4">
              <div class="relative">
                <div class="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  <img
                    v-if="profileImage"
                    :src="profileImage"
                    alt="Profile"
                    class="h-full w-full object-cover"
                  />
                  <span v-else class="text-2xl font-bold text-blue-600">
                    {{ userInitials }}
                  </span>
                </div>
                <button
                  type="button"
                  @click="$refs.fileInput.click()"
                  class="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"
                >
                  <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageUpload"
                />
              </div>
              <div>
                <p class="text-sm text-gray-600">
                  Upload a new photo. Max file size: 5MB
                </p>
                <button
                  v-if="profileImage"
                  @click="removeProfileImage"
                  class="mt-2 text-sm text-red-600 hover:text-red-800"
                >
                  Remove photo
                </button>
              </div>
            </div>
          </div>

          <!-- Personal Information Form -->
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  v-model="profileForm.firstName"
                  type="text"
                  required
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  v-model="profileForm.lastName"
                  type="text"
                  required
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  v-model="profileForm.email"
                  type="email"
                  required
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <div v-if="!user?.isVerified" class="mt-1">
                  <span class="text-sm text-yellow-600">Email not verified</span>
                  <button type="button" @click="verifyEmail" class="ml-2 text-sm text-blue-600 hover:text-blue-800">
                    Verify now
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  v-model="profileForm.phone"
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <!-- Role-specific fields -->
            <div v-if="user?.role === 'worker'" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <div class="flex flex-wrap gap-2 mb-2">
                  <span
                    v-for="(skill, index) in profileForm.skills"
                    :key="index"
                    class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {{ skill }}
                    <button
                      type="button"
                      @click="removeProfileSkill(index)"
                      class="ml-1.5 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                </div>
                <div class="flex">
                  <input
                    v-model="newProfileSkill"
                    type="text"
                    placeholder="Add a skill"
                    @keyup.enter="addProfileSkill"
                    class="flex-1 border-gray-300 rounded-l-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    @click="addProfileSkill"
                    class="px-4 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-200"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Experience (years)
                  </label>
                  <input
                    v-model="profileForm.experience"
                    type="number"
                    min="0"
                    max="50"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Education Level
                  </label>
                  <select
                    v-model="profileForm.education"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select education level</option>
                    <option value="illiterate">Illiterate</option>
                    <option value="literate">Literate</option>
                    <option value="primary">Primary School</option>
                    <option value="middle">Middle School</option>
                    <option value="matric">10th Pass</option>
                    <option value="intermediate">12th Pass</option>
                    <option value="diploma">Diploma/ITI</option>
                    <option value="graduate">Graduate</option>
                    <option value="post-graduate">Post Graduate</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Employer-specific fields -->
            <div v-if="user?.role === 'employer'" class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    v-model="profileForm.companyName"
                    type="text"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Company Size
                  </label>
                  <select
                    v-model="profileForm.companySize"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Industry
                </label>
                <input
                  v-model="profileForm.industry"
                  type="text"
                  placeholder="e.g., Construction, Manufacturing, IT"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <!-- Address -->
            <div class="space-y-4">
              <h3 class="text-md font-medium text-gray-900">Address</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    v-model="profileForm.address.street"
                    type="text"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    v-model="profileForm.address.city"
                    type="text"
                    required
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    v-model="profileForm.address.state"
                    type="text"
                    required
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    v-model="profileForm.address.pincode"
                    type="text"
                    required
                    pattern="[0-9]{6}"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    v-model="profileForm.address.country"
                    type="text"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                @click="resetProfileForm"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="profileLoading"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <span v-if="profileLoading" class="animate-spin h-4 w-4 inline-block border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Security Settings -->
      <div v-if="activeTab === 'security'" class="space-y-6">
        <!-- Change Password -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Current Password *
              </label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                New Password *
              </label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                minlength="6"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <p class="mt-1 text-sm text-gray-500">
                Must be at least 6 characters long
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password *
              </label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div class="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                :disabled="passwordLoading || !passwordsMatch"
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <span v-if="passwordLoading" class="animate-spin h-4 w-4 inline-block border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Update Password
              </button>
            </div>
          </form>
        </div>

        <!-- Two-Factor Authentication -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Two-Factor Authentication</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">SMS Authentication</h3>
                <p class="text-sm text-gray-500">Receive OTP via SMS</p>
              </div>
              <button
                @click="toggleTwoFactor('sms')"
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  twoFactor.sms ? 'bg-blue-600' : 'bg-gray-200'
                ]"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    twoFactor.sms ? 'translate-x-5' : 'translate-x-0'
                  ]"
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Email Authentication</h3>
                <p class="text-sm text-gray-500">Receive OTP via Email</p>
              </div>
              <button
                @click="toggleTwoFactor('email')"
                :class="[
                  'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  twoFactor.email ? 'bg-blue-600' : 'bg-gray-200'
                ]"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    twoFactor.email ? 'translate-x-5' : 'translate-x-0'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Login Sessions -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Active Login Sessions</h2>
          <div class="space-y-3">
            <div
              v-for="session in loginSessions"
              :key="session.id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <div class="flex items-center">
                  <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ session.device }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ session.location }} • Last active: {{ session.lastActive }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  v-if="session.current"
                  class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800"
                >
                  Current
                </span>
                <button
                  v-if="!session.current"
                  @click="logoutSession(session.id)"
                  class="text-sm text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          <button
            @click="logoutAllSessions"
            class="mt-4 text-sm text-red-600 hover:text-red-800"
          >
            Logout from all devices
          </button>
        </div>
      </div>

      <!-- Notifications Settings -->
      <div v-if="activeTab === 'notifications'" class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
          
          <!-- Email Notifications -->
          <div class="mb-6">
            <h3 class="text-md font-medium text-gray-900 mb-3">Email Notifications</h3>
            <div class="space-y-3">
              <div
                v-for="setting in emailSettings"
                :key="setting.id"
                class="flex items-center justify-between"
              >
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ setting.name }}</div>
                  <div class="text-sm text-gray-500">{{ setting.description }}</div>
                </div>
                <button
                  @click="toggleNotification('email', setting.id)"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    notificationSettings.email[setting.id] ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      notificationSettings.email[setting.id] ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- Push Notifications -->
          <div class="mb-6">
            <h3 class="text-md font-medium text-gray-900 mb-3">Push Notifications</h3>
            <div class="space-y-3">
              <div
                v-for="setting in pushSettings"
                :key="setting.id"
                class="flex items-center justify-between"
              >
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ setting.name }}</div>
                  <div class="text-sm text-gray-500">{{ setting.description }}</div>
                </div>
                <button
                  @click="toggleNotification('push', setting.id)"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    notificationSettings.push[setting.id] ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      notificationSettings.push[setting.id] ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  />
                </button>
              </div>
            </div>
          </div>

          <!-- SMS Notifications -->
          <div>
            <h3 class="text-md font-medium text-gray-900 mb-3">SMS Notifications</h3>
            <div class="space-y-3">
              <div
                v-for="setting in smsSettings"
                :key="setting.id"
                class="flex items-center justify-between"
              >
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ setting.name }}</div>
                  <div class="text-sm text-gray-500">{{ setting.description }}</div>
                </div>
                <button
                  @click="toggleNotification('sms', setting.id)"
                  :class="[
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    notificationSettings.sms[setting.id] ? 'bg-blue-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      notificationSettings.sms[setting.id] ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div v-if="activeTab === 'privacy'" class="space-y-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h2>
          
          <!-- Profile Visibility -->
          <div class="space-y-4 mb-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Profile Visibility</h3>
                <p class="text-sm text-gray-500">Who can see your profile</p>
              </div>
              <select
                v-model="privacySettings.profileVisibility"
                class="block w-40 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="public">Public</option>
                <option value="employers">Employers Only</option>
                <option value="workers">Workers Only</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Contact Information</h3>
                <p class="text-sm text-gray-500">Who can see your contact details</p>
              </div>
              <select
                v-model="privacySettings.contactVisibility"
                class="block w-40 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="hired">Only when hired</option>
                <option value="applied">After applying</option>
                <option value="private">Never show</option>
              </select>
            </div>
          </div>

          <!-- Data Sharing -->
          <div class="space-y-3 mb-6">
            <h3 class="text-md font-medium text-gray-900">Data Sharing</h3>
            <div class="space-y-2">
              <div class="flex items-center">
                <input
                  id="share-analytics"
                  v-model="privacySettings.shareAnalytics"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="share-analytics" class="ml-2 block text-sm text-gray-900">
                  Share anonymous usage data to improve our services
                </label>
              </div>
              <div class="flex items-center">
                <input
                  id="marketing-emails"
                  v-model="privacySettings.marketingEmails"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label for="marketing-emails" class="ml-2 block text-sm text-gray-900">
                  Receive marketing emails and promotions
                </label>
              </div>
            </div>
          </div>

          <!-- Data Management -->
          <div>
            <h3 class="text-md font-medium text-gray-900 mb-3">Data Management</h3>
            <div class="space-y-3">
              <button
                @click="exportData"
                class="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-between"
              >
                <div>
                  <div class="text-sm font-medium text-gray-900">Export Your Data</div>
                  <div class="text-sm text-gray-500">Download a copy of your personal data</div>
                </div>
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                @click="showDeleteModal = true"
                class="w-full text-left px-4 py-3 border border-red-300 rounded-md hover:bg-red-50 flex items-center justify-between text-red-700"
              >
                <div>
                  <div class="text-sm font-medium">Delete Account</div>
                  <div class="text-sm">Permanently delete your account and all data</div>
                </div>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Preferences -->
      <div v-if="activeTab === 'preferences'" class="space-y-6">
        <!-- Job Preferences (Workers only) -->
        <div v-if="user?.role === 'worker'" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Job Preferences</h2>
          
          <!-- Preferred Job Types -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Preferred Job Categories
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
              <button
                v-for="category in jobCategories.slice(0, 12)"
                :key="category.id"
                type="button"
                @click="togglePreferredCategory(category.id)"
                :class="[
                  'p-3 rounded-lg border text-left transition-all',
                  preferences.preferredJobTypes.includes(category.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                ]"
              >
                <div class="flex items-center">
                  <span class="text-lg mr-2">{{ category.icon }}</span>
                  <span class="text-sm font-medium">{{ category.name }}</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Work Preferences -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Preferred Work Type
              </label>
              <select
                v-model="preferences.preferredWorkType"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any Type</option>
                <option v-for="type in workTypes" :key="type.id" :value="type.id">
                  {{ type.name }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Expected Wage (₹)
                </label>
                <input
                  v-model="preferences.minExpectedWage"
                  type="number"
                  min="0"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Travel Distance (km)
                </label>
                <input
                  v-model="preferences.maxTravelDistance"
                  type="number"
                  min="0"
                  max="100"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div class="flex items-center">
              <input
                id="accommodation-needed"
                v-model="preferences.accommodationNeeded"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="accommodation-needed" class="ml-2 block text-sm text-gray-900">
                Require accommodation
              </label>
            </div>
          </div>

          <div class="flex justify-end pt-4 border-t border-gray-200">
            <button
              @click="savePreferences"
              :disabled="preferencesLoading"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="preferencesLoading" class="animate-spin h-4 w-4 inline-block border-2 border-white border-t-transparent rounded-full mr-2"></span>
              Save Preferences
            </button>
          </div>
        </div>

        <!-- Display Preferences -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Theme</h3>
                <p class="text-sm text-gray-500">Choose light or dark mode</p>
              </div>
              <select
                v-model="displaySettings.theme"
                class="block w-40 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Language</h3>
                <p class="text-sm text-gray-500">Interface language</p>
              </div>
              <select
                v-model="displaySettings.language"
                class="block w-40 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="bn">Bengali</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Currency</h3>
                <p class="text-sm text-gray-500">Display currency for wages</p>
              </div>
              <select
                v-model="displaySettings.currency"
                class="block w-40 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end pt-4 border-t border-gray-200">
            <button
              @click="saveDisplaySettings"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save Display Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">Delete Account</h3>
          <p class="text-sm text-gray-500 mb-4">
            Are you sure you want to delete your account? This action cannot be undone.
            All your data, including jobs, applications, and payments, will be permanently deleted.
          </p>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1 text-left">
                Type "DELETE" to confirm
              </label>
              <input
                v-model="deleteConfirmation"
                type="text"
                placeholder="DELETE"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div class="flex space-x-3">
              <button
                @click="showDeleteModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                @click="deleteAccount"
                :disabled="deleteConfirmation !== 'DELETE' || deleteLoading"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                <span v-if="deleteLoading" class="animate-spin h-4 w-4 inline-block border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { jobCategories, workTypes } from '@/utils/categories'

const router = useRouter()
const authStore = useAuthStore()

// Tabs
const tabs = [
  { id: 'profile', name: 'Profile' },
  { id: 'security', name: 'Security', badge: '2' },
  { id: 'notifications', name: 'Notifications' },
  { id: 'privacy', name: 'Privacy' },
  { id: 'preferences', name: 'Preferences' }
]

// Active tab
const activeTab = ref('profile')

// User data
const user = computed(() => authStore.user)
const profileImage = ref(user.value?.profileImage || '')
const userInitials = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName?.[0] || ''}${user.value.lastName?.[0] || ''}`.toUpperCase()
})

// Profile form
const profileForm = ref({
  firstName: user.value?.firstName || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || '',
  phone: user.value?.phone || '',
  skills: user.value?.skills || [],
  experience: user.value?.experience || 0,
  education: user.value?.education || '',
  companyName: user.value?.companyName || '',
  companySize: user.value?.companySize || '',
  industry: user.value?.industry || '',
  address: {
    street: user.value?.address?.street || '',
    city: user.value?.address?.city || '',
    state: user.value?.address?.state || '',
    pincode: user.value?.address?.pincode || '',
    country: user.value?.address?.country || 'India'
  }
})

// New skill
const newProfileSkill = ref('')

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Two-factor authentication
const twoFactor = ref({
  sms: false,
  email: false
})

// Login sessions
const loginSessions = ref([
  {
    id: 1,
    device: 'Chrome on Windows',
    location: 'Mumbai, India',
    lastActive: '2 hours ago',
    current: true
  },
  {
    id: 2,
    device: 'Safari on iPhone',
    location: 'Delhi, India',
    lastActive: '1 day ago',
    current: false
  }
])

// Notification settings
const emailSettings = [
  { id: 'jobAlerts', name: 'Job Alerts', description: 'New job recommendations' },
  { id: 'applicationUpdates', name: 'Application Updates', description: 'Status changes on your applications' },
  { id: 'messages', name: 'Messages', description: 'New messages from employers' },
  { id: 'payments', name: 'Payment Notifications', description: 'Payment receipts and updates' },
  { id: 'newsletter', name: 'Newsletter', description: 'Weekly updates and tips' }
]

const pushSettings = [
  { id: 'jobMatches', name: 'Job Matches', description: 'Push notifications for matching jobs' },
  { id: 'messages', name: 'Messages', description: 'New messages' },
  { id: 'reminders', name: 'Reminders', description: 'Application and payment reminders' }
]

const smsSettings = [
  { id: 'important', name: 'Important Updates', description: 'Critical account updates' },
  { id: 'otp', name: 'OTP Verification', description: 'Login and verification codes' }
]

const notificationSettings = ref({
  email: {
    jobAlerts: true,
    applicationUpdates: true,
    messages: true,
    payments: true,
    newsletter: false
  },
  push: {
    jobMatches: true,
    messages: true,
    reminders: true
  },
  sms: {
    important: true,
    otp: true
  }
})

// Privacy settings
const privacySettings = ref({
  profileVisibility: 'public',
  contactVisibility: 'hired',
  shareAnalytics: true,
  marketingEmails: false
})

// Preferences
const preferences = ref({
  preferredJobTypes: user.value?.preferredJobTypes || [],
  preferredWorkType: '',
  minExpectedWage: '',
  maxTravelDistance: 10,
  accommodationNeeded: false
})

// Display settings
const displaySettings = ref({
  theme: 'light',
  language: 'en',
  currency: 'INR'
})

// UI state
const profileLoading = ref(false)
const passwordLoading = ref(false)
const preferencesLoading = ref(false)
const deleteLoading = ref(false)
const showDeleteModal = ref(false)
const deleteConfirmation = ref('')

// Computed
const passwordsMatch = computed(() => {
  return passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

// Methods
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('File size must be less than 5MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target.result
      // In production, upload to server here
    }
    reader.readAsDataURL(file)
  }
}

const removeProfileImage = () => {
  profileImage.value = ''
}

const addProfileSkill = () => {
  if (newProfileSkill.value.trim() && !profileForm.value.skills.includes(newProfileSkill.value.trim())) {
    profileForm.value.skills.push(newProfileSkill.value.trim())
    newProfileSkill.value = ''
  }
}

const removeProfileSkill = (index) => {
  profileForm.value.skills.splice(index, 1)
}

const resetProfileForm = () => {
  profileForm.value = {
    firstName: user.value?.firstName || '',
    lastName: user.value?.lastName || '',
    email: user.value?.email || '',
    phone: user.value?.phone || '',
    skills: user.value?.skills || [],
    experience: user.value?.experience || 0,
    education: user.value?.education || '',
    companyName: user.value?.companyName || '',
    companySize: user.value?.companySize || '',
    industry: user.value?.industry || '',
    address: {
      street: user.value?.address?.street || '',
      city: user.value?.address?.city || '',
      state: user.value?.address?.state || '',
      pincode: user.value?.address?.pincode || '',
      country: user.value?.address?.country || 'India'
    }
  }
  profileImage.value = user.value?.profileImage || ''
}

const updateProfile = async () => {
  profileLoading.value = true
  
  try {
    // In production, call API to update profile
    // await authStore.updateProfile({
    //   ...profileForm.value,
    //   profileImage: profileImage.value
    // })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Profile updated successfully!')
    
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Failed to update profile. Please try again.')
  } finally {
    profileLoading.value = false
  }
}

const verifyEmail = async () => {
  try {
    // In production, call API to send verification email
    alert('Verification email sent! Please check your inbox.')
  } catch (error) {
    console.error('Error sending verification email:', error)
  }
}

const changePassword = async () => {
  passwordLoading.value = true
  
  try {
    // In production, call API to change password
    // await authStore.changePassword(passwordForm.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Password changed successfully!')
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
  } catch (error) {
    console.error('Error changing password:', error)
    alert('Failed to change password. Please try again.')
  } finally {
    passwordLoading.value = false
  }
}

const toggleTwoFactor = (type) => {
  twoFactor.value[type] = !twoFactor.value[type]
}

const logoutSession = (sessionId) => {
  loginSessions.value = loginSessions.value.filter(session => session.id !== sessionId)
  alert('Session logged out successfully')
}

const logoutAllSessions = async () => {
  if (confirm('Are you sure you want to logout from all devices?')) {
    // In production, call API to logout all sessions
    // await authStore.logoutAllSessions()
    
    // Redirect to login
    authStore.logout()
    router.push('/login')
  }
}

const toggleNotification = (type, settingId) => {
  notificationSettings.value[type][settingId] = !notificationSettings.value[type][settingId]
}

const exportData = async () => {
  try {
    // In production, call API to export data
    alert('Data export initiated. You will receive an email with your data shortly.')
  } catch (error) {
    console.error('Error exporting data:', error)
  }
}

const deleteAccount = async () => {
  if (deleteConfirmation.value !== 'DELETE') {
    alert('Please type "DELETE" to confirm')
    return
  }
  
  deleteLoading.value = true
  
  try {
    // In production, call API to delete account
    // await authStore.deleteAccount()
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Account deleted successfully')
    authStore.logout()
    router.push('/')
    
  } catch (error) {
    console.error('Error deleting account:', error)
    alert('Failed to delete account. Please try again.')
  } finally {
    deleteLoading.value = false
    showDeleteModal.value = false
    deleteConfirmation.value = ''
  }
}

const togglePreferredCategory = (categoryId) => {
  const index = preferences.value.preferredJobTypes.indexOf(categoryId)
  if (index === -1) {
    preferences.value.preferredJobTypes.push(categoryId)
  } else {
    preferences.value.preferredJobTypes.splice(index, 1)
  }
}

const savePreferences = async () => {
  preferencesLoading.value = true
  
  try {
    // In production, call API to save preferences
    // await authStore.savePreferences(preferences.value)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    alert('Preferences saved successfully!')
    
  } catch (error) {
    console.error('Error saving preferences:', error)
  } finally {
    preferencesLoading.value = false
  }
}

const saveDisplaySettings = () => {
  // In production, save to localStorage or API
  localStorage.setItem('displaySettings', JSON.stringify(displaySettings.value))
  alert('Display settings saved!')
}

// Load saved display settings
onMounted(() => {
  const savedSettings = localStorage.getItem('displaySettings')
  if (savedSettings) {
    displaySettings.value = JSON.parse(savedSettings)
  }
})
</script>

<style scoped>
/* Add any custom styles here */
</style>
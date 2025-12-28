<template>
  <div class="system-settings">
    <!-- Header -->
    <div class="settings-header">
      <div class="header-left">
        <h1 class="page-title">System Settings</h1>
        <p class="page-subtitle">Configure platform settings and preferences</p>
      </div>
      <div class="header-right">
        <button @click="saveAllSettings" class="save-btn" :disabled="saving">
          <Save class="w-4 h-4" />
          {{ saving ? 'Saving...' : 'Save All Changes' }}
        </button>
        <button @click="resetToDefaults" class="reset-btn">
          <RefreshCw class="w-4 h-4" />
          Reset to Defaults
        </button>
      </div>
    </div>

    <!-- Settings Navigation -->
    <div class="settings-nav">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['nav-btn', { active: activeTab === tab.id }]"
      >
        <component :is="tab.icon" class="w-5 h-5" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Settings Content -->
    <div class="settings-content">
      <!-- General Settings -->
      <div v-if="activeTab === 'general'" class="settings-section">
        <div class="section-header">
          <h2>General Settings</h2>
          <p class="section-description">Basic platform configuration and preferences</p>
        </div>
        
        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <Globe class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>Platform Information</h3>
                <p>Basic details about your platform</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label for="platformName">Platform Name</label>
                <input
                  v-model="settings.general.platformName"
                  type="text"
                  id="platformName"
                  class="form-input"
                  placeholder="Ultimate Workforce"
                />
              </div>
              
              <div class="form-group">
                <label for="platformUrl">Platform URL</label>
                <input
                  v-model="settings.general.platformUrl"
                  type="url"
                  id="platformUrl"
                  class="form-input"
                  placeholder="https://ultimateworkforce.com"
                />
              </div>
              
              <div class="form-group">
                <label for="supportEmail">Support Email</label>
                <input
                  v-model="settings.general.supportEmail"
                  type="email"
                  id="supportEmail"
                  class="form-input"
                  placeholder="support@ultimateworkforce.com"
                />
              </div>
              
              <div class="form-group">
                <label for="timezone">Timezone</label>
                <select v-model="settings.general.timezone" id="timezone" class="form-input">
                  <option value="Asia/Kolkata">India (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="Europe/London">London (GMT)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <Calendar class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>Date & Time</h3>
                <p>Format and display preferences</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label for="dateFormat">Date Format</label>
                <select v-model="settings.general.dateFormat" id="dateFormat" class="form-input">
                  <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="timeFormat">Time Format</label>
                <select v-model="settings.general.timeFormat" id="timeFormat" class="form-input">
                  <option value="12h">12-hour (AM/PM)</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="currency">Currency</label>
                <select v-model="settings.general.currency" id="currency" class="form-input">
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <Lock class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>Security</h3>
                <p>Platform security settings</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.general.enable2FA"
                    class="checkbox"
                  />
                  <span>Enable Two-Factor Authentication</span>
                </label>
                <p class="checkbox-description">Require 2FA for admin access</p>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.general.enableLoginAlerts"
                    class="checkbox"
                  />
                  <span>Enable Login Alerts</span>
                </label>
                <p class="checkbox-description">Notify on new admin logins</p>
              </div>
              
              <div class="form-group">
                <label for="sessionTimeout">Session Timeout (minutes)</label>
                <input
                  v-model.number="settings.general.sessionTimeout"
                  type="number"
                  id="sessionTimeout"
                  min="5"
                  max="480"
                  class="form-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Management Settings -->
      <div v-if="activeTab === 'users'" class="settings-section">
        <div class="section-header">
          <h2>User Management</h2>
          <p class="section-description">Configure user registration and management settings</p>
        </div>
        
        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <Users class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>Registration Settings</h3>
                <p>User registration preferences</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.users.allowRegistration"
                    class="checkbox"
                  />
                  <span>Allow New User Registration</span>
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.users.requireEmailVerification"
                    class="checkbox"
                  />
                  <span>Require Email Verification</span>
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.users.requirePhoneVerification"
                    class="checkbox"
                  />
                  <span>Require Phone Verification</span>
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.users.autoApproveWorkers"
                    class="checkbox"
                  />
                  <span>Auto-approve Worker Accounts</span>
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.users.autoApproveEmployers"
                    class="checkbox"
                  />
                  <span>Auto-approve Employer Accounts</span>
                </label>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <Shield class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>KYC Verification</h3>
                <p>Identity verification settings</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.users.requireKYC"
                    class="checkbox"
                  />
                  <span>Require KYC Verification</span>
                </label>
                <p class="checkbox-description">Users must complete KYC to use platform</p>
              </div>
              
              <div class="form-group">
                <label for="kycDocuments">Required Documents</label>
                <div class="checkbox-group">
                  <label class="checkbox-label small">
                    <input 
                      type="checkbox" 
                      v-model="settings.users.requiredDocs.aadhaar"
                      class="checkbox"
                    />
                    <span>Aadhaar Card</span>
                  </label>
                  <label class="checkbox-label small">
                    <input 
                      type="checkbox" 
                      v-model="settings.users.requiredDocs.pan"
                      class="checkbox"
                    />
                    <span>PAN Card</span>
                  </label>
                  <label class="checkbox-label small">
                    <input 
                      type="checkbox" 
                      v-model="settings.users.requiredDocs.passport"
                      class="checkbox"
                    />
                    <span>Passport</span>
                  </label>
                  <label class="checkbox-label small">
                    <input 
                      type="checkbox" 
                      v-model="settings.users.requiredDocs.driving"
                      class="checkbox"
                    />
                    <span>Driving License</span>
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label for="kycApprovalTime">KYC Approval Time (hours)</label>
                <input
                  v-model.number="settings.users.kycApprovalTime"
                  type="number"
                  id="kycApprovalTime"
                  min="1"
                  max="168"
                  class="form-input"
                />
                <p class="input-description">Maximum time for KYC approval</p>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <UserCheck class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>User Roles & Permissions</h3>
                <p>Configure user access levels</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label>Default User Permissions</label>
                <div class="permissions-grid">
                  <div class="permission-item">
                    <span class="permission-label">Workers Can:</span>
                    <div class="permission-options">
                      <label class="checkbox-label small">
                        <input type="checkbox" class="checkbox" checked disabled />
                        <span>Browse Jobs</span>
                      </label>
                      <label class="checkbox-label small">
                        <input type="checkbox" v-model="settings.users.permissions.workers.applyJobs" class="checkbox" />
                        <span>Apply for Jobs</span>
                      </label>
                      <label class="checkbox-label small">
                        <input type="checkbox" v-model="settings.users.permissions.workers.messageEmployers" class="checkbox" />
                        <span>Message Employers</span>
                      </label>
                    </div>
                  </div>
                  
                  <div class="permission-item">
                    <span class="permission-label">Employers Can:</span>
                    <div class="permission-options">
                      <label class="checkbox-label small">
                        <input type="checkbox" v-model="settings.users.permissions.employers.postJobs" class="checkbox" />
                        <span>Post Jobs</span>
                      </label>
                      <label class="checkbox-label small">
                        <input type="checkbox" v-model="settings.users.permissions.employers.hireWorkers" class="checkbox" />
                        <span>Hire Workers</span>
                      </label>
                      <label class="checkbox-label small">
                        <input type="checkbox" v-model="settings.users.permissions.employers.messageWorkers" class="checkbox" />
                        <span>Message Workers</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Settings -->
      <div v-if="activeTab === 'payments'" class="settings-section">
        <div class="section-header">
          <h2>Payment Settings</h2>
          <p class="section-description">Configure payment gateways and transaction settings</p>
        </div>
        
        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <CreditCard class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>Payment Gateways</h3>
                <p>Configure payment methods</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.payments.gateways.razorpay.enabled"
                    class="checkbox"
                  />
                  <span>Razorpay</span>
                </label>
                <div v-if="settings.payments.gateways.razorpay.enabled" class="gateway-details">
                  <div class="form-group">
                    <label for="razorpayKey">Razorpay Key ID</label>
                    <input
                      v-model="settings.payments.gateways.razorpay.keyId"
                      type="text"
                      id="razorpayKey"
                      class="form-input"
                      placeholder="rzp_test_XXXXXXXX"
                    />
                  </div>
                  <div class="form-group">
                    <label for="razorpaySecret">Razorpay Key Secret</label>
                    <input
                      v-model="settings.payments.gateways.razorpay.keySecret"
                      type="password"
                      id="razorpaySecret"
                      class="form-input"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.payments.gateways.stripe.enabled"
                    class="checkbox"
                  />
                  <span>Stripe</span>
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.payments.gateways.paypal.enabled"
                    class="checkbox"
                  />
                  <span>PayPal</span>
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.payments.enableUPI"
                    class="checkbox"
                  />
                  <span>Enable UPI Payments</span>
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.payments.enableWallet"
                    class="checkbox"
                  />
                  <span>Enable Wallet System</span>
                </label>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <Percent class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>Commission & Fees</h3>
                <p>Configure platform fees</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label for="platformCommission">Platform Commission (%)</label>
                <div class="input-with-suffix">
                  <input
                    v-model.number="settings.payments.platformCommission"
                    type="number"
                    id="platformCommission"
                    min="0"
                    max="50"
                    step="0.1"
                    class="form-input"
                  />
                  <span class="suffix">%</span>
                </div>
                <p class="input-description">Percentage deducted from each transaction</p>
              </div>
              
              <div class="form-group">
                <label for="transactionFee">Fixed Transaction Fee (₹)</label>
                <div class="input-with-prefix">
                  <span class="prefix">₹</span>
                  <input
                    v-model.number="settings.payments.transactionFee"
                    type="number"
                    id="transactionFee"
                    min="0"
                    step="1"
                    class="form-input"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="minimumPayout">Minimum Payout Amount (₹)</label>
                <div class="input-with-prefix">
                  <span class="prefix">₹</span>
                  <input
                    v-model.number="settings.payments.minimumPayout"
                    type="number"
                    id="minimumPayout"
                    min="100"
                    step="100"
                    class="form-input"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="payoutSchedule">Payout Schedule</label>
                <select v-model="settings.payments.payoutSchedule" id="payoutSchedule" class="form-input">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <ShieldCheck class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>Security & Compliance</h3>
                <p>Payment security settings</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label for="autoRefundDays">Auto-refund Period (days)</label>
                <input
                  v-model.number="settings.payments.autoRefundDays"
                  type="number"
                  id="autoRefundDays"
                  min="1"
                  max="30"
                  class="form-input"
                />
                <p class="input-description">Days after which unclaimed payments are auto-refunded</p>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.payments.enableEscrow"
                    class="checkbox"
                  />
                  <span>Enable Escrow System</span>
                </label>
                <p class="checkbox-description">Hold payments until job completion</p>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.payments.requirePaymentVerification"
                    class="checkbox"
                  />
                  <span>Require Payment Verification</span>
                </label>
                <p class="checkbox-description">Manual verification for large payments</p>
              </div>
              
              <div class="form-group">
                <label for="paymentVerificationLimit">Verification Limit (₹)</label>
                <div class="input-with-prefix">
                  <span class="prefix">₹</span>
                  <input
                    v-model.number="settings.payments.paymentVerificationLimit"
                    type="number"
                    id="paymentVerificationLimit"
                    min="10000"
                    step="1000"
                    class="form-input"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div v-if="activeTab === 'notifications'" class="settings-section">
        <div class="section-header">
          <h2>Notification Settings</h2>
          <p class="section-description">Configure email, SMS, and push notifications</p>
        </div>
        
        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <Mail class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>Email Notifications</h3>
                <p>Configure email service</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label for="emailProvider">Email Provider</label>
                <select v-model="settings.notifications.email.provider" id="emailProvider" class="form-input">
                  <option value="smtp">SMTP</option>
                  <option value="sendgrid">SendGrid</option>
                  <option value="mailgun">Mailgun</option>
                  <option value="postmark">Postmark</option>
                </select>
              </div>
              
              <div v-if="settings.notifications.email.provider === 'smtp'" class="smtp-details">
                <div class="form-group">
                  <label for="smtpHost">SMTP Host</label>
                  <input
                    v-model="settings.notifications.email.smtp.host"
                    type="text"
                    id="smtpHost"
                    class="form-input"
                    placeholder="smtp.gmail.com"
                  />
                </div>
                
                <div class="form-group">
                  <label for="smtpPort">SMTP Port</label>
                  <input
                    v-model.number="settings.notifications.email.smtp.port"
                    type="number"
                    id="smtpPort"
                    class="form-input"
                    placeholder="587"
                  />
                </div>
                
                <div class="form-group">
                  <label for="smtpUsername">SMTP Username</label>
                  <input
                    v-model="settings.notifications.email.smtp.username"
                    type="text"
                    id="smtpUsername"
                    class="form-input"
                    placeholder="your-email@gmail.com"
                  />
                </div>
                
                <div class="form-group">
                  <label for="smtpPassword">SMTP Password</label>
                  <input
                    v-model="settings.notifications.email.smtp.password"
                    type="password"
                    id="smtpPassword"
                    class="form-input"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="fromEmail">From Email Address</label>
                <input
                  v-model="settings.notifications.email.fromEmail"
                  type="email"
                  id="fromEmail"
                  class="form-input"
                  placeholder="noreply@ultimateworkforce.com"
                />
              </div>
              
              <div class="form-group">
                <label for="fromName">From Name</label>
                <input
                  v-model="settings.notifications.email.fromName"
                  type="text"
                  id="fromName"
                  class="form-input"
                  placeholder="Ultimate Workforce"
                />
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <Smartphone class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>SMS Notifications</h3>
                <p>Configure SMS service</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.notifications.sms.enabled"
                    class="checkbox"
                  />
                  <span>Enable SMS Notifications</span>
                </label>
              </div>
              
              <div v-if="settings.notifications.sms.enabled" class="sms-details">
                <div class="form-group">
                  <label for="smsProvider">SMS Provider</label>
                  <select v-model="settings.notifications.sms.provider" id="smsProvider" class="form-input">
                    <option value="twilio">Twilio</option>
                    <option value="msg91">MSG91</option>
                    <option value="textlocal">TextLocal</option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label for="smsApiKey">API Key</label>
                  <input
                    v-model="settings.notifications.sms.apiKey"
                    type="password"
                    id="smsApiKey"
                    class="form-input"
                    placeholder="••••••••"
                  />
                </div>
                
                <div class="form-group">
                  <label for="smsSenderId">Sender ID</label>
                  <input
                    v-model="settings.notifications.sms.senderId"
                    type="text"
                    id="smsSenderId"
                    class="form-input"
                    placeholder="ULTWRK"
                  />
                </div>
                
                <div class="form-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="settings.notifications.sms.sendOTP"
                      class="checkbox"
                    />
                    <span>Send OTP via SMS</span>
                  </label>
                </div>
                
                <div class="form-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="settings.notifications.sms.sendJobAlerts"
                      class="checkbox"
                    />
                    <span>Send Job Alerts via SMS</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <Bell class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>Notification Types</h3>
                <p>Configure what notifications to send</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="notification-types">
                <h4>User Notifications</h4>
                <div class="notification-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="settings.notifications.types.user.registration"
                      class="checkbox"
                    />
                    <span>Registration Welcome</span>
                  </label>
                  
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="settings.notifications.types.user.kycApproved"
                      class="checkbox"
                    />
                    <span>KYC Approval</span>
                  </label>
                  
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="settings.notifications.types.user.jobApplied"
                      class="checkbox"
                    />
                    <span>Job Application</span>
                  </label>
                  
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="settings.notifications.types.user.paymentReceived"
                      class="checkbox"
                    />
                    <span>Payment Received</span>
                  </label>
                </div>
                
                <h4>Admin Notifications</h4>
                <div class="notification-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="settings.notifications.types.admin.newUser"
                      class="checkbox"
                    />
                    <span>New User Registration</span>
                  </label>
                  
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="settings.notifications.types.admin.newJob"
                      class="checkbox"
                    />
                    <span>New Job Posted</span>
                  </label>
                  
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="settings.notifications.types.admin.newTicket"
                      class="checkbox"
                    />
                    <span>New Support Ticket</span>
                  </label>
                  
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="settings.notifications.types.admin.largePayment"
                      class="checkbox"
                    />
                    <span>Large Payment</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Settings -->
      <div v-if="activeTab === 'advanced'" class="settings-section">
        <div class="section-header">
          <h2>Advanced Settings</h2>
          <p class="section-description">Technical configuration and API settings</p>
        </div>
        
        <div class="settings-grid">
          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <Database class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>API Configuration</h3>
                <p>External API integrations</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label for="apiBaseUrl">API Base URL</label>
                <input
                  v-model="settings.advanced.apiBaseUrl"
                  type="url"
                  id="apiBaseUrl"
                  class="form-input"
                  placeholder="https://api.ultimateworkforce.com"
                />
              </div>
              
              <div class="form-group">
                <label for="apiTimeout">API Timeout (seconds)</label>
                <input
                  v-model.number="settings.advanced.apiTimeout"
                  type="number"
                  id="apiTimeout"
                  min="5"
                  max="120"
                  class="form-input"
                />
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.advanced.enableApiLogging"
                    class="checkbox"
                  />
                  <span>Enable API Logging</span>
                </label>
              </div>
              
              <div class="form-group">
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="settings.advanced.enableRateLimiting"
                    class="checkbox"
                  />
                  <span>Enable Rate Limiting</span>
                </label>
              </div>
            </div>
          </div>

          <div class="setting-card">
            <div class="setting-header">
              <div class="setting-icon">
                <Server class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>Server Configuration</h3>
                <p>Server and cache settings</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="form-group">
                <label for="cacheDriver">Cache Driver</label>
                <select v-model="settings.advanced.cacheDriver" id="cacheDriver" class="form-input">
                  <option value="redis">Redis</option>
                  <option value="memcached">Memcached</option>
                  <option value="file">File</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="sessionDriver">Session Driver</label>
                <select v-model="settings.advanced.sessionDriver" id="sessionDriver" class="form-input">
                  <option value="database">Database</option>
                  <option value="redis">Redis</option>
                  <option value="file">File</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="queueDriver">Queue Driver</label>
                <select v-model="settings.advanced.queueDriver" id="queueDriver" class="form-input">
                  <option value="redis">Redis</option>
                  <option value="database">Database</option>
                  <option value="sync">Sync</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="maintenanceMode">Maintenance Mode</label>
                <select v-model="settings.advanced.maintenanceMode" id="maintenanceMode" class="form-input">
                  <option value="disabled">Disabled</option>
                  <option value="enabled">Enabled</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>
          </div>

          <div class="setting-card danger-zone">
            <div class="setting-header">
              <div class="setting-icon">
                <AlertTriangle class="w-5 h-5" />
              </div>
              <div class="setting-title">
                <h3>Danger Zone</h3>
                <p>Irreversible actions - proceed with caution</p>
              </div>
            </div>
            
            <div class="setting-fields">
              <div class="danger-actions">
                <button @click="clearCache" class="danger-btn">
                  <Trash2 class="w-4 h-4" />
                  Clear Cache
                </button>
                
                <button @click="clearLogs" class="danger-btn">
                  <FileText class="w-4 h-4" />
                  Clear Logs
                </button>
                
                <button @click="reindexDatabase" class="danger-btn">
                  <Database class="w-4 h-4" />
                  Reindex Database
                </button>
                
                <button @click="runBackup" class="danger-btn">
                  <HardDrive class="w-4 h-4" />
                  Run Backup
                </button>
              </div>
              
              <div class="form-group">
                <button @click="resetPlatform" class="danger-btn full-width">
                  <AlertTriangle class="w-4 h-4" />
                  Reset Platform Data
                </button>
                <p class="danger-warning">This will delete all user data and cannot be undone!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Changes Banner -->
    <div v-if="hasChanges" class="save-banner">
      <div class="banner-content">
        <div class="banner-text">
          <Save class="w-5 h-5" />
          <span>You have unsaved changes</span>
        </div>
        <div class="banner-actions">
          <button @click="discardChanges" class="banner-btn discard">
            Discard
          </button>
          <button @click="saveAllSettings" class="banner-btn save" :disabled="saving">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import {
  Save,
  RefreshCw,
  Globe,
  Calendar,
  Lock,
  Users,
  Shield,
  UserCheck,
  CreditCard,
  Percent,
  ShieldCheck,
  Mail,
  Smartphone,
  Bell,
  Database,
  Server,
  AlertTriangle,
  Trash2,
  FileText,
  HardDrive,
  Settings,
  Briefcase,
  MessageSquare,
  FileCode
} from 'lucide-vue-next'

// State
const activeTab = ref('general')
const saving = ref(false)
const hasChanges = ref(false)

// Settings data structure
const defaultSettings = {
  general: {
    platformName: 'Ultimate Workforce',
    platformUrl: 'https://ultimateworkforce.com',
    supportEmail: 'support@ultimateworkforce.com',
    timezone: 'Asia/Kolkata',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '12h',
    currency: 'INR',
    enable2FA: true,
    enableLoginAlerts: true,
    sessionTimeout: 30
  },
  users: {
    allowRegistration: true,
    requireEmailVerification: true,
    requirePhoneVerification: true,
    autoApproveWorkers: true,
    autoApproveEmployers: false,
    requireKYC: true,
    requiredDocs: {
      aadhaar: true,
      pan: true,
      passport: false,
      driving: false
    },
    kycApprovalTime: 24,
    permissions: {
      workers: {
        applyJobs: true,
        messageEmployers: true
      },
      employers: {
        postJobs: true,
        hireWorkers: true,
        messageWorkers: true
      }
    }
  },
  payments: {
    gateways: {
      razorpay: {
        enabled: true,
        keyId: '',
        keySecret: ''
      },
      stripe: {
        enabled: false
      },
      paypal: {
        enabled: false
      }
    },
    enableUPI: true,
    enableWallet: true,
    platformCommission: 10,
    transactionFee: 5,
    minimumPayout: 1000,
    payoutSchedule: 'weekly',
    autoRefundDays: 7,
    enableEscrow: true,
    requirePaymentVerification: true,
    paymentVerificationLimit: 10000
  },
  notifications: {
    email: {
      provider: 'smtp',
      smtp: {
        host: '',
        port: 587,
        username: '',
        password: ''
      },
      fromEmail: 'noreply@ultimateworkforce.com',
      fromName: 'Ultimate Workforce'
    },
    sms: {
      enabled: true,
      provider: 'twilio',
      apiKey: '',
      senderId: 'ULTWRK',
      sendOTP: true,
      sendJobAlerts: true
    },
    types: {
      user: {
        registration: true,
        kycApproved: true,
        jobApplied: true,
        paymentReceived: true
      },
      admin: {
        newUser: true,
        newJob: true,
        newTicket: true,
        largePayment: true
      }
    }
  },
  advanced: {
    apiBaseUrl: 'https://api.ultimateworkforce.com',
    apiTimeout: 30,
    enableApiLogging: true,
    enableRateLimiting: true,
    cacheDriver: 'redis',
    sessionDriver: 'database',
    queueDriver: 'redis',
    maintenanceMode: 'disabled'
  }
}

const settings = reactive(JSON.parse(JSON.stringify(defaultSettings)))
const originalSettings = JSON.parse(JSON.stringify(defaultSettings))

// Tabs
const tabs = ref([
  { id: 'general', label: 'General', icon: Settings },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'advanced', label: 'Advanced', icon: FileCode }
])

// Watch for changes
watch(() => JSON.parse(JSON.stringify(settings)), (newVal) => {
  hasChanges.value = JSON.stringify(newVal) !== JSON.stringify(originalSettings)
}, { deep: true })

// Methods
const saveAllSettings = async () => {
  saving.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update original settings
    Object.assign(originalSettings, JSON.parse(JSON.stringify(settings)))
    hasChanges.value = false
    
    // Show success message
    console.log('Settings saved successfully')
  } catch (error) {
    console.error('Failed to save settings:', error)
  } finally {
    saving.value = false
  }
}

const resetToDefaults = () => {
  if (confirm('Reset all settings to defaults? This will discard all changes.')) {
    Object.assign(settings, JSON.parse(JSON.stringify(defaultSettings)))
    hasChanges.value = true
  }
}

const discardChanges = () => {
  if (confirm('Discard all changes?')) {
    Object.assign(settings, JSON.parse(JSON.stringify(originalSettings)))
    hasChanges.value = false
  }
}

const clearCache = () => {
  if (confirm('Clear all cache?')) {
    console.log('Cache cleared')
  }
}

const clearLogs = () => {
  if (confirm('Clear all logs?')) {
    console.log('Logs cleared')
  }
}

const reindexDatabase = () => {
  if (confirm('Reindex database? This may take a few minutes.')) {
    console.log('Database reindexing started')
  }
}

const runBackup = () => {
  console.log('Backup started')
}

const resetPlatform = () => {
  if (confirm('WARNING: This will delete ALL platform data including users, jobs, and payments. This action cannot be undone. Type "RESET" to confirm:')) {
    const confirmation = prompt('Type "RESET" to confirm:')
    if (confirmation === 'RESET') {
      console.log('Platform reset initiated')
    }
  }
}
</script>

<style scoped>
.system-settings {
  padding: 1rem;
}

/* Header */
.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
}

.header-right {
  display: flex;
  gap: 0.75rem;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: #2563eb;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

/* Navigation */
.settings-nav {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
  overflow-x: auto;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-btn:hover {
  background: #f3f4f6;
  color: #4b5563;
}

.nav-btn.active {
  background: #3b82f6;
  color: white;
}

/* Settings Content */
.settings-content {
  min-height: 600px;
}

.settings-section {
  margin-bottom: 3rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.section-description {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Settings Grid */
.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.setting-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s;
}

.setting-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.setting-card.danger-zone {
  border-color: #ef4444;
  background: #fef2f2;
}

.setting-card.danger-zone:hover {
  border-color: #dc2626;
  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1);
}

.setting-header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.setting-icon {
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  flex-shrink: 0;
}

.setting-card.danger-zone .setting-icon {
  background: #fee2e2;
  color: #ef4444;
}

.setting-title {
  flex: 1;
}

.setting-title h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.setting-title p {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.setting-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  background: white;
  font-size: 0.875rem;
  color: #374151;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

/* Checkbox Styles */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.checkbox-label.small {
  font-size: 0.8125rem;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.checkbox:checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  margin-left: 1.75rem;
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #f9fafb;
}

/* Permissions Grid */
.permissions-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.permission-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.permission-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
}

.permission-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 0.75rem;
}

/* Input with Prefix/Suffix */
.input-with-prefix,
.input-with-suffix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-prefix .form-input {
  padding-left: 2.5rem;
}

.input-with-suffix .form-input {
  padding-right: 2.5rem;
}

.prefix,
.suffix {
  position: absolute;
  font-size: 0.875rem;
  color: #6b7280;
  pointer-events: none;
}

.prefix {
  left: 1rem;
}

.suffix {
  right: 1rem;
}

.input-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

/* Gateway Details */
.gateway-details,
.smtp-details,
.sms-details {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #f9fafb;
  margin-top: 0.5rem;
}

/* Notification Types */
.notification-types {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.notification-types h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.notification-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Danger Zone */
.danger-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.danger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #ef4444;
  color: #ef4444;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.danger-btn:hover {
  background: #fee2e2;
  border-color: #dc2626;
  color: #dc2626;
}

.danger-btn.full-width {
  grid-column: 1 / -1;
}

.danger-warning {
  font-size: 0.75rem;
  color: #ef4444;
  text-align: center;
  margin-top: 0.5rem;
  font-weight: 500;
}

/* Save Banner */
.save-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  color: white;
  padding: 1rem;
  z-index: 100;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.save-banner.show {
  transform: translateY(0);
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.banner-text {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
}

.banner-actions {
  display: flex;
  gap: 0.75rem;
}

.banner-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.banner-btn.discard {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.banner-btn.discard:hover {
  background: rgba(255, 255, 255, 0.2);
}

.banner-btn.save {
  background: white;
  color: #3b82f6;
}

.banner-btn.save:hover:not(:disabled) {
  background: #f3f4f6;
}

.banner-btn.save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .settings-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .header-right {
    flex-direction: column;
  }
  
  .settings-nav {
    flex-wrap: wrap;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .danger-actions {
    grid-template-columns: 1fr;
  }
  
  .banner-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .banner-actions {
    width: 100%;
  }
  
  .banner-btn {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .nav-btn {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }
  
  .setting-card {
    padding: 1rem;
  }
}
</style>
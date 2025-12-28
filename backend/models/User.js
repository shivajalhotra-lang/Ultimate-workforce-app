const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },
  
  // Role & Status
  role: {
    type: String,
    enum: ['worker', 'employer', 'admin'],
    default: 'worker'
  },
  accountStatus: {
    type: String,
    enum: ['active', 'suspended', 'deactivated', 'pending'],
    default: 'active'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  
  // Profile Details
  profileImage: {
    type: String,
    default: ''
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    },
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Worker Specific Fields
  skills: [{
    type: String,
    trim: true
  }],
  experience: {
    type: Number,
    default: 0
  },
  education: {
    type: String,
    enum: ['illiterate', 'literate', 'primary', 'middle', 'matric', 'intermediate', 'diploma', 'graduate', 'post-graduate']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalJobsCompleted: {
    type: Number,
    default: 0
  },
  earnings: {
    type: Number,
    default: 0
  },
  preferredJobTypes: [String],
  documents: [{
    type: {
      type: String,
      enum: ['aadhaar', 'pan', 'license', 'certificate', 'other']
    },
    number: String,
    fileUrl: String,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Employer Specific Fields
  companyName: String,
  companySize: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-500', '500+']
  },
  industry: String,
  
  // Wallet
  walletBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Preferences
  notificationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  },
  
  // Timestamps
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

module.exports = mongoose.model('User', userSchema);
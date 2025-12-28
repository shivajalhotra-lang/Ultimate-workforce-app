const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true
  },
  
  // Employer Reference
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employerName: String,
  
  // Category & Type
  category: {
    type: String,
    required: true,
    enum: [
      'industrial-manufacturing',
      'construction',
      'agriculture-farming',
      'fishing-aquaculture',
      'transportation-drivers',
      'logistics-warehouse',
      'domestic-help',
      'hospitality-food',
      'retail-sales',
      'office-admin',
      'technical-it',
      'healthcare',
      'cleaning-sanitation',
      'security',
      'beauty-wellness',
      'education-training',
      'event-entertainment',
      'miscellaneous'
    ]
  },
  subcategory: String,
  workType: {
    type: String,
    enum: ['daily-wage', 'contract', 'part-time', 'full-time', 'seasonal', 'temporary', 'freelance', 'work-from-home'],
    default: 'daily-wage'
  },
  
  // Location
  location: {
    address: String,
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
    },
    isRemote: {
      type: Boolean,
      default: false
    }
  },
  
  // Requirements
  requirements: {
    experience: {
      type: String,
      enum: ['fresher', 'beginner', 'intermediate', 'experienced', 'expert']
    },
    education: {
      type: String,
      enum: ['illiterate', 'literate', 'primary', 'middle', 'matric', 'intermediate', 'diploma', 'graduate', 'post-graduate']
    },
    skills: [String],
    documentsRequired: [String],
    genderPreference: {
      type: String,
      enum: ['any', 'male', 'female', 'transgender', 'no-preference'],
      default: 'any'
    },
    ageRange: {
      min: Number,
      max: Number
    }
  },
  
  // Job Details
  duration: {
    type: String,
    enum: ['hours', 'days', 'weeks', 'months', 'one-time'],
    default: 'days'
  },
  estimatedDuration: Number, // in the unit of duration
  startDate: Date,
  endDate: Date,
  workersNeeded: {
    type: Number,
    default: 1,
    min: 1
  },
  
  // Payment Information
  wage: {
    type: Number,
    required: true,
    min: 0
  },
  wageType: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly', 'fixed'],
    default: 'daily'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank-transfer', 'upi', 'wallet', 'cheque'],
    default: 'cash'
  },
  
  // Accommodation & Facilities
  accommodationProvided: {
    type: Boolean,
    default: false
  },
  foodProvided: {
    type: Boolean,
    default: false
  },
  transportationProvided: {
    type: Boolean,
    default: false
  },
  
  // Status & Applications
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'in-progress', 'completed', 'cancelled', 'expired'],
    default: 'pending'
  },
  applications: [{
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interview', 'accepted', 'rejected', 'withdrawn'],
      default: 'applied'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  hiredWorkers: [{
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    hiredAt: Date,
    completedAt: Date,
    status: {
      type: String,
      enum: ['hired', 'working', 'completed', 'terminated']
    },
    rating: Number,
    review: String
  }],
  
  // Metadata
  tags: [String],
  isUrgent: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  
  // Timestamps
  postedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update applications count
jobSchema.pre('save', function(next) {
  this.applicationsCount = this.applications.length;
  next();
});

// Virtual for available positions
jobSchema.virtual('availablePositions').get(function() {
  return this.workersNeeded - this.hiredWorkers.filter(w => w.status === 'hired' || w.status === 'working').length;
});

// Indexes for better query performance
jobSchema.index({ status: 1, postedAt: -1 });
jobSchema.index({ category: 1, location: 1 });
jobSchema.index({ 'location.coordinates': '2dsphere' });
jobSchema.index({ employer: 1, status: 1 });

module.exports = mongoose.model('Job', jobSchema);
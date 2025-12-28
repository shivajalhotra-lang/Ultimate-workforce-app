const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // References
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  description: String,
  
  // Work Details
  hoursWorked: Number,
  daysWorked: Number,
  workDescription: String,
  
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank-transfer', 'upi', 'wallet', 'cheque', 'card'],
    required: true
  },
  paymentDetails: {
    upiId: String,
    bankAccount: {
      accountNumber: String,
      ifscCode: String,
      accountHolder: String
    },
    transactionId: String,
    chequeNumber: String
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'disputed'],
    default: 'pending'
  },
  
  // Timeline
  paymentDate: {
    type: Date,
    default: Date.now
  },
  processedAt: Date,
  completedAt: Date,
  
  // Verification
  verifiedByWorker: {
    type: Boolean,
    default: false
  },
  verifiedByEmployer: {
    type: Boolean,
    default: false
  },
  
  // Dispute Resolution
  dispute: {
    reason: String,
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    raisedAt: Date,
    resolvedAt: Date,
    resolution: String
  },
  
  // Metadata
  notes: String,
  attachments: [{
    filename: String,
    url: String,
    type: String
  }],
  
  // Timestamps
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
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set completedAt when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

// Indexes for better query performance
paymentSchema.index({ worker: 1, status: 1 });
paymentSchema.index({ employer: 1, status: 1 });
paymentSchema.index({ job: 1 });
paymentSchema.index({ 'paymentDate': -1 });
paymentSchema.index({ transactionId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Payment', paymentSchema);
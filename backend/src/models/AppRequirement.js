const mongoose = require('mongoose');

const appRequirementSchema = new mongoose.Schema({
  // Original user input
  userDescription: {
    type: String,
    required: true,
    trim: true
  },
  
  // AI extracted information
  appName: {
    type: String,
    required: false,
    trim: true
  },
  
  entities: [{
    name: {
      type: String,
      required: false,
      trim: true
    },
    fields: [{
      name: {
        type: String,
        required: false,
        trim: true
      },
      type: {
        type: String,
        enum: ['text', 'email', 'number', 'date', 'select', 'textarea'],
        default: 'text'
      },
      required: {
        type: Boolean,
        default: false
      }
    }]
  }],
  
  roles: [{
    type: String,
    required: false,
    trim: true
  }],
  
  features: [{
    type: String,
    required: false,
    trim: true
  }],
  
  // Role-based permissions
  rolePermissions: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  // AI processing metadata
  aiProcessingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  
  aiResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
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

// Update the updatedAt field before saving
appRequirementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AppRequirement', appRequirementSchema);

import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    unique: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Pending Payment'], 
    default: 'Active' 
  },
  joinDate: { 
    type: Date, 
    default: Date.now 
  },
  // When the current membership expires (used by cron jobs)
  dueDate: {
    type: Date,
  },
  
  // References to other collections
  assignedTrainer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trainer' 
  },
  membershipPlan: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Plan' // Assuming you have a Plan model for 1-month, 3-month, etc.
  },

  // Feature 7: Diet & Workout Plans embedded for quick access
  workoutPlan: {
    title: { type: String },
    exercises: [{ type: String }] // e.g., ["Bench Press 3x10", "Squats 4x8"]
  },
  dietPlan: {
    title: { type: String },
    meals: [{ type: String }] // e.g., ["Breakfast: Oats", "Lunch: Chicken & Rice"]
  }
}, { timestamps: true });

export default mongoose.model('Member', memberSchema);
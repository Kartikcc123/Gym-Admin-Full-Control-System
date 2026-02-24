import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String 
  },
  specialization: { 
    type: String, 
    required: true // e.g., Bodybuilding, CrossFit, Yoga
  },
  experience: { 
    type: Number, 
    required: true // Years of experience
  },
  salary: { 
    type: Number, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });

export default mongoose.model('Trainer', trainerSchema);
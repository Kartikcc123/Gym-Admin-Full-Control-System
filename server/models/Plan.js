import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  planName: { 
    type: String, 
    required: true, 
    trim: true // e.g., "Annual VIP", "Monthly Basic"
  },
  durationInMonths: { 
    type: Number, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  features: [{ 
    type: String // e.g., ["Access to all equipment", "2 PT sessions/month", "Locker room access"]
  }],
  isActive: { 
    type: Boolean, 
    default: true // Allows admin to hide legacy plans without deleting them
  }
}, { timestamps: true });

export default mongoose.model('Plan', planSchema);
import mongoose from 'mongoose';

const routineSchema = new mongoose.Schema({
  member: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    required: true 
  },
  trainer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trainer' 
  }, // Optional: A routine might be self-guided or assigned by a specific trainer
  name: { 
    type: String, 
    required: true // e.g., "Beginner Weight Loss" or "Hypertrophy Push/Pull/Legs"
  },
  exercises: [{
    day: { type: String, required: true }, // e.g., "Monday" or "Day 1"
    exerciseName: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true }, // String allows for "8-12" or "To failure"
    notes: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model('Routine', routineSchema);
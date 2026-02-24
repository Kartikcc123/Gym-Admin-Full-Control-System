import express from 'express';
import { 
  getTrainers, 
  createTrainer, 
  getTrainerById, 
  deleteTrainer // <-- FIXED: Added this to the import list!
} from '../controllers/trainerController.js';

const router = express.Router();

// Get all trainers & Create a new trainer
router.route('/')
  .get(getTrainers)
  .post(createTrainer);

// Get a single trainer profile OR Delete trainer
router.route('/:id')
  .get(getTrainerById)
  .delete(deleteTrainer); 

export default router;
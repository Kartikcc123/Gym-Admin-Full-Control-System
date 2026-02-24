import express from 'express';
import { 
  getMembers, 
  createMember, 
  getMemberById, 
  assignPlanToMember, 
  assignTrainerToMember,
  deleteMember, // <-- FIXED: Added this to the import list!
} from '../controllers/memberController.js';

const router = express.Router();

// Get all & Create
router.route('/')
  .get(getMembers)
  .post(createMember);

// Get single profile
router.route('/:id')
  .get(getMemberById)
  .delete(deleteMember); // <-- Added route for deleting a member

// Assign Plan
router.route('/:id/assign-plan')
  .put(assignPlanToMember);

// Assign Trainer
router.route('/:id/assign-trainer')
  .put(assignTrainerToMember);

export default router;
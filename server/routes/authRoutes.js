import express from 'express';
import { authUser, registerAdmin } from '../controllers/authController.js';

const router = express.Router();

// Use the exported `authUser` handler for login
router.post('/login', authUser);
router.post('/register', registerAdmin); // We will use this once to make your account!

export default router;
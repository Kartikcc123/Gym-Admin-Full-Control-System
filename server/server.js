import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Config
import connectDB from './config/db.js';
import { initCronJobs } from './utils/cronJobs.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import planRoutes from './routes/planRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
// import dietWorkoutRoutes from './routes/dietWorkoutRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import routineRoutes from './routes/routineRoutes.js';

dotenv.config();
connectDB();

const app = express();

/* =========================================
   GLOBAL MIDDLEWARE
========================================= */
app.use(cors());
app.use(express.json()); // JSON parser

/* =========================================
   API ROUTES
========================================= */
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/membership-plans', planRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/trainers', trainerRoutes);

/* =========================================
   HEALTH CHECK
========================================= */
app.get('/', (req, res) => {
  res.send('NextGenz Gym ERP API is running...');
});

/* =========================================
   ERROR HANDLING
========================================= */
app.use(notFound);
app.use(errorHandler);

/* =========================================
   SERVER START
========================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
  initCronJobs();
});
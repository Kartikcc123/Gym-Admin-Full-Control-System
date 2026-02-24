import Routine from '../models/Routine.js';

// @desc    Get all routines
// @route   GET /api/routines
export const getRoutines = async (req, res) => {
  try {
    const routines = await Routine.find({})
      .populate('member', 'name')
      .populate('trainer', 'name specialization')
      .sort({ createdAt: -1 });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching routines' });
  }
};

// @desc    Create a new routine
// @route   POST /api/routines
export const createRoutine = async (req, res) => {
  try {
    const routine = await Routine.create(req.body);
    res.status(201).json(routine);
  } catch (error) {
    res.status(400).json({ message: 'Invalid routine data', error: error.message });
  }
};
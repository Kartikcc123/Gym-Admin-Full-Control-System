import Trainer from '../models/Trainer.js';

// @desc    Get all trainers
// @route   GET /api/trainers
export const getTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find({}).sort({ createdAt: -1 });
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching trainers' });
  }
};

// @desc    Create a new trainer
// @route   POST /api/trainers
export const createTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.create(req.body);
    res.status(201).json(trainer);
  } catch (error) {
    res.status(400).json({ message: 'Invalid trainer data' });
  }
};

// @desc    Get a single trainer by ID
// @route   GET /api/trainers/:id
export const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching trainer' });
  }
};

// @desc    Delete a trainer
// @route   DELETE /api/trainers/:id
export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    res.json({ message: 'Trainer removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting trainer' });
  }
};
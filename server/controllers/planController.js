import Plan from '../models/Plan.js';

// @desc    Get all membership plans
// @route   GET /api/plans
// @access  Private
export const getPlans = async (req, res) => {
  try {
    // Fetch all plans and sort them by price (lowest to highest)
    const plans = await Plan.find({}).sort({ price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching plans' });
  }
};

// @desc    Create a new membership plan
// @route   POST /api/plans
// @access  Private (Admin only usually)
export const createPlan = async (req, res) => {
  try {
    const { planName, price, durationInMonths, features } = req.body;

    // Create and save the new plan using the schema's field names
    const plan = await Plan.create({
      planName,
      price,
      durationInMonths,
      features: Array.isArray(features) ? features : (features ? [features] : [])
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ message: 'Invalid plan data. Please check your inputs.' });
  }
};
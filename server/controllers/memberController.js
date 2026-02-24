import Member from '../models/Member.js';

// 1. Get all members
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find({})
      .populate('membershipPlan')
      .populate('assignedTrainer', 'name specialization phone') // FIXED: Added this!
      .sort({ createdAt: -1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching members' });
  }
};

// 2. Create a new member
export const createMember = async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ message: 'Invalid member data' });
  }
};

// 3. Get a single member by ID
export const getMemberById = async (req, res) => {
  try {
    // FIXED: Added .populate() to fetch the full Plan and Trainer objects!
    const member = await Member.findById(req.params.id)
      .populate('membershipPlan') 
      .populate('assignedTrainer');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching member details' });
  }
};

// 4. Assign a plan to a member
export const assignPlanToMember = async (req, res) => {
  try {
    const { planId } = req.body;
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { 
        membershipPlan: planId,
        status: 'Active' 
      },
      { new: true }
    ).populate('membershipPlan');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    console.error("Assign Plan Error:", error);
    res.status(500).json({ message: 'Server error assigning plan' });
  }
};

// @desc    Assign a trainer to a member
// @route   PUT /api/members/:id/assign-trainer
export const assignTrainerToMember = async (req, res) => {
  try {
    const { trainerId } = req.body;
    
    // Find the member and update their assignedTrainer field
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { assignedTrainer: trainerId },
      { new: true }
    ).populate('assignedTrainer', 'name specialization phone'); // Bring back the trainer's details

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    res.json(member);
  } catch (error) {
    console.error("Assign Trainer Error:", error);
    res.status(500).json({ message: 'Server error assigning trainer' });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error("Delete Member Error:", error);
    res.status(500).json({ message: 'Server error deleting member' });
  }
};
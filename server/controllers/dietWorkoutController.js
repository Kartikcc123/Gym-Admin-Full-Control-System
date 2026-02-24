import Member from '../models/Member.js';

// @desc    Update a member's workout and diet plan
// @route   PUT /api/plans/:memberId
// @access  Private (Trainer/Admin)
export const updateMemberPlans = async (req, res) => {
  try {
    const { workoutPlan, dietPlan } = req.body;
    const { memberId } = req.params;

    // 1. Find the member
    const member = await Member.findById(memberId);

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    // 2. Security Check: If the user is a Trainer, ensure this member is actually assigned to them
    // (Assuming req.user is populated by your protect middleware)
    if (req.user.role === 'Trainer' && member.assignedTrainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update plans for this member.' });
    }

    // 3. Update the fields if they were provided in the request
    if (workoutPlan) member.workoutPlan = workoutPlan;
    if (dietPlan) member.dietPlan = dietPlan;

    // 4. Save the updated member document
    const updatedMember = await member.save();

    res.status(200).json({
      success: true,
      message: 'Plans updated successfully',
      data: {
        workoutPlan: updatedMember.workoutPlan,
        dietPlan: updatedMember.dietPlan
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get a member's current plans
// @route   GET /api/plans/:memberId
// @access  Private (Trainer/Admin/Member)
export const getMemberPlans = async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await Member.findById(memberId).select('workoutPlan dietPlan');

    if (!member) {
      return res.status(404).json({ message: 'Member not found.' });
    }

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
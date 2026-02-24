import Attendance from '../models/Attendance.js';
import Member from '../models/Member.js';

// @desc    Mark attendance for a member
// @route   POST /api/attendance/mark
export const markAttendance = async (req, res) => {
  try {
    const { memberId } = req.body;

    // 1. Verify Member Exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Invalid ID. Member not found.' });
    }

    // 2. Prevent Double Check-ins
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for today's date

    const alreadyMarked = await Attendance.findOne({
      member: memberId,
      date: { $gte: today }
    });

    if (alreadyMarked) {
      return res.status(400).json({ message: `${member.name} has already checked in today.` });
    }

    // 3. Log Attendance
    const attendance = await Attendance.create({ member: memberId });
    res.status(201).json({ message: `${member.name} checked in successfully!`, attendance });

  } catch (error) {
    res.status(500).json({ message: 'Server error marking attendance' });
  }
};

// @desc    Get all check-ins for today
// @route   GET /api/attendance/today
export const getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await Attendance.find({ date: { $gte: today } })
      .populate('member', 'name phone')
      .sort({ createdAt: -1 }); 

    res.json(records);
  } catch (error) {
    // THIS LINE WILL REVEAL THE BUG:
    console.error("🚨 CRASH IN GET ATTENDANCE:", error); 
    res.status(500).json({ message: 'Server error fetching attendance' });
  }
};
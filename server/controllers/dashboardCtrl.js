import Member from '../models/Member.js';
import Payment from '../models/Payment.js';
import Trainer from '../models/Trainer.js'; // Uncomment when Trainer model is ready

// @desc    Get aggregate data for the Admin Dashboard
// @route   GET /api/dashboard
// @access  Private (Admin)
export const getDashboardData = async (req, res) => {
  try {
    // Support configurable months window via query ?months=3|6|12 (default 6)
    const months = parseInt(req.query.months, 10) || 6;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // 1. Get Total and Active Members
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'Active' });

    // 2. Get Total Trainers (Commented out until Trainer model is built)
    // const totalTrainers = await Trainer.countDocuments({ isActive: true });
    // Change this: const totalTrainers = 0; 
// To this:
const totalTrainers = await Trainer.countDocuments({ isActive: true });

    // 3. Calculate this month's revenue
    const revenueData = await Payment.aggregate([
      {
        $match: {
          status: 'Completed',
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          monthlyRevenue: { $sum: '$amount' }
        }
      }
    ]);

    const currentMonthRevenue = revenueData.length > 0 ? revenueData.reduce((acc, cur) => acc + cur.monthlyRevenue, 0) : 0;

    // Build a months-long series (including current month)
    const monthsToShow = months;
    const chartData = [];
    const current = new Date();
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // Mongo month (1-12)
      const monthName = d.toLocaleString('default', { month: 'short' });

      const found = revenueData.find(r => r._id.year === year && r._id.month === month);
      chartData.push({ name: monthName, revenue: found ? found.monthlyRevenue : 0 });
    }

    // 4. Find Recent Pending Dues
    // Assuming 'Pending Payment' is a status in your Member model
    const pendingDues = await Member.find({ status: 'Pending Payment' })
      .select('name phone')
      .limit(5);

    // Send everything back in one clean object
    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        totalTrainers,
        currentMonthRevenue,
        pendingDues,
        chartData
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
import Member from '../models/Member.js';
import Payment from '../models/Payment.js';
import Trainer from '../models/Trainer.js';

export const getDashboardData = async (req, res) => {
  try {
    const months = parseInt(req.query.months, 10) || 6;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // 1. Get Totals
    const totalMembers = await Member.countDocuments();
    const activeMembers = await Member.countDocuments({ status: 'Active' });
    const totalTrainers = await Trainer.countDocuments({ isActive: true });

    // 📈 2. FETCH ALL RECENT PAYMENTS (No MongoDB Aggregation Trap!)
    const recentPayments = await Payment.find({
      createdAt: { $gte: startOfMonth }
    });

    // 💰 3. BULLETPROOF CALCULATION IN JAVASCRIPT
    const monthlyData = {};
    let currentMonthRevenue = 0;
    const currentMonthNum = new Date().getMonth() + 1;
    const currentYearNum = new Date().getFullYear();

    recentPayments.forEach(payment => {
      const date = new Date(payment.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const key = `${year}-${month}`;

      // Convert string to actual number safely
      const amountPaid = Number(payment.paidAmount);

      // Add to month total
      if (!monthlyData[key]) monthlyData[key] = 0;
      monthlyData[key] += amountPaid;

      // Check if it's the current month
      if (year === currentYearNum && month === currentMonthNum) {
        currentMonthRevenue += amountPaid;
      }
    });

    // 📊 4. FORMAT DATA FOR RECHARTS
    const chartData = [];
    const current = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(current.getFullYear(), current.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      const monthName = d.toLocaleString('default', { month: 'short' });

      chartData.push({ 
        name: monthName, 
        revenue: monthlyData[key] || 0 
      });
    }

    // Send data back to React
    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        activeMembers,
        totalTrainers,
        currentMonthRevenue,
        chartData
      }
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
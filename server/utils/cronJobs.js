import cron from 'node-cron';
import Member from '../models/Member.js';
import sendEmail from './sendEmail.js';

// Function to find expired memberships and update them
const checkExpiredMemberships = async () => {
  try {
    const today = new Date();
    
    // Find all active members whose due date is in the past
    const expiredMembers = await Member.find({
      status: 'Active',
      dueDate: { $lt: today }
    });

    if (expiredMembers.length === 0) {
      console.log('Cron Job: No expired memberships found today.');
      return;
    }

    console.log(`Cron Job: Found ${expiredMembers.length} expired memberships. Updating...`);

    // Loop through them, change status, and send an email
    for (const member of expiredMembers) {
      member.status = 'Pending Payment';
      await member.save();

      // Send automated reminder if they have an email on file
      if (member.email) {
        const message = `Hello ${member.name},\n\nYour gym membership expired on ${member.dueDate.toDateString()}. Please visit the front desk or use the app to clear your dues and continue your fitness journey!\n\nThank you.`;
        
        await sendEmail({
          email: member.email,
          subject: 'Gym Membership Payment Due',
          message: message
        });
      }
    }
  } catch (error) {
    console.error('Cron Job Error:', error);
  }
};

// Initialize all cron jobs
export const initCronJobs = () => {
  // This syntax means: Run at 00:00 (midnight) every single day
  cron.schedule('0 0 * * *', () => {
    console.log('Running daily membership expiry check...');
    checkExpiredMemberships();
  });
  
  console.log('Automated Cron Jobs Initialized.');
};
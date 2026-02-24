import nodemailer from 'nodemailer';

// @desc    Utility to send emails
// @param   {Object} options - Contains { email, subject, message }
const sendEmail = async (options) => {
  try {
    // 1. Create a transporter (Configure this with Gmail, Amazon SES, or Mailtrap in .env)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // e.g., "NextGenz Gym <noreply@nextgenz.com>"
      to: options.email,
      subject: options.subject,
      text: options.message,
      // You can also add html: options.html if you want to send styled templates
    };

    // 3. Actually send the email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export default sendEmail;
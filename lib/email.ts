import nodemailer from 'nodemailer';

// In a real application, you would store these in your .env file
// Using an in-memory test account for development purposes
let testAccount: nodemailer.TestAccount | null = null;
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  // Use real SMTP if provided in environment variables
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return transporter;
  }

  // Fallback to Ethereal Email for testing
  console.log('No SMTP credentials found in .env. Falling back to Ethereal Email for testing.');
  if (!testAccount) {
    testAccount = await nodemailer.createTestAccount();
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  return transporter;
}

export async function sendVerificationEmail(to: string, code: string) {
  const mailTransporter = await getTransporter();

  const info = await mailTransporter.sendMail({
    from: '"National Internship Portal" <noreply@internshipportal.com>',
    to,
    subject: 'Your Password Reset Code',
    text: `Your password reset code is: ${code}. It will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #0F172A; text-align: center;">Password Reset Request</h2>
        <p style="color: #475569; font-size: 16px;">We received a request to reset your password. Use the verification code below to proceed:</p>
        
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #3b82f6;">${code}</span>
        </div>
        
        <p style="color: #475569; font-size: 14px;">This code will expire in <strong>10 minutes</strong>.</p>
        <p style="color: #475569; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  });

  console.log('Message sent: %s', info.messageId);
  // Preview only available when sending through an Ethereal account
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log('Preview URL: %s', previewUrl);
  }
  
  return previewUrl;
}

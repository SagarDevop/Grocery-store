const nodemailer = require('nodemailer');

/**
 * Gmail SMTP Configuration
 * Note: To use this, the sender email MUST have 2-Step Verification enabled
 * and you MUST use an 'App Password' instead of your regular Gmail password.
 */

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : undefined, // Strip spaces from App Password
  },
});

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("❌ EMAIL_USER or EMAIL_PASS is missing in .env file");
}

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: `"Grocery Store" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully via Gmail:", info.messageId);
    return true;
  } catch (error) {
    console.error("Gmail SMTP Error:", error.message);
    if (error.message.includes("Invalid login")) {
        console.log("👉 Reminder: Ensure you are using a 16-character Google 'App Password', not your regular password.");
    }
    return false;
  }
};

const sendOtpEmailSignup = (receiverEmail, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #059669;">Verify Your Grocery Store Account</h2>
      <p>Your OTP is:</p>
      <h1 style="background: #f0fdf4; padding: 10px; display: inline-block; border-radius: 5px; color: #065f46;">${otp}</h1>
      <p>This OTP is valid for 1 minute.</p>
    </div>
  `;
  return sendEmail(receiverEmail, "🔐 Signup OTP", html);
};

const sendOtpEmailForgotPassword = (receiverEmail, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #dc2626;">Reset Your Password</h2>
      <p>Your OTP is:</p>
      <h1 style="background: #fee2e2; padding: 10px; display: inline-block; border-radius: 5px; color: #991b1b;">${otp}</h1>
      <p>This OTP is valid for 1 minute.</p>
    </div>
  `;
  return sendEmail(receiverEmail, "🔑 Password Reset OTP", html);
};

const sendSellerEmail = (receiverEmail, status, name) => {
  let subject, html;
  if (status === "approved") {
    subject = "✅ Seller Approved!";
    html = `<h2>Hello ${name},</h2><p>Your registration is <b>APPROVED</b>.</p>`;
  } else {
    subject = "❌ Seller Rejected";
    html = `<h2>Hello ${name},</h2><p>Your registration was <b>REJECTED</b>.</p>`;
  }
  return sendEmail(receiverEmail, subject, html);
};

const sendAdminNotificationNewSeller = (data) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  return sendEmail(
      adminEmail, 
      "📢 New Seller Request", 
      `<p>New request from <b>${data.name}</b> (${data.email})</p>`
  );
};

module.exports = {
  sendOtpEmailSignup,
  sendOtpEmailForgotPassword,
  sendSellerEmail,
  sendAdminNotificationNewSeller,
};

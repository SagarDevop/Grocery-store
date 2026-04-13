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

const sendOrderConfirmation = (receiverEmail, orderData) => {
  const itemsHtml = orderData.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>₹${item.price}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #059669;">Thank you for your order!</h2>
      <p>Your order <b>#${orderData._id}</b> has been received and is being processed.</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f8fafc; text-align: left;">
            <th style="padding: 10px;">Item</th>
            <th style="padding: 10px;">Qty</th>
            <th style="padding: 10px;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <h3 style="margin-top: 20px;">Total: ₹${orderData.total_amount}</h3>
      <p>We'll notify you when it ships!</p>
    </div>
  `;
  return sendEmail(receiverEmail, "📦 Order Confirmation", html);
};

const sendOrderStatusUpdate = (receiverEmail, orderId, status) => {
  const html = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
      <div style="font-size: 50px; margin-bottom: 20px;">🚚</div>
      <h2 style="color: #1e293b;">Order Status Updated</h2>
      <p>Your order <b>#${orderId}</b> is now: <span style="background: #e1f5fe; color: #0288d1; padding: 5px 15px; border-radius: 20px; font-weight: bold;">${status}</span></p>
      <a href="http://localhost:3000/profile" style="display: inline-block; margin-top: 30px; padding: 15px 30px; background: #059669; color: white; text-decoration: none; border-radius: 10px; font-weight: bold;">Track My Order</a>
    </div>
  `;
  return sendEmail(receiverEmail, `🚀 Order Status: ${status}`, html);
};

const sendAbandonedCartEmail = (receiverEmail, name, cartItems) => {
  const itemNames = cartItems.slice(0, 3).map(i => i.name).join(', ');
  const moreCount = cartItems.length > 3 ? `and ${cartItems.length - 3} more items` : '';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #eee; text-align: center;">
      <div style="font-size: 60px; margin-bottom: 20px;">🛒</div>
      <h2 style="color: #1e293b;">Did you forget something, ${name}?</h2>
      <p style="color: #64748b; font-size: 16px; line-height: 1.6;">Your cart is feeling lonely! We've saved your items so you can pick up exactly where you left off.</p>
      <div style="background: #f8fafc; padding: 20px; border-radius: 20px; margin: 30px 0; text-align: left;">
        <p style="font-weight: bold; color: #334155; margin-bottom: 5px;">Items in your cart:</p>
        <p style="color: #64748b; margin: 0;">${itemNames} ${moreCount}</p>
      </div>
      <a href="http://localhost:5173/cart" style="display: inline-block; padding: 18px 35px; background: #059669; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2);">Return to Cart 🥗</a>
      <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">Hurry! Your organic items are in high demand and we can't guarantee stock for long.</p>
    </div>
  `;
  return sendEmail(receiverEmail, "🛒 Your cart is waiting for you!", html);
};

module.exports = {
  sendOtpEmailSignup,
  sendOtpEmailForgotPassword,
  sendSellerEmail,
  sendAdminNotificationNewSeller,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendAbandonedCartEmail
};

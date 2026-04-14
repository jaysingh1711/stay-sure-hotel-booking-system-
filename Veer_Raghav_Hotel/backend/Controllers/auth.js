import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import User from '../Models/userModel.js';

// Utility function to create nodemailer transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email credentials are not properly configured');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: true,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
  });
};

// Centralized email-sending function
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    await transporter.sendMail({
      from: `Veer Raghav <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Email sending failed');
  }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account exists with this email address. Please check your email or create a new account.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 600000; // 10 minutes

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const emailTemplate = `
      <html>
      <!-- Your HTML content for the password reset email -->
      <body>
        <h1>Password Reset Request</h1>
        <p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 10 minutes.</p>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: 'Password Reset Request - Veer Raghav',
      html: emailTemplate,
    });

    return res.json({
      success: true,
      message: 'A password reset link has been sent to your email.',
    });
  } catch (error) {
    console.error('Password reset error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again later.',
    });
  }
};

// Reset password with token
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    user.password = newPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return res.json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Send booking confirmation email
export const sendBookingConfirmation = async (bookingDetails) => {
  try {
    const { email, name, bookingId, service, checkInDate, checkOutDate, totalPrice } = bookingDetails;

    if (!email || !name || !bookingId || !checkInDate || !checkOutDate || !service) {
      throw new Error('Missing required booking details');
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };

    const formattedCheckInDate = formatDate(checkInDate);
    const formattedCheckOutDate = formatDate(checkOutDate);

    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #FF6600;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.8em;
            color: #666;
          }
          .booking-details {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin-top: 20px;
          }
          .booking-details p {
            margin: 5px 0;
          }
          .total-price {
            font-size: 1.2em;
            font-weight: bold;
            color: #FF6600;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Confirmation</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>Thank you for choosing our service. Your booking for Room <strong>${service}</strong> has been confirmed.</p>
          <div class="booking-details">
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Check-in:</strong> ${formattedCheckInDate}</p>
            <p><strong>Check-out:</strong> ${formattedCheckOutDate}</p>
            <p class="total-price">Total Price: ₹${totalPrice.toFixed(2)}/- (INR)</p>
          </div>
          <p>We look forward to welcoming you and hope you have a great stay!</p>
        </div>
        <div class="footer">
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>&copy; ${new Date().getFullYear()} Veer Raghav. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    await sendEmail({
      to: email,
      subject: 'Booking Confirmation - Veer Raghav',
      html: emailTemplate,
    });

    console.log(`Booking confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending booking confirmation email:', error.message);
    throw error;
  }
};
export const sendCancellationConfirmation = async (cancellationDetails) => {
  try {
    const { email, name, bookingId, roomName, checkInDate, checkOutDate } = cancellationDetails;

    if (!email || !name || !bookingId || !checkInDate || !checkOutDate || !roomName) {
      throw new Error('Missing required cancellation details');
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };

    const formattedCheckInDate = formatDate(checkInDate);
    const formattedCheckOutDate = formatDate(checkOutDate);

    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Cancellation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background-color: #FF6600;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.8em;
            color: #666;
          }
          .cancellation-details {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin-top: 20px;
          }
          .cancellation-details p {
            margin: 5px 0;
          }
          .notice {
            font-size: 1.1em;
            color: #FF6600;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Cancellation</h1>
        </div>
        <div class="content">
          <p>Dear ${name},</p>
          <p>We regret to inform you that your booking for <strong>Room ${roomName}</strong> has been successfully cancelled.</p>
          <div class="cancellation-details">
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Check-in:</strong> ${formattedCheckInDate}</p>
            <p><strong>Check-out:</strong> ${formattedCheckOutDate}</p>
            <p class="notice">Your booking has been cancelled, and no further action is required from your side.</p>
          </div>
          <p>If you have any questions or need assistance, please feel free to reach out to us.</p>
          <p>We hope to welcome you again in the future!</p>
        </div>
        <div class="footer">
          <p>If you have any questions, please don't hesitate to contact us.</p>
          <p>&copy; ${new Date().getFullYear()} Veer Raghav. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    // Assuming `sendEmail` is a function that sends an email with the given details
    await sendEmail({
      to: email,
      subject: 'Booking Cancellation - Veer Raghav',
      html: emailTemplate,
    });

    console.log(`Booking cancellation email sent to ${email}`);
  } catch (error) {
    console.error('Error sending cancellation confirmation email:', error.message);
    throw error;
  }
};

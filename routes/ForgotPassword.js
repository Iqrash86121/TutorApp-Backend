const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/User'); // User model
const router = express.Router();

// Route to request a password reset link
router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour

    // Save the user with the token and expiration
    await user.save();

    // Email settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME, // Your email address
        pass: process.env.EMAIL_PASSWORD, //Password 

      },
    });

    const mailOptions = {
      to: user.email,
      from: 'password-reset@yourapp.com',
      subject: 'Password Reset',
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to reset your password.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset link sent to your email.' });

  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

// Route to reset the password
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    // Find the user with a valid reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() } // Check that token is not expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update the user password and clear reset token and expiration
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });

  } catch (error) {
    console.error('Error in resetting password:', error);
    res.status(500).json({ message: 'Something went wrong', error });
  }
});

module.exports = router;

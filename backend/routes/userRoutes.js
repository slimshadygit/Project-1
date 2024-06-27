const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendResetEmail, sendWelcomeEmail, sendLoginEmail } = require('../utils/email');
const crypto = require('crypto');
const validator = require("validator");
const { connectToMongoDB ,client} = require('../dbConnect/clientConnect');
//const User = require('../models/User');

const router = express.Router();
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate email address
    if (!validator.isEmail(email)) {
      return res.status(400).send('Invalid email address');
    }

    const db = await connectToMongoDB();
    const collection = db.collection('users');

    // Check if the email already exists
    const existingEmail = await collection.findOne({ email });
    if (existingEmail) {
      return res.status(400).send('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = { username, email, password: hashedPassword };
    const result = await collection.insertOne(newUser);

    // Send welcome email
    await sendWelcomeEmail(email, username);

    res.status(201).send(result);
  } catch (err) {
    console.error('Registration error:', err); // Log the error for debugging
    res.status(500).send(err.message);
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('users');

    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send('Invalid email or password');
    }

    // Send login email
    await sendLoginEmail(email, user.username);

    // Sign JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
    res.json({ token, username: user.username });
  } catch (err) {
    console.error('Login error:', err); // Log the error for debugging
    res.status(500).send('Login failed');
  }
});

// Reset password request route
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('users');
    const user = await collection.findOne({ email });

    if (!user) {
      return res.status(400).send('User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await collection.updateOne({ email }, { $set: { resetPasswordToken: token, resetPasswordExpires: resetTokenExpiry } });

    // Send reset password email
    await sendResetEmail(email, token);
    
    res.send('Password reset email sent');
  } catch (err) {
    console.error('Reset password error:', err); // Log the error for debugging
    res.status(500).send(err.message);
  }
});

// New password route
router.post('/new-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const db = await connectToMongoDB();
    const collection = db.collection('users');
    const user = await collection.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await collection.updateOne(
      { resetPasswordToken: token },
      { $set: { password: hashedPassword, resetPasswordToken: undefined, resetPasswordExpires: undefined } }
    );

    res.send('Password has been reset');
  } catch (err) {
    console.error('New password error:', err); // Log the error for debugging
    res.status(500).send(err.message);
  }
});



module.exports = router;

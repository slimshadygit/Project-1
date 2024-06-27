const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CounsellingForm = require('../models/counsellingform');

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Failed to fetch users');
  }
});

// Route to get all counseling forms
router.get('/counsellingforms', async (req, res) => {
  try {
    const forms = await CounsellingForm.find();
    res.json(forms);
  } catch (err) {
    console.error('Error fetching counseling forms:', err);
    res.status(500).send('Failed to fetch counseling forms');
  }
});

module.exports = router;

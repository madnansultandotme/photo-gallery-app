const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userId = await User.create(email, password);
    res.status(201).json({ id: userId, email });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// // Login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findByEmail(email);
//     if (user && await bcrypt.compare(password, user.password)) {
//       const token = jwt.sign({ id: user.id }, 'ats', { expiresIn: '1h' });
//       res.json({ token });
//     } else {
//       res.status(401).json({ error: 'Invalid credentials' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findByEmail(email);
      if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  
module.exports = router;

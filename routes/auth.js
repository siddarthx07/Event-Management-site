const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret_key';  // Use a secure key in production

// Registration Route
router.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    console.error('Error in registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Received login data:', email, password);

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const payload = {
      userId: user.id,
      username: user.username, 
      role: user.role

    };
    console.log('Received login data:', email, password,  payload.userId, payload.username);

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, username: user.username, role: user.role  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to fetch all registered users
router.get('/api/users', async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ['id', 'email', 'createdAt'] // Fetch only necessary fields
      });
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/user');  // Your User model
const authMiddleware = require('../middleware/auth');  // Your authentication middleware

// Route to change user's role to 'organizer'
router.put('/api/users/role/organizer', authMiddleware, async (req, res) => {
  try {
    // You should already have the user fetched in authMiddleware, so use req.user  
    const user = req.user;  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Change role to 'organizer'
    user.role = 'organizer';
    await user.save();  // Save the updated user data
    console.log('hi');

    res.status(200).json({ message: 'Role updated to organizer', role: user.role });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

module.exports = router;

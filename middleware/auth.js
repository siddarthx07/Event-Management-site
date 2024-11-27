const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = 'your_jwt_secret_key';

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role; // Attach role to request
    console.log('Decoded token:', decoded);
    console.log('Token:', token);

    // Optionally, fetch the full user if needed
    req.user = await User.findByPk(req.userId);
    
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;

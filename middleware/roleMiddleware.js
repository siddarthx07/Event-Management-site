

// Middleware to check if the user is an admin
const adminMiddleware = (req, res, next) => {
    if (req.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    next();
  };
  
  // Middleware to check if the user is an organizer or admin
  const organizerMiddleware = (req, res, next) => {
    const user = req.user;
    console.log(user.role)
    if (user.role !== 'organizer' && user.role !== 'admin') {
    
    return res.status(403).json({ message: 'Access denied. Organizers only.' });
    }
    next();
  };
  
  // Middleware to allow regular users to view events, but not modify them
  const regularUserMiddleware = (req, res, next) => {
    if (req.role !== 'regular') {
      return res.status(403).json({ message: 'Access denied. Regular users only.' });
    }
    next();
  };
  
  module.exports = { adminMiddleware, organizerMiddleware, regularUserMiddleware };
  
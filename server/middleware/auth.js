const jwt = require('jsonwebtoken');

// Get JWT secret from environment variable or use a default (for development only)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to check if the user is authenticated
const authenticateToken = (req, res, next) => {
  // Get token from request header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    // Add user info to the request object
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken,
  JWT_SECRET
};

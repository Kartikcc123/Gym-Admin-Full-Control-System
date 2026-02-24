import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

// 1. Check if the user is logged in
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach the user to the request
      req.user = await User.findById(decoded.id).select('-password');
      next(); 
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// 2. Check if the logged-in user is an Admin
export const adminOnly = (req, res, next) => {
  // Check if user exists, has a role, and if that role is 'admin' (ignoring uppercase/lowercase)
  if (req.user && req.user.role && req.user.role.toLowerCase() === 'admin') {
    next(); // They are an admin, let them through
  } else {
    console.error("403 Forbidden - User Role Found:", req.user?.role); // Helps us debug if it happens again
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};
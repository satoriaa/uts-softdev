const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.type === 'admin') {
        req.user = await Admin.findById(decoded.id).select('-password');
        req.userType = 'admin'; // Store user type for debugging
      } else {
        req.user = await User.findById(decoded.id).select('-password');
        req.userType = 'user';
      }
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
      }
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const authorizeAdmin = (req, res, next) => {
  // Check if user type is admin (more explicit check)
  if (req.userType === 'admin' && req.user && req.user.role === 'admin') {
    return next();
  } else {
    // Debug response
    console.log('Authorization failed:', {
      userType: req.userType,
      userRole: req.user?.role,
      userId: req.user?._id
    });
    return res.status(403).json({ 
      success: false, 
      message: 'Not authorized as admin',
      debug: {
        userType: req.userType,
        userRole: req.user?.role
      }
    });
  }
};

module.exports = { protect, authorizeAdmin };


const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User tidak ditemukan' });
      }

      next();
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ message: 'Tidak terauthorisasi, token tidak valid' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Tidak terauthorisasi, token tidak ada' });
  }
};

// Petugas or Admin only
exports.petugasOrAdmin = async (req, res, next) => {
  if (req.user && (req.user.role === 'petugas' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ 
      message: 'Akses ditolak. Hanya petugas atau admin yang dapat mengakses.' 
    });
  }
};

// Admin only
exports.admin = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Akses ditolak. Hanya admin yang dapat mengakses.' 
    });
  }
};

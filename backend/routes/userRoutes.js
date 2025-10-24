const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

// Placeholder - implement sesuai kebutuhan
router.get('/', protect, admin, (req, res) => {
  res.json({ message: 'User routes - coming soon' });
});

module.exports = router;

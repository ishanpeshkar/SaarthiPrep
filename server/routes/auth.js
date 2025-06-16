// server/routes/auth.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

const { registerUser, loginUser } = require('../controllers/authController');

// ... (keep the existing /register and /login routes)
router.post('/register', registerUser);
router.post('/login', loginUser);

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    // req.user.id is accessible from the middleware
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
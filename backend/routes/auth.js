const express = require('express');
const { register, login, getMe, updateDetails } = require('../controllers/authController');
const { protect } = require('../middleware/auth'); // Import the protection middleware

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login a user
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get the profile of the currently logged-in user
router.get('/me', protect, getMe); // This route is protected

router.put('/updatedetails', protect, updateDetails);

module.exports = router;
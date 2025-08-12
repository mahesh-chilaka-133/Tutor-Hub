const express = require('express');
const { createSession, getMySessions, updateSessionStatus } = require('../controllers/sessionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply 'protect' middleware to all routes in this file
router.use(protect);

// @route   POST /api/sessions
// @desc    Book a new session
router.post('/', authorize('student'), createSession); // Only students can book

// @route   GET /api/sessions/my-sessions
// @desc    Get all sessions for the logged-in user
router.get('/my-sessions', getMySessions);

// @route   PUT /api/sessions/:id
// @desc    Update the status of a session (confirm/cancel)
router.put('/:id', updateSessionStatus);

module.exports = router;
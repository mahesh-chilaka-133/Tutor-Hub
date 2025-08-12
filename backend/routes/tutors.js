const express = require('express');
const { getTutors, getTutor, updateTutorProfile } = require('../controllers/tutorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/tutors
// @desc    Get all tutors with optional filtering
router.get('/', getTutors);

// @route   GET /api/tutors/:id
// @desc    Get a single tutor's profile
router.get('/:id', getTutor);

// @route   PUT /api/tutors/my-profile
// @desc    Update the logged-in tutor's profile
router.put('/my-profile', protect, authorize('tutor'), updateTutorProfile); // Protected and restricted to tutors

module.exports = router;
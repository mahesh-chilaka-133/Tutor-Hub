const express = require('express');
const { createReview, getTutorReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews/tutor/:tutorId
// @desc    Create a new review for a specific tutor
router.post('/tutor/:tutorId', protect, authorize('student'), createReview); // Only students can leave reviews

// @route   GET /api/reviews/tutor/:tutorId
// @desc    Get all reviews for a specific tutor
router.get('/tutor/:tutorId', getTutorReviews);

module.exports = router;
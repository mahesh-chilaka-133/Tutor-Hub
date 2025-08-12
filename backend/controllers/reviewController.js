

const Review = require('../models/review');
const Tutor = require('../models/tutor');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a review for a tutor
// @route   POST /api/reviews/tutor/:tutorId
// @access  Private (Student only)
exports.createReview = asyncHandler(async (req, res, next) => {
    const { rating, feedback } = req.body;
    const tutorId = req.params.tutorId;

    // Check if tutor exists
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
        return next(new ErrorResponse(`Tutor not found with id of ${tutorId}`, 404));
    }
    
    // Prevent user from reviewing a tutor more than once
    const existingReview = await Review.findOne({ tutor: tutorId, student: req.user.id });
    if (existingReview) {
        return next(new ErrorResponse('You have already reviewed this tutor', 400));
    }

    const review = await Review.create({
        tutor: tutorId,
        student: req.user.id,
        rating,
        feedback
    });

    res.status(201).json({ success: true, data: review });
});

// @desc    Get all reviews for a specific tutor
// @route   GET /api/reviews/tutor/:tutorId
// @access  Public
exports.getTutorReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find({ tutor: req.params.tutorId }).populate('student', 'name');

    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});
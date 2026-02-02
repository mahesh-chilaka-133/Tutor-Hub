const Tutor = require('../models/tutor');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all tutors with filtering
// @route   GET /api/tutors
// @access  Public
exports.getTutors = asyncHandler(async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = Tutor.find(JSON.parse(queryStr)).populate({
        path: 'user',
        select: 'name email' // Populate user's name and email
    });

    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt'); // Default sort by creation date
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Tutor.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const tutors = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        };
    }

    res.status(200).json({
        success: true,
        count: tutors.length,
        pagination,
        data: tutors
    });
});


// @desc    Get single tutor by their user ID
// @route   GET /api/tutors/:id
// @access  Public
exports.getTutor = asyncHandler(async (req, res, next) => {
    const tutor = await Tutor.findById(req.params.id).populate('user', 'name email');

    if (!tutor) {
        return next(
            new ErrorResponse(`Tutor not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({ success: true, data: tutor });
});


// @desc    Update tutor details (for the logged-in tutor)
// @route   PUT /api/tutors/my-profile
// @access  Private (Tutor only)
exports.updateTutorProfile = asyncHandler(async (req, res, next) => {
    // Find the tutor profile linked to the logged-in user
    let tutor = await Tutor.findOne({ user: req.user.id });

    if (!tutor) {
        return next(new ErrorResponse('Tutor profile not found', 404));
    }

    // Update fields
    const { subjects, availability, bio, hourlyRate } = req.body;
    tutor = await Tutor.findByIdAndUpdate(tutor._id, { subjects, availability, bio, hourlyRate }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: tutor });
});
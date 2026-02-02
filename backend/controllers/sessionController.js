const Session = require('../models/session');
const Tutor = require('../models/tutor');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new booking session
// @route   POST /api/sessions
// @access  Private (Student only)
exports.createSession = asyncHandler(async (req, res, next) => {
    const { tutorId, subject, sessionDate } = req.body;

    // The student's ID comes from the logged-in user
    const studentId = req.user.id;

    // Check if the tutor exists
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
        return next(new ErrorResponse(`Tutor not found with id of ${tutorId}`, 404));
    }

    const session = await Session.create({
        student: studentId,
        tutor: tutorId,
        subject,
        sessionDate
    });

    res.status(201).json({ success: true, data: session });
});

// @desc    Get all sessions for the logged-in user (student or tutor)
// @route   GET /api/sessions/my-sessions
// @access  Private
exports.getMySessions = asyncHandler(async (req, res, next) => {
    let query;
    if (req.user.role === 'student') {
        query = Session.find({ student: req.user.id });
    } else { // Role is 'tutor'
        const tutorProfile = await Tutor.findOne({ user: req.user.id });
        if (!tutorProfile) {
            return res.status(200).json({ success: true, data: [] }); // Tutor has profile but no sessions yet
        }
        query = Session.find({ tutor: tutorProfile._id });
    }

    const sessions = await query.populate('student', 'name').populate({
        path: 'tutor',
        populate: { path: 'user', select: 'name' }
    });

    res.status(200).json({ success: true, count: sessions.length, data: sessions });
});

// @desc    Update session status (e.g., confirm or cancel)
// @route   PUT /api/sessions/:id
// @access  Private
// ... (existing imports and functions)

// @desc    Update session status (e.g., confirm or cancel) OR payment status
// @route   PUT /api/sessions/:id
// @access  Private
exports.updateSessionStatus = asyncHandler(async (req, res, next) => {
    const { status, paymentStatus } = req.body; // <-- Get both possible updates
    console.log('Update Session Request:', { paramsId: req.params.id, body: req.body, userId: req.user.id, userRole: req.user.role });

    let session = await Session.findById(req.params.id);

    if (!session) {
        return next(new ErrorResponse(`Session not found with id of ${req.params.id}`, 404));
    }

    const tutorProfile = await Tutor.findOne({ _id: session.tutor });

    let fieldsToUpdate = {};

    // Logic for updating paymentStatus (only if provided and user is student)
    if (paymentStatus && req.user.role === 'student' && session.student.toString() === req.user.id) {
        console.log('Authorized for payment update');
        fieldsToUpdate.paymentStatus = paymentStatus;
    }
    // Logic for updating general session status (only if provided and user is tutor)
    else if (status && req.user.role === 'tutor' && tutorProfile.user.toString() === req.user.id) {
        console.log('Authorized for status update (Tutor)');
        fieldsToUpdate.status = status;
    }
    // Logic for updating status to 'cancelled' (only if user is student)
    else if (status === 'cancelled' && req.user.role === 'student' && session.student.toString() === req.user.id) {
        console.log('Authorized for status update (Student Cancel)');
        fieldsToUpdate.status = status;
    }
    // If no valid update fields are provided or user is unauthorized for specific update
    else {
        console.log('Authorization Failed:', {
            isStudent: req.user.role === 'student',
            isTutor: req.user.role === 'tutor',
            studentMatch: session.student.toString() === req.user.id,
            tutorMatch: tutorProfile.user.toString() === req.user.id,
            tutorProfileUser: tutorProfile.user,
            reqUserId: req.user.id
        });
        return next(new ErrorResponse('Not authorized to perform this update or no valid fields provided', 401));
    }

    session = await Session.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    }).populate('student', 'name').populate({
        path: 'tutor',
        populate: { path: 'user', select: 'name' }
    });

    res.status(200).json({ success: true, data: session });
});
// ... (existing imports)

// @desc    Create a new booking session
// @route   POST /api/sessions
// @access  Private (Student only)
exports.createSession = asyncHandler(async (req, res, next) => {
    const { tutorId, subject, sessionDate } = req.body;
    const studentId = req.user.id;

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
        return next(new ErrorResponse(`Tutor not found with id of ${tutorId}`, 404));
    }

    const session = await Session.create({
        student: studentId,
        tutor: tutorId,
        subject,
        sessionDate,
        paymentStatus: 'pending',
        sessionPrice: tutor.hourlyRate || 0 // Use tutor's rate or 0 if not set
    });

    res.status(201).json({ success: true, data: session });
});

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = asyncHandler(async (req, res, next) => {
    const session = await Session.findById(req.params.id);

    if (!session) {
        return next(new ErrorResponse(`Session not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is session owner
    if (session.student.toString() !== req.user.id && session.tutor.toString() !== req.user.id) {
        return next(new ErrorResponse(`User not authorized to delete this session`, 401));
    }

    await session.deleteOne();

    res.status(200).json({ success: true, data: {} });
});
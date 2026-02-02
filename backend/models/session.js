const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    sessionDate: {
        type: Date,
        required: [true, 'Please specify the session date and time'],
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending',
    },
    paymentStatus: { // <-- NEW FIELD
        type: String,
        enum: ['pending', 'paid', 'refunded'], // Define possible payment states
        default: 'pending', // Default to pending payment
    },
    sessionPrice: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
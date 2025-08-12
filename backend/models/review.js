const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating between 1 and 5'],
        min: 1,
        max: 5,
    },
    feedback: {
        type: String,
        maxlength: 1000,
    },
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
const mongoose = require('mongoose');

const TutorSchema = new mongoose.Schema(
    {
        // Reference to the main User model.
        // This creates a direct link between a user's login credentials and their tutor profile.
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Links this to the 'User' model
            required: true, // A tutor profile must be associated with a user
            unique: true, // Ensures that a single user can only have one tutor profile
        },

        // An array of strings to store the subjects the tutor teaches.
        subjects: [
            {
                type: String,
                required: [true, 'Please specify at least one subject'],
                trim: true, // Removes whitespace from the beginning and end
            },
        ],

        // An array of strings to describe general availability.
        // This provides flexibility for tutors to describe their schedules.
        // Examples: "Monday 9am-12pm", "Weekends after 3pm"
        availability: {
            type: [String],
            default: [],
        },

        // A short biography for the tutor's profile page.
        bio: {
            type: String,
            maxlength: [500, 'Biography cannot be more than 500 characters'],
        },

        // Hourly rate for sessions
        hourlyRate: {
            type: Number,
            default: 0,
        },
    },
    {
        // Automatically adds `createdAt` and `updatedAt` fields to the document.
        // This is useful for tracking when profiles are created or modified.
        timestamps: true,
    }
);

module.exports = mongoose.model('Tutor', TutorSchema);
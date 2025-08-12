// Load environment variables from .env file
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const colors = require('colors'); // For colorful console logs
const videoCallRoutes = require('./routes/videoCall');

// Import custom middleware
const errorHandler = require('./middleware/error');

// --- 1. INITIALIZE EXPRESS APP & MIDDLEWARE ---
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
// This allows your frontend (on a different URL) to make requests to this backend
app.use(cors());

// Body parser middleware
// Allows us to accept JSON data in the request body
app.use(express.json());


// --- 2. DATABASE CONNECTION ---
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Mongoose 6+ no longer requires these options, but they don't hurt
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`.red);
        // Exit process with failure
        process.exit(1);
    }
};

// Connect to the database
connectDB();


// --- 3. IMPORT & MOUNT ROUTE FILES ---
// These lines link your route definitions to specific API paths.
const authRoutes = require('./routes/auth');
const tutorRoutes = require('./routes/tutors');
const sessionRoutes = require('./routes/sessions');
const reviewRoutes = require('./routes/reviews');

app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chatbot', require('./routes/chatbot'));


// --- 4. CUSTOM ERROR HANDLER MIDDLEWARE ---
// This middleware MUST be placed after all the route definitions.
// It will catch any errors that occur in your routes and format them.
app.use(errorHandler);
app.use('/api/video', videoCallRoutes);


// --- 5. START THE SERVER ---
const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections (e.g., bad database connection string)
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Tutor = require('./models/tutor');

dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (error) {
        console.error(`Error: ${error.message}`.red);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Tutor.deleteMany();

        console.log('Data Destroyed...'.red.inverse);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                password: hashedPassword,
                role: 'tutor'
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: hashedPassword,
                role: 'tutor'
            },
            {
                name: 'Alice Johnson',
                email: 'alice@example.com',
                password: hashedPassword,
                role: 'student'
            },
            {
                name: 'Michael Brown',
                email: 'michael@example.com',
                password: hashedPassword,
                role: 'tutor'
            }
        ];

        const createdUsers = await User.insertMany(users);

        const tutors = [
            {
                user: createdUsers[0]._id,
                subjects: ['Mathematics', 'Physics'],
                availability: ['Monday 10am-12pm', 'Wednesday 2pm-4pm'],
                bio: 'Experienced Math and Physics tutor with 5 years of teaching.',
                hourlyRate: 30
            },
            {
                user: createdUsers[1]._id,
                subjects: ['English', 'Literature'],
                availability: ['Tuesday 1pm-3pm', 'Thursday 10am-12pm'],
                bio: 'Passionate about literature and help students improve their writing.',
                hourlyRate: 25
            },
            {
                user: createdUsers[3]._id,
                subjects: ['Chemistry', 'Biology'],
                availability: ['Weekends 10am-4pm'],
                bio: 'Science enthusiast helping students master Chemistry and Biology.',
                hourlyRate: 35
            }
        ];

        await Tutor.insertMany(tutors);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

importData();

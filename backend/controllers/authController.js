const User = require('../models/User');
const Tutor = require('../models/tutor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Import the necessary email utilities
const sendEmail = require('../utils/sendEmail');
const { generateWelcomeEmail } = require('../utils/emailTemplate');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    // Create the new user
    const newUser = await User.create({ name, email, password, role });

    // Create tutor profile if role is tutor
    if (newUser.role === 'tutor') {
      await Tutor.create({
        user: newUser._id,
        subjects: [],
        availability: [],
        bio: '',
      });
    }

    // --- START: Send Welcome Email ---
    try {
      await sendEmail({
        email: newUser.email,
        subject: 'Welcome to TutorHub!',
        html: generateWelcomeEmail(newUser.name, newUser.role),
      });
      console.log(`✅ Welcome email sent to ${newUser.email}`);
    } catch (emailError) {
      // Log the error but do not stop the registration process
      console.error('❌ Error sending welcome email:', emailError);
    }
    // --- END: Send Welcome Email ---

    // Generate token and respond
    const token = jwt.sign({ id: newUser._id, role: newUser.role, name: newUser.name }, process.env.JWT_SECRET, { expiresIn: '12h' });
    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({ message: 'User registered successfully.', token, user: userWithoutPassword });

  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials. User not found.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials. Password incorrect.' });
    }
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET, { expiresIn: '12h' });
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error during login.' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error('GetMe error:', err.message);
    res.status(500).json({ error: 'Server error while fetching user profile.' });
  }
};

const updateDetails = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required.' });
    }

    const fieldsToUpdate = { name, email };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Update details error:', error);
    res.status(500).json({ error: 'Server error while updating details.' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateDetails,
};
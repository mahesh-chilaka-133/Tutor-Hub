const express = require('express');
const router = express.Router();
const Tutor = require('../models/tutor'); // Your Mongoose model
require('dotenv').config();
const OpenAI = require('openai');

// Initialize OpenAI client (v4+)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper: Fetch relevant data from the database based on the user's question
async function fetchRelevantData(question) {
  const q = question.toLowerCase();

  // 1. Find tutors
  if (q.includes('find tutor') || q.includes('show tutors') || q.includes('list tutor')) {
    const tutors = await Tutor.find().limit(3).populate('user', 'name');
    if (!tutors.length) return null; // No data found
    return "Tutors: " + tutors.map(t => t.user?.name || t.name || 'Unknown').join(', ');
  }

  // 2. Find tutors by subject
  if (q.includes('find') && q.includes('subject')) {
    const subjectMatch = q.match(/subject\s+([a-z]+)/i);
    if (subjectMatch) {
      const subject = subjectMatch[1];
      const tutors = await Tutor.find({ subjects: { $regex: subject, $options: 'i' } }).limit(3).populate('user', 'name');
      if (!tutors.length) return null; // No data found
      return `Tutors for ${subject}: ` + tutors.map(t => t.user?.name || t.name || 'Unknown').join(', ');
    }
    return null; // No subject specified
  }

  // 3. List subjects
  if (q.includes('subjects') || q.includes('what can i learn')) {
    const tutors = await Tutor.find().limit(10);
    const allSubjects = tutors.flatMap(t => t.subjects || []);
    const uniqueSubjects = [...new Set(allSubjects)];
    if (!uniqueSubjects.length) return null; // No data found
    return "Some subjects you can learn: " + uniqueSubjects.join(', ');
  }

  // 4. How to book
  if (q.includes('how to book') || q.includes('book session') || q.includes('booking')) {
    return 'To book a session, visit the tutor profile and click the "Book Session" button. You can also manage your bookings from your dashboard.';
  }

  // 5. Contact/Support
  if (q.includes('contact') || q.includes('support') || q.includes('help')) {
    return 'For support, please use the "Contact Us" page or email support@yourplatform.com.';
  }

  // 6. Default: No relevant data found
  return null;
}

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ answer: "Please provide a valid question." });
    }

    // 1. Try to fetch relevant data from DB
    const dbData = await fetchRelevantData(message);

    // 2. If database has an answer, use it
    if (dbData) {
      return res.json({ answer: dbData });
    }

    // 3. Otherwise, fallback to ChatGPT (OpenAI)
    const systemPrompt = "You are an AI assistant for the Tutor Hub platform. The database did not have a direct answer. Please provide helpful, general information related to the user's question about tutors, subjects, bookings, or education.";
    const userPrompt = message;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or "gpt-4" if available
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const answer = completion.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't generate an answer.";
    res.json({ answer });
  } catch (err) {
    console.error('Chatbot error:', err?.response?.data || err.stack || err);
    res.status(500).json({ answer: "Sorry, I'm having trouble answering right now." });
  }
});

module.exports = router;
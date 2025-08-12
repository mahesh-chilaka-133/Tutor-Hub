const express = require('express');
const { generateVideoToken } = require('../controllers/videoCallController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/token', protect, generateVideoToken);

module.exports = router;

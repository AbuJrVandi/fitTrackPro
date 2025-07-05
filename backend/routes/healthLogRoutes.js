const express = require('express');
const router = express.Router();
const { addHealthLog, getHealthLogs } = require('../controllers/healthLogController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, addHealthLog)
  .get(protect, getHealthLogs);

module.exports = router;

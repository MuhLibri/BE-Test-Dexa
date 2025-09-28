const express = require('express');
const router = express.Router();
const upload = require('../uploadConfig.js');
const { body } = require('express-validator');
const { clockIn, getHistory, getAllAttendance } = require('../controllers/attendanceController.js');

// Validation rules for clock-in
const clockInValidation = [
    body('timestamp').optional().isISO8601().toDate().withMessage('Invalid timestamp format. Please use ISO8601 format.'),
];

router.post('/clock-in', upload.single('photo'), clockInValidation, clockIn);
router.get('/all', getAllAttendance);
router.get('/me', getHistory);

module.exports = router;
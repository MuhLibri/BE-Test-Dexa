const express = require('express');
const router = express.Router();
const controller = require('../controllers/attendanceController.js');
const upload = require('../uploadConfig.js');

router.post('/', upload.single('photo'), controller.clockIn);
router.get('/', controller.getAllAttendance);

module.exports = router;
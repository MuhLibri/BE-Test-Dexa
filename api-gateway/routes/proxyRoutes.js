const express = require('express');
const { proxyOptions, createProxyMiddleware } = require('../config/proxy');
const { AUTH_SERVICE_URL, EMPLOYEE_SERVICE_URL, ATTENDANCE_SERVICE_URL } = require('../config/env');
const authenticateToken = require('../middleware/authentication');
const authorizeHR = require('../middleware/authorization');
const authLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Auth Service
router.use('/auth', authLimiter, createProxyMiddleware(proxyOptions(AUTH_SERVICE_URL)));

// Employee Service
router.use('/employees', authenticateToken, authorizeHR, createProxyMiddleware(proxyOptions(EMPLOYEE_SERVICE_URL)));

// Attendance Service
router.use('/attendances/all', authenticateToken, authorizeHR, createProxyMiddleware(proxyOptions(`${ATTENDANCE_SERVICE_URL}/all`)));
router.use('/attendances/uploads', authenticateToken, authorizeHR, createProxyMiddleware(proxyOptions(`${ATTENDANCE_SERVICE_URL}/uploads`)));
router.use('/attendances', authenticateToken, createProxyMiddleware(proxyOptions(ATTENDANCE_SERVICE_URL)));


module.exports = router;

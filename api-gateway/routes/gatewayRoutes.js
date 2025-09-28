const express = require('express');
const authenticateToken = require('../middleware/authentication');

const router = express.Router();

// Health Check Endpoint
router.get('/health', (req, res) => res.status(200).json({ status: 'healthy' }));

// Check session validity
router.get('/auth/check-session', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'Session is valid.',
        user: req.user
    });
});

// Logout Endpoint
router.post('/auth/logout', authenticateToken, (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        path: '/',
    });
    res.status(200).json({ message: 'Logout successful.' });
});

module.exports = router;

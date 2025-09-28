const rateLimit = require('express-rate-limit');


// Rate Limiter for Auth Service
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // max 15 minutes
    max: 10, // max 10 requests
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});


module.exports = authLimiter;
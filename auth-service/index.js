require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes.js');

const app = express();

// --- Middleware ---
app.use(helmet());
app.use(morgan('dev'));
// Middleware to verify requests come from API Gateway
const verifyGatewayRequest = (req, res, next) => {
    const secret = req.headers['x-gateway-secret'];
    if (!secret || secret !== process.env.GATEWAY_SECRET_KEY) {
        return res.status(403).json({ message: 'Access denied. Requests must come from the API Gateway.' });
    }
    next();
};

app.use(verifyGatewayRequest);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'auth-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`Auth Service is running on http://localhost:${PORT}`);
});
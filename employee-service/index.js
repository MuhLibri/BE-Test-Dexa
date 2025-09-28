require('dotenv').config();
const express = require('express');
const employeeRoutes = require('./routes/employeeRoutes.js');
const morgan = require('morgan');
const helmet = require('helmet');
const app = express();


// --- Middleware ---
app.use(morgan('dev'));
app.use(helmet());

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

const PORT = process.env.PORT || 3002;

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'employee-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('/', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Employee Service running on http://localhost:${PORT}`);
});
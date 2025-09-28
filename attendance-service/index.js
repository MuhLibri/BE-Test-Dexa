require('dotenv').config();
const express = require('express');
const path = require('path');
const attendanceRoutes = require('./routes/attendanceRoutes.js');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// --- Middleware ---
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
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

const PORT = process.env.PORT || 3003;

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'attendance-service',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', attendanceRoutes);

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message
    });
});

app.listen(PORT, () => {
    console.log(`Attendance Service is running on http://localhost:${PORT}`);
});
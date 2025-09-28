const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

// --- Konfigurasi & Route ---
const { PORT, FRONTEND_URL } = require('./config/env');
const gatewayRoutes = require('./routes/gatewayRoutes');
const aggregatorRoutes = require('./routes/aggregatorRoutes');
const proxyRoutes = require('./routes/proxyRoutes');

const app = express();

// --- Middleware Utama ---
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// --- Routes ---
// Gateway Routes (Health Check, Auth, Logout)
app.use('/', gatewayRoutes);

// Aggregator Routes
app.use('/', aggregatorRoutes);

// Proxy Routes to Microservices
app.use('/', proxyRoutes);


// --- Start Server ---
app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});

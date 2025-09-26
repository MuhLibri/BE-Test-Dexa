require('dotenv').config();
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const axios = require('axios');

const app = express();

const corsOptions = {
    origin: process.env.FRONTEND_URL,
};
app.use(cors(corsOptions));
app.use(express.json());


const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    try {
        const response = await axios.post(`${process.env.AUTH_SERVICE_URL}/validate-token`, { token });
        
        const { user } = response.data;

        req.headers['x-user-id'] = user.userId;
        req.headers['x-employee-id'] = user.employeeId;
        req.headers['x-user-fullname'] = user.fullName;
        req.headers['x-user-role'] = user.role;
        
        next();
    } catch (error) {
        console.error('Error validating token:', error.message);
        return res.status(403).json({ msg: 'Forbidden: Invalid token' });
    }
};

const authorizeAdmin = (req, res, next) => {
    const userRole = req.headers['x-user-role'];
    if (userRole === 'hr') {
        next();
    } else {
        res.status(403).json({ msg: 'Forbidden: Admin access required' });
    }
};

console.log('Setting up routes...');

app.use('/auth', proxy(process.env.AUTH_SERVICE_URL));
app.use('/attendance', authenticate, proxy(process.env.ATTENDANCE_SERVICE_URL));
app.use('/employees', authenticate, authorizeAdmin, proxy(process.env.EMPLOYEE_SERVICE_URL));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway is running and listening on port ${PORT}`);
});
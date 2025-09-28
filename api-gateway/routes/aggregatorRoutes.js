const express = require('express');
const axios = require('axios');
const authenticateToken = require('../middleware/authentication');
const authorizeHR = require('../middleware/authorization');
const { AUTH_SERVICE_URL, EMPLOYEE_SERVICE_URL, GATEWAY_SECRET_KEY } = require('../config/env');

const router = express.Router();

router.post('/employees', authenticateToken, authorizeHR, async (req, res) => {
    console.log('[Aggregator] Starting add-employee process...');
    
    const requiredFields = [
        'employeeId', 'email', 'password', 'fullName', 'identityNumber', 
        'gender', 'position', 'division', 'phone', 'dateOfBirth', 
        'placeOfBirth', 'address'
    ];

    const missingFields = requiredFields.filter(field => {
        const value = req.body[field];
        return value === null || value === undefined || value === '';
    });

    if (missingFields.length > 0) {
        return res.status(400).json({ 
            message: `Missing or empty required fields: ${missingFields.join(', ')}` 
        });
    }

    const { 
        employeeId, email, password, role, fullName, 
        identityNumber, gender, position, division, phone, 
        dateOfBirth, placeOfBirth, address, status 
    } = req.body;

    try {
        console.log(`[Aggregator] Calling auth-service to register for employee ID: ${employeeId}`);
        await axios.post(
            `${AUTH_SERVICE_URL}/register`,
            { employeeId, email, password, fullName, role: role || 'EMPLOYEE' },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Gateway-Secret': GATEWAY_SECRET_KEY
                }
            }
        );
        console.log('[Aggregator] Auth-service success.');
        
        console.log(`[Aggregator] Calling employee-service to create profile for employee ID: ${employeeId}`);
        await axios.post(
            `${EMPLOYEE_SERVICE_URL}`,
            { 
                employeeId, fullName, email, identityNumber, gender, position,
                division, phone, dateOfBirth, placeOfBirth, address,
                status: status || 'ACTIVE'
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Gateway-Secret': GATEWAY_SECRET_KEY
                }
            }
        );
        console.log('[Aggregator] Employee-service success.');

        res.status(201).json({ 
            message: 'Employee added successfully.',
            employeeId: employeeId
        });

    } catch (error) {
        console.error('[Aggregator] Error during add-employee process:', error.message);
        if (error.response) {
            return res.status(error.response.status).json(error.response.data);
        }
        return res.status(502).json({ message: 'Bad Gateway: An error occurred while communicating with internal services.' });
    }
});

module.exports = router;

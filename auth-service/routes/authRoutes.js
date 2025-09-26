const express = require('express');
const router = express.Router();

const { register, login, validateToken } = require('../controllers/authController.js');


router.post('/register', register);
router.post('/login', login);
router.post('/validate-token', validateToken);

module.exports = router;
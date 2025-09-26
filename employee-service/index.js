require('dotenv').config();
const express = require('express');
const cors = require('cors');
const employeeRoutes = require('./routes/employeeRoutes.js');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/', employeeRoutes);

app.listen(PORT, () => {
    console.log(`Employee Service running on http://localhost:${PORT}`);
});
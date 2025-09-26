require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const attendanceRoutes = require('./routes/attendanceRoutes.js');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3003;


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', attendanceRoutes);

app.listen(PORT, () => {
    console.log(`Attendance Service is running on http://localhost:${PORT}`);
});
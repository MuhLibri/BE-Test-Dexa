require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes.js');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`Auth Service is running on http://localhost:${PORT}`);
});
// backend/server.js

const express = require('express');
const cors = require('cors'); // Add CORS middleware
const app = express();
const PORT = process.env.PORT || 5000;

const pool = require('./config/db'); // Database connection

// Middleware to parse JSON
app.use(express.json());

// Enable CORS for frontend
app.use(cors({
    origin: ['http://localhost:5173', 'https://jhsims.vercel.app'], // Allow only your frontend
    credentials: true                 // Allow cookies/session if needed
}));

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'JHSIMS API is running!' });
});

// Import and use auth routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Import and use dashboard routes
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api', dashboardRoutes);

// Student routes
const studentRoutes = require('./routes/studentRoutes');
app.use('/api/students', studentRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

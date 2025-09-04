// backend/routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const { dashboard } = require('../controllers/dashboardController');
const auth = require('../middleware/authMiddleware');

// Protected route
router.get('/dashboard', auth, dashboard);

module.exports = router;
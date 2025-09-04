// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Get token from header: "Authorization: Bearer token123"
    const header = req.header('Authorization');

    if (!header) {
        return res.status(401).json({ error: 'No token, access denied' });
    }

    // Extract token (remove "Bearer " part)
    const token = header.replace('Bearer ', '');

    try {
        // Verify token
        const decoded = jwt.verify(token, 'your_jwt_secret'); // 🔐 Same secret as in login
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the route handler
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

module.exports = auth;
// backend/config/db.js

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for Render
    }
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ DB connection error:', err.stack);
    } else {
        console.log('✅ Database connected:', res.rows[0].now);
    }
});

module.exports = pool;
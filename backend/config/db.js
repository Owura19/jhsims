// backend/config/db.js

const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',           // default user (change if yours is different)
    host: 'localhost',
    database: 'jhsims_db',      // we'll create this next
    password: 'Owura@gama2019',   // ⚠️ Replace with your actual PostgreSQL password
    port: 5432,
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('✅ Database connected:', res.rows[0].now);
    }
});

module.exports = pool;
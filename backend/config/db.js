// backend/config/db.js

const { Pool } = require('pg');

const pool = new Pool({
    // Only use DATABASE_URL if it exists (i.e., on Render)
    ...(process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false // For Render
            }
        }
        : {
            // Otherwise, use local config
            user: 'postgres',
            host: 'localhost',
            database: 'jhsims_db',
            password: 'Owura@gama2019', // 👈 Replace with your actual local PG password
            port: 5432
        }
    )
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('❌ DB connection error:', err.stack);
    } else {
        console.log('✅ Database connected:', res.rows[0].now);
    }
});

module.exports = pool;
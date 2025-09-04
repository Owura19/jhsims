// backend/controllers/studentController.js

const pool = require('../config/db');

// GET all students
exports.getStudents = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM students WHERE status = $1 ORDER BY last_name', ['active']);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET student by ID
exports.getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM students WHERE id = $1 AND status = $2', [id, 'active']);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// POST create student
exports.createStudent = async (req, res) => {
    const { first_name, last_name, date_of_birth, gender, address, phone, email } = req.body;

    // Only admins can create students
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO students (first_name, last_name, date_of_birth, gender, address, phone, email)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [first_name, last_name, date_of_birth, gender, address, phone, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create student' });
    }
};

// PUT update student
exports.updateStudent = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, date_of_birth, gender, address, phone, email } = req.body;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    try {
        const result = await pool.query(
            `UPDATE students
       SET first_name = $1, last_name = $2, date_of_birth = $3, gender = $4,
           address = $5, phone = $6, email = $7, updated_at = NOW()
       WHERE id = $8 AND status = 'active'
       RETURNING *`,
            [first_name, last_name, date_of_birth, gender, address, phone, email, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found or already inactive' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update student' });
    }
};

// DELETE (soft delete) student
exports.deleteStudent = async (req, res) => {
    const { id } = req.params;

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    try {
        const result = await pool.query(
            `UPDATE students SET status = 'inactive' WHERE id = $1 AND status = 'active' RETURNING id`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found or already inactive' });
        }

        res.json({ message: 'Student marked as inactive', id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete student' });
    }
};
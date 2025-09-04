// backend/routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/authMiddleware');

// All routes protected + admin-only for mutations
router.get('/', auth, studentController.getStudents);
router.get('/:id', auth, studentController.getStudentById);
router.post('/', auth, studentController.createStudent);
router.put('/:id', auth, studentController.updateStudent);
router.delete('/:id', auth, studentController.deleteStudent);

module.exports = router;
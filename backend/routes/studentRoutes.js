/**
 * Student Routes
 * 
 * This file defines all the URL routes for the application.
 * Each route is mapped to a controller function.
 */

const express = require('express');
const router = express.Router();

// Import the student controller
const studentController = require('../controllers/studentController');

// =============================================
// PAGE ROUTES (Render EJS pages)
// =============================================

// Dashboard - Home page
router.get('/', studentController.getDashboard);

// View all students
router.get('/students', studentController.getStudents);

// Add student form
router.get('/students/add', studentController.getAddStudent);

// Edit student form
router.get('/students/edit/:id', studentController.getEditStudent);

// About page
router.get('/about', studentController.getAbout);

// =============================================
// API ROUTES (Handle form submissions and actions)
// =============================================

// Search students (returns JSON)
router.get('/students/search', studentController.searchStudents);

// Create a new student (returns JSON)
router.post('/students/add', studentController.postAddStudent);

// Update a student (returns JSON)
router.post('/students/edit/:id', studentController.postEditStudent);

// Delete a student (returns JSON)
router.delete('/students/delete/:id', studentController.deleteStudent);

module.exports = router;

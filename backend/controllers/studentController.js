/**
 * Student Controller
 * 
 * This file contains the business logic for handling student operations.
 * Each function handles a specific route action (view, create, update, delete, search).
 */

const studentModel = require('../models/studentModel');

// =============================================
// DASHBOARD PAGE
// =============================================

/**
 * Render the dashboard page with stats and recent students
 */
async function getDashboard(req, res) {
    try {
        const totalStudents = await studentModel.getStudentCount();
        const recentStudents = await studentModel.getRecentStudents();

        res.render('pages/dashboard', {
            title: 'Dashboard',
            totalStudents,
            recentStudents
        });
    } catch (error) {
        console.error('Dashboard error:', error.message);
        res.render('pages/dashboard', {
            title: 'Dashboard',
            totalStudents: 0,
            recentStudents: [],
            error: 'Failed to load dashboard data.'
        });
    }
}

// =============================================
// VIEW ALL STUDENTS
// =============================================

/**
 * Render the students list page with all students
 */
async function getStudents(req, res) {
    try {
        const students = await studentModel.getAllStudents();

        res.render('pages/students', {
            title: 'All Students',
            students
        });
    } catch (error) {
        console.error('Get students error:', error.message);
        res.render('pages/students', {
            title: 'All Students',
            students: [],
            error: 'Failed to load students.'
        });
    }
}

// =============================================
// ADD STUDENT FORM
// =============================================

/**
 * Render the add student form page
 */
function getAddStudent(req, res) {
    res.render('pages/add-student', {
        title: 'Add Student'
    });
}

// =============================================
// CREATE STUDENT
// =============================================

/**
 * Handle student creation (POST request)
 * Validates input and creates a new student record
 */
async function postAddStudent(req, res) {
    try {
        const { roll_number, name, age, gender, course, email } = req.body;

        // --- Validation ---

        // Check all fields are provided
        if (!roll_number || !name || !age || !gender || !course || !email) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }

        // Validate age is a positive number
        if (parseInt(age) <= 0 || isNaN(parseInt(age))) {
            return res.status(400).json({
                success: false,
                message: 'Age must be a positive number.'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address.'
            });
        }

        // --- Create Student ---

        const student = {
            roll_number: roll_number.trim(),
            name: name.trim(),
            age: parseInt(age),
            gender: gender.trim(),
            course: course.trim(),
            email: email.trim().toLowerCase()
        };

        const result = await studentModel.createStudent(student);

        res.status(201).json({
            success: true,
            message: 'Student added successfully!',
            studentId: result.id
        });

    } catch (error) {
        console.error('Create student error:', error.message);

        // Handle unique constraint violations
        if (error.message.includes('UNIQUE constraint failed: students.roll_number')) {
            return res.status(400).json({
                success: false,
                message: 'A student with this roll number already exists.'
            });
        }
        if (error.message.includes('UNIQUE constraint failed: students.email')) {
            return res.status(400).json({
                success: false,
                message: 'A student with this email already exists.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to add student. Please try again.'
        });
    }
}

// =============================================
// EDIT STUDENT FORM
// =============================================

/**
 * Render the edit student form with pre-filled data
 */
async function getEditStudent(req, res) {
    try {
        const { id } = req.params;
        const student = await studentModel.getStudentById(id);

        // Check if student exists
        if (!student) {
            return res.render('pages/students', {
                title: 'All Students',
                students: await studentModel.getAllStudents(),
                error: 'Student not found.'
            });
        }

        res.render('pages/edit-student', {
            title: 'Edit Student',
            student
        });
    } catch (error) {
        console.error('Edit student error:', error.message);
        res.redirect('/students');
    }
}

// =============================================
// UPDATE STUDENT
// =============================================

/**
 * Handle student update (POST request)
 * Validates input and updates the student record
 */
async function postEditStudent(req, res) {
    try {
        const { id } = req.params;
        const { roll_number, name, age, gender, course, email } = req.body;

        // --- Validation ---

        // Check all fields are provided
        if (!roll_number || !name || !age || !gender || !course || !email) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }

        // Validate age
        if (parseInt(age) <= 0 || isNaN(parseInt(age))) {
            return res.status(400).json({
                success: false,
                message: 'Age must be a positive number.'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address.'
            });
        }

        // Check if student exists
        const existingStudent = await studentModel.getStudentById(id);
        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found.'
            });
        }

        // --- Update Student ---

        const student = {
            roll_number: roll_number.trim(),
            name: name.trim(),
            age: parseInt(age),
            gender: gender.trim(),
            course: course.trim(),
            email: email.trim().toLowerCase()
        };

        await studentModel.updateStudent(id, student);

        res.status(200).json({
            success: true,
            message: 'Student updated successfully!'
        });

    } catch (error) {
        console.error('Update student error:', error.message);

        // Handle unique constraint violations
        if (error.message.includes('UNIQUE constraint failed: students.roll_number')) {
            return res.status(400).json({
                success: false,
                message: 'A student with this roll number already exists.'
            });
        }
        if (error.message.includes('UNIQUE constraint failed: students.email')) {
            return res.status(400).json({
                success: false,
                message: 'A student with this email already exists.'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update student. Please try again.'
        });
    }
}

// =============================================
// DELETE STUDENT
// =============================================

/**
 * Handle student deletion (DELETE request)
 * Returns JSON response for async deletion
 */
async function deleteStudent(req, res) {
    try {
        const { id } = req.params;

        // Check if student exists
        const student = await studentModel.getStudentById(id);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found.'
            });
        }

        // Delete the student
        await studentModel.deleteStudent(id);

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully!'
        });

    } catch (error) {
        console.error('Delete student error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to delete student. Please try again.'
        });
    }
}

// =============================================
// SEARCH STUDENTS
// =============================================

/**
 * Search students by name or roll number
 * Returns JSON for asynchronous search
 */
async function searchStudents(req, res) {
    try {
        const { query } = req.query;

        // If no search query, return all students
        if (!query || query.trim() === '') {
            const students = await studentModel.getAllStudents();
            return res.json({ success: true, students });
        }

        // Search for matching students
        const students = await studentModel.searchStudents(query.trim());

        res.json({
            success: true,
            students,
            query: query.trim()
        });

    } catch (error) {
        console.error('Search error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Search failed. Please try again.'
        });
    }
}

// =============================================
// ABOUT PAGE
// =============================================

/**
 * Render the about page
 */
function getAbout(req, res) {
    res.render('pages/about', {
        title: 'About'
    });
}

// Export all controller functions
module.exports = {
    getDashboard,
    getStudents,
    getAddStudent,
    postAddStudent,
    getEditStudent,
    postEditStudent,
    deleteStudent,
    searchStudents,
    getAbout
};

/**
 * Student Model
 * 
 * This file contains all database operations for the students table.
 * Each function returns a Promise for use with async/await.
 */

const { db } = require('../config/database');

// =============================================
// GET ALL STUDENTS
// =============================================

/**
 * Retrieve all students from the database
 * @returns {Promise<Array>} Array of student objects
 */
function getAllStudents() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM students ORDER BY id DESC';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// =============================================
// GET STUDENT BY ID
// =============================================

/**
 * Retrieve a single student by their ID
 * @param {number} id - The student's ID
 * @returns {Promise<Object>} Student object
 */
function getStudentById(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM students WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// =============================================
// CREATE STUDENT
// =============================================

/**
 * Add a new student to the database
 * @param {Object} student - Student data object
 * @returns {Promise<Object>} Result with the new student's ID
 */
function createStudent(student) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO students (roll_number, name, age, gender, course, email)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const params = [
            student.roll_number,
            student.name,
            student.age,
            student.gender,
            student.course,
            student.email
        ];

        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
        });
    });
}

// =============================================
// UPDATE STUDENT
// =============================================

/**
 * Update an existing student's information
 * @param {number} id - The student's ID
 * @param {Object} student - Updated student data
 * @returns {Promise<Object>} Result with number of changes
 */
function updateStudent(id, student) {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE students 
            SET roll_number = ?, name = ?, age = ?, gender = ?, course = ?, email = ?
            WHERE id = ?
        `;
        const params = [
            student.roll_number,
            student.name,
            student.age,
            student.gender,
            student.course,
            student.email,
            id
        ];

        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
}

// =============================================
// DELETE STUDENT
// =============================================

/**
 * Delete a student from the database
 * @param {number} id - The student's ID
 * @returns {Promise<Object>} Result with number of changes
 */
function deleteStudent(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM students WHERE id = ?';
        db.run(sql, [id], function (err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
}

// =============================================
// SEARCH STUDENTS
// =============================================

/**
 * Search students by name or roll number
 * @param {string} query - Search term
 * @returns {Promise<Array>} Array of matching students
 */
function searchStudents(query) {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM students 
            WHERE name LIKE ? OR roll_number LIKE ?
            ORDER BY id DESC
        `;
        const searchTerm = `%${query}%`;
        db.all(sql, [searchTerm, searchTerm], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// =============================================
// GET RECENT STUDENTS
// =============================================

/**
 * Get the 5 most recently added students
 * @returns {Promise<Array>} Array of 5 student objects
 */
function getRecentStudents() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM students ORDER BY id DESC LIMIT 5';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// =============================================
// GET STUDENT COUNT
// =============================================

/**
 * Get the total number of students
 * @returns {Promise<number>} Total student count
 */
function getStudentCount() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT COUNT(*) as count FROM students';
        db.get(sql, [], (err, row) => {
            if (err) reject(err);
            else resolve(row.count);
        });
    });
}

// Export all model functions
module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    searchStudents,
    getRecentStudents,
    getStudentCount
};

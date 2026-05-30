/**
 * Database Configuration
 * 
 * This file handles SQLite database connection and initialization.
 * It creates the students table if it doesn't exist and seeds
 * sample data on first run.
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the SQLite database file
const DB_PATH = path.join(__dirname, '../database/students.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('✓ Connected to SQLite database');
    }
});

// =============================================
// SAMPLE DATA
// =============================================

// 10 sample student records for seeding the database
const sampleStudents = [
    { roll_number: 'CS2024001', name: 'Aarav Sharma', age: 20, gender: 'Male', course: 'Computer Science', email: 'aarav.sharma@college.edu' },
    { roll_number: 'CS2024002', name: 'Priya Patel', age: 19, gender: 'Female', course: 'Computer Science', email: 'priya.patel@college.edu' },
    { roll_number: 'EC2024001', name: 'Rahul Verma', age: 21, gender: 'Male', course: 'Electronics', email: 'rahul.verma@college.edu' },
    { roll_number: 'ME2024001', name: 'Sneha Gupta', age: 20, gender: 'Female', course: 'Mechanical Engineering', email: 'sneha.gupta@college.edu' },
    { roll_number: 'CS2024003', name: 'Vikram Singh', age: 22, gender: 'Male', course: 'Computer Science', email: 'vikram.singh@college.edu' },
    { roll_number: 'EC2024002', name: 'Ananya Reddy', age: 19, gender: 'Female', course: 'Electronics', email: 'ananya.reddy@college.edu' },
    { roll_number: 'ME2024002', name: 'Arjun Kumar', age: 21, gender: 'Male', course: 'Mechanical Engineering', email: 'arjun.kumar@college.edu' },
    { roll_number: 'CS2024004', name: 'Kavya Nair', age: 20, gender: 'Female', course: 'Computer Science', email: 'kavya.nair@college.edu' },
    { roll_number: 'CE2024001', name: 'Rohan Joshi', age: 22, gender: 'Male', course: 'Civil Engineering', email: 'rohan.joshi@college.edu' },
    { roll_number: 'CE2024002', name: 'Meera Iyer', age: 19, gender: 'Female', course: 'Civil Engineering', email: 'meera.iyer@college.edu' }
];

// =============================================
// DATABASE INITIALIZATION
// =============================================

/**
 * Initialize the database:
 * 1. Create the students table if it doesn't exist
 * 2. Seed with sample data if the table is empty
 */
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        // Create the students table
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                roll_number TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                age INTEGER NOT NULL,
                gender TEXT NOT NULL,
                course TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL
            )
        `;

        db.run(createTableSQL, (err) => {
            if (err) {
                reject(err);
                return;
            }

            console.log('✓ Students table is ready');

            // Check if the table is empty
            db.get('SELECT COUNT(*) as count FROM students', (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }

                // If table is empty, seed with sample data
                if (row.count === 0) {
                    console.log('  Seeding database with sample data...');
                    seedDatabase()
                        .then(() => {
                            console.log('✓ Sample data inserted (10 records)');
                            resolve();
                        })
                        .catch(reject);
                } else {
                    console.log(`✓ Database has ${row.count} existing records`);
                    resolve();
                }
            });
        });
    });
}

/**
 * Seed the database with sample student records
 */
function seedDatabase() {
    return new Promise((resolve, reject) => {
        const insertSQL = `
            INSERT INTO students (roll_number, name, age, gender, course, email)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // Use a transaction for better performance
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            sampleStudents.forEach((student) => {
                db.run(insertSQL, [
                    student.roll_number,
                    student.name,
                    student.age,
                    student.gender,
                    student.course,
                    student.email
                ]);
            });

            db.run('COMMIT', (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
}

// Export the database connection and initialization function
module.exports = { db, initializeDatabase };

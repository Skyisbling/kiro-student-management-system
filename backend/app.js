/**
 * Student Database Management System
 * Main Application File (app.js)
 * 
 * This file sets up the Express server, configures middleware,
 * and starts the application.
 */

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Import routes
const studentRoutes = require('./routes/studentRoutes');

// Import database initialization
const { initializeDatabase } = require('./config/database');

// Create Express application
const app = express();

// Set the port (use 3000 by default)
const PORT = process.env.PORT || 3000;

// =============================================
// MIDDLEWARE CONFIGURATION
// =============================================

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Parse JSON request bodies
app.use(express.json());

// Serve static files (CSS, JS, images) from the frontend/assets folder
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// =============================================
// VIEW ENGINE CONFIGURATION
// =============================================

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Set the views directory
app.set('views', path.join(__dirname, '../frontend/views'));

// Configure express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layout'); // Use layout.ejs as the default layout

// =============================================
// ROUTES
// =============================================

// Use student routes for all requests
app.use('/', studentRoutes);

// =============================================
// 404 ERROR HANDLER
// =============================================

// Handle requests to routes that don't exist
app.use((req, res) => {
    res.status(404).render('pages/dashboard', {
        title: 'Page Not Found',
        error: 'The page you are looking for does not exist.'
    });
});

// =============================================
// START SERVER
// =============================================

// Initialize the database, then start the server
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            console.log(`Press Ctrl+C to stop the server`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err.message);
        process.exit(1);
    });

module.exports = app;

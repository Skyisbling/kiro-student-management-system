/**
 * Main JavaScript File
 * Student Database Management System
 * 
 * This file handles all client-side interactions using Vanilla JavaScript
 * and the Fetch API for asynchronous operations.
 */

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Display a Bootstrap alert message
 * @param {string} message - The message to display
 * @param {string} type - Alert type: 'success', 'danger', 'warning', 'info'
 */
function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;

    // Create alert HTML
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="bi bi-${type === 'success' ? 'info-circle' : 'exclamation-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    alertContainer.innerHTML = alertHTML;

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        if (alert) {
            alert.classList.remove('show');
            setTimeout(() => alertContainer.innerHTML = '', 300);
        }
    }, 5000);
}

// =============================================
// ADD STUDENT FORM HANDLER
// =============================================

/**
 * Handle the add student form submission
 * Sends data to server using Fetch API
 */
const addStudentForm = document.getElementById('addStudentForm');

if (addStudentForm) {
    addStudentForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission

        const submitBtn = document.getElementById('submitBtn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Collect form data
        const formData = {
            roll_number: document.getElementById('roll_number').value.trim(),
            name: document.getElementById('name').value.trim(),
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            course: document.getElementById('course').value.trim(),
            email: document.getElementById('email').value.trim()
        };

        // --- Client-side validation ---

        // Check all fields are filled
        if (!formData.roll_number || !formData.name || !formData.age || !formData.gender || !formData.course || !formData.email) {
            showAlert('Please fill in all fields.', 'danger');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            return;
        }

        // Check age is valid
        if (parseInt(formData.age) <= 0) {
            showAlert('Age must be greater than 0.', 'danger');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            return;
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showAlert('Please enter a valid email address.', 'danger');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            return;
        }

        try {
            // Send POST request to server
            const response = await fetch('/students/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showAlert(result.message, 'success');
                addStudentForm.reset();
                // Redirect to students list after 1.5 seconds
                setTimeout(() => {
                    window.location.href = '/students';
                }, 1500);
            } else {
                showAlert(result.message, 'danger');
            }
        } catch (error) {
            console.error('Error adding student:', error);
            showAlert('Something went wrong. Please try again.', 'danger');
        }

        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    });
}

// =============================================
// EDIT STUDENT FORM HANDLER
// =============================================

/**
 * Handle the edit student form submission
 * Sends updated data to server using Fetch API
 */
const editStudentForm = document.getElementById('editStudentForm');

if (editStudentForm) {
    editStudentForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const updateBtn = document.getElementById('updateBtn');
        updateBtn.classList.add('loading');
        updateBtn.disabled = true;

        // Get student ID from the form's data attribute
        const studentId = editStudentForm.getAttribute('data-id');

        // Collect form data
        const formData = {
            roll_number: document.getElementById('roll_number').value.trim(),
            name: document.getElementById('name').value.trim(),
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            course: document.getElementById('course').value.trim(),
            email: document.getElementById('email').value.trim()
        };

        // --- Client-side validation ---

        if (!formData.roll_number || !formData.name || !formData.age || !formData.gender || !formData.course || !formData.email) {
            showAlert('Please fill in all fields.', 'danger');
            updateBtn.classList.remove('loading');
            updateBtn.disabled = false;
            return;
        }

        if (parseInt(formData.age) <= 0) {
            showAlert('Age must be greater than 0.', 'danger');
            updateBtn.classList.remove('loading');
            updateBtn.disabled = false;
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showAlert('Please enter a valid email address.', 'danger');
            updateBtn.classList.remove('loading');
            updateBtn.disabled = false;
            return;
        }

        try {
            // Send POST request to update the student
            const response = await fetch(`/students/edit/${studentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                showAlert(result.message, 'success');
                // Redirect to students list after 1.5 seconds
                setTimeout(() => {
                    window.location.href = '/students';
                }, 1500);
            } else {
                showAlert(result.message, 'danger');
            }
        } catch (error) {
            console.error('Error updating student:', error);
            showAlert('Something went wrong. Please try again.', 'danger');
        }

        updateBtn.classList.remove('loading');
        updateBtn.disabled = false;
    });
}

// =============================================
// DELETE STUDENT HANDLER
// =============================================

/**
 * Handle student deletion with confirmation modal
 * Uses Fetch API to delete asynchronously
 */
let deleteStudentId = null; // Store the ID of student to delete

// Attach click event to all delete buttons
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function () {
        // Get student info from button's data attributes
        deleteStudentId = this.getAttribute('data-id');
        const studentName = this.getAttribute('data-name');

        // Update modal with student name
        document.getElementById('deleteStudentName').textContent = studentName;

        // Show the confirmation modal
        const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
        deleteModal.show();
    });
});

// Handle confirm delete button click
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', async function () {
        if (!deleteStudentId) return;

        try {
            // Send DELETE request to server
            const response = await fetch(`/students/delete/${deleteStudentId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                // Remove the row from the table without page refresh
                const row = document.getElementById(`student-row-${deleteStudentId}`);
                if (row) {
                    row.remove();
                }

                // Close the modal
                const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
                deleteModal.hide();

                // Show success alert
                showAlert(result.message, 'success');

                // Update student count
                updateStudentCount();
            } else {
                showAlert(result.message, 'danger');
            }
        } catch (error) {
            console.error('Error deleting student:', error);
            showAlert('Failed to delete student. Please try again.', 'danger');
        }

        deleteStudentId = null;
    });
}

// =============================================
// SEARCH FUNCTIONALITY
// =============================================

/**
 * Handle student search using Fetch API
 * Updates the table without page reload
 */
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const clearSearchBtn = document.getElementById('clearSearchBtn');

if (searchBtn) {
    // Search button click
    searchBtn.addEventListener('click', performSearch);

    // Search on Enter key press
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Clear search
    clearSearchBtn.addEventListener('click', function () {
        searchInput.value = '';
        performSearch(); // This will return all students when query is empty
    });
}

/**
 * Perform the search and update the table
 */
async function performSearch() {
    const query = searchInput.value.trim();

    try {
        // Send search request to server
        const response = await fetch(`/students/search?query=${encodeURIComponent(query)}`);
        const result = await response.json();

        if (result.success) {
            // Update the table with search results
            updateStudentsTable(result.students);
        } else {
            showAlert(result.message, 'danger');
        }
    } catch (error) {
        console.error('Search error:', error);
        showAlert('Search failed. Please try again.', 'danger');
    }
}

/**
 * Update the students table with new data
 * @param {Array} students - Array of student objects
 */
function updateStudentsTable(students) {
    const tableBody = document.getElementById('studentsTableBody');
    if (!tableBody) return;

    // Clear existing rows
    tableBody.innerHTML = '';

    if (students.length === 0) {
        // Show empty state
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-muted">
                    <i class="bi bi-inbox display-6"></i>
                    <p class="mt-2 mb-0">No students found matching your search.</p>
                </td>
            </tr>
        `;
    } else {
        // Build table rows
        students.forEach(student => {
            const row = `
                <tr id="student-row-${student.id}">
                    <td>${student.id}</td>
                    <td><span class="badge bg-secondary">${student.roll_number}</span></td>
                    <td class="fw-bold">${student.name}</td>
                    <td>${student.age}</td>
                    <td>${student.gender}</td>
                    <td>${student.course}</td>
                    <td>${student.email}</td>
                    <td class="text-center">
                        <a href="/students/edit/${student.id}" class="btn btn-sm btn-warning me-1" title="Edit">
                            <i class="bi bi-pencil-square"></i>
                        </a>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${student.id}" data-name="${student.name}" title="Delete">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // Re-attach delete event listeners to new buttons
        attachDeleteListeners();
    }

    // Update count
    const countEl = document.getElementById('studentCount');
    if (countEl) {
        countEl.textContent = `Total: ${students.length} student(s)`;
    }
}

/**
 * Re-attach delete event listeners after table update
 */
function attachDeleteListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function () {
            deleteStudentId = this.getAttribute('data-id');
            const studentName = this.getAttribute('data-name');
            document.getElementById('deleteStudentName').textContent = studentName;
            const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
            deleteModal.show();
        });
    });
}

/**
 * Update the student count display
 */
function updateStudentCount() {
    const tableBody = document.getElementById('studentsTableBody');
    const countEl = document.getElementById('studentCount');
    if (tableBody && countEl) {
        const rows = tableBody.querySelectorAll('tr[id^="student-row-"]');
        countEl.textContent = `Total: ${rows.length} student(s)`;
    }
}

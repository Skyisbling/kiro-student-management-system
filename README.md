# Student Database Management System

A web application to manage student records using CRUD operations (Create, Read, Update, Delete). Built with Node.js, Express.js, SQLite, EJS, and Bootstrap 5.

---

## Features

- **Add Students** – Register new students with roll number, name, age, gender, course, and email.
- **View Students** – Display all student records in a responsive table.
- **Edit Students** – Update existing student information.
- **Delete Students** – Remove student records with confirmation dialog.
- **Search Students** – Search by name or roll number (asynchronous, no page reload).
- **Dashboard** – Overview with total count, quick actions, and recent students.
- **Responsive Design** – Works on desktop, tablet, and mobile devices.

---

## Folder Structure

```
student-management-system/
├── backend/
│   ├── app.js                    # Express server setup
│   ├── config/
│   │   └── database.js           # Database configuration
│   ├── database/
│   │   └── students.db           # SQLite database (auto-generated)
│   ├── controllers/
│   │   └── studentController.js  # Business logic
│   ├── models/
│   │   └── studentModel.js       # Database operations
│   └── routes/
│       └── studentRoutes.js      # Route definitions
├── frontend/
│   ├── views/
│   │   ├── layout.ejs            # Main layout template
│   │   ├── pages/
│   │   │   ├── dashboard.ejs     # Dashboard page
│   │   │   ├── students.ejs      # View all students
│   │   │   ├── add-student.ejs   # Add student form
│   │   │   ├── edit-student.ejs  # Edit student form
│   │   │   └── about.ejs         # About page
│   │   └── partials/
│   │       ├── navbar.ejs        # Navigation bar
│   │       ├── footer.ejs        # Footer
│   │       └── alerts.ejs        # Alert messages
│   └── assets/
│       ├── css/
│       │   └── style.css         # Custom styles
│       ├── js/
│       │   └── main.js           # Client-side JavaScript
│       └── images/
├── package.json
├── README.md
└── .gitignore
```

---

## Technologies Used

| Technology   | Purpose                        |
|--------------|--------------------------------|
| Node.js      | Server-side JavaScript runtime |
| Express.js   | Web application framework      |
| SQLite3      | Lightweight relational database|
| EJS          | Templating engine              |
| Bootstrap 5  | CSS framework for UI           |
| Vanilla JS   | Client-side interactivity      |
| Fetch API    | Asynchronous HTTP requests     |

---

## Installation Steps

### Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher)
- npm (comes with Node.js)

### Setup

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd student-management-system
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the application:**

   ```bash
   npm start
   ```

   Or for development with auto-restart:

   ```bash
   npm run dev
   ```

4. **Open in browser:**

   ```
   http://localhost:3000
   ```

---

## Running Instructions

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm start`     | Start the server                         |
| `npm run dev`   | Start with nodemon (auto-restart on changes) |

The server runs on **port 3000** by default.

---

## Database Information

- **Database:** SQLite3
- **File:** `backend/database/students.db` (auto-created on first run)
- **Table:** `students`

### Table Schema

| Column      | Type    | Constraints              |
|-------------|---------|--------------------------|
| id          | INTEGER | PRIMARY KEY AUTOINCREMENT|
| roll_number | TEXT    | UNIQUE, NOT NULL         |
| name        | TEXT    | NOT NULL                 |
| age         | INTEGER | NOT NULL                 |
| gender      | TEXT    | NOT NULL                 |
| course      | TEXT    | NOT NULL                 |
| email       | TEXT    | UNIQUE, NOT NULL         |

The database is seeded with 10 sample records automatically if the table is empty.

---

## Screenshots

> _Add screenshots of the application here after running the project._

- Dashboard Page
- View Students Page
- Add Student Form
- Edit Student Form
- Search Results
- Delete Confirmation Modal

---

## Future Improvements

- Add pagination for large student lists
- Export student data to CSV/PDF
- Add sorting by columns
- Implement student profile pictures
- Add course management module
- Include attendance tracking
- Add grade/marks management

---

## License

This project is created for educational purposes as part of a college web development course.

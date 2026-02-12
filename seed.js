const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const { initDb } = require('./database');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, process.env.DB_PATH || './database.sqlite');
const db = new Database(dbPath);

const seed = () => {
    // Ensure tables exist
    initDb();

    // Clear existing data
    db.prepare('DELETE FROM roadmap_steps').run();
    db.prepare('DELETE FROM resources').run();
    db.prepare('DELETE FROM topics').run();
    db.prepare('DELETE FROM subjects').run();
    db.prepare('DELETE FROM users').run();

    // Create Admin and Student
    const adminPass = bcrypt.hashSync('admin123', 10);
    const studentPass = bcrypt.hashSync('student123', 10);

    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Admin User', 'admin@studyhub.com', adminPass, 'admin');
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Nishant Student', 'student@studyhub.com', studentPass, 'student');

    // Create Subjects
    const sub1 = db.prepare('INSERT INTO subjects (name, description, icon, color) VALUES (?, ?, ?, ?)').run(
        'Mathematics', 'Master logic and numbers from Algebra to Calculus.', 'fas fa-calculator', '#6366f1'
    ).lastInsertRowid;

    const sub2 = db.prepare('INSERT INTO subjects (name, description, icon, color) VALUES (?, ?, ?, ?)').run(
        'Computer Science', 'Learn programming, algorithms, and system design.', 'fas fa-code', '#a855f7'
    ).lastInsertRowid;

    // Create Topics for Math
    const t1 = db.prepare('INSERT INTO topics (subject_id, name, description, difficulty, roadmap_order) VALUES (?, ?, ?, ?, ?)').run(
        sub1, 'Algebra Basics', 'Introduction to variables and equations.', 'easy', 1
    ).lastInsertRowid;

    const t2 = db.prepare('INSERT INTO topics (subject_id, name, description, difficulty, roadmap_order) VALUES (?, ?, ?, ?, ?)').run(
        sub1, 'Trigonometry', 'Studying relationships between side lengths and angles of triangles.', 'medium', 2
    ).lastInsertRowid;

    const t3 = db.prepare('INSERT INTO topics (subject_id, name, description, difficulty, roadmap_order) VALUES (?, ?, ?, ?, ?)').run(
        sub1, 'Calculus I', 'Limits, derivatives, and the foundations of continuous change.', 'hard', 3
    ).lastInsertRowid;

    // Create Topics for CS
    const t4 = db.prepare('INSERT INTO topics (subject_id, name, description, difficulty, roadmap_order) VALUES (?, ?, ?, ?, ?)').run(
        sub2, 'Intro to Node.js', 'Building server-side applications with JavaScript.', 'medium', 1
    ).lastInsertRowid;

    const t5 = db.prepare('INSERT INTO topics (subject_id, name, description, difficulty, roadmap_order) VALUES (?, ?, ?, ?, ?)').run(
        sub2, 'Database Design', 'Relational models, SQL, and normalization.', 'medium', 2
    ).lastInsertRowid;

    // Create Resources
    db.prepare('INSERT INTO resources (topic_id, title, url, type) VALUES (?, ?, ?, ?)').run(t4, 'Node.js Documentation', 'https://nodejs.org', 'link');
    db.prepare('INSERT INTO resources (topic_id, title, url, type) VALUES (?, ?, ?, ?)').run(t4, 'Express Guide', 'https://expressjs.com', 'link');

    console.log('Database seeded successfully.');
};

seed();
process.exit();

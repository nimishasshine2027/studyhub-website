const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = path.resolve(__dirname, process.env.DB_PATH || './database.sqlite');
const db = new Database(dbPath, { verbose: console.log });

// Initialize database schema
const initDb = () => {
    // Users table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'student',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();

    // Subjects table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS subjects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            icon TEXT,
            color TEXT
        )
    `).run();

    // Topics table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id INTEGER,
            name TEXT NOT NULL,
            description TEXT,
            difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')),
            roadmap_order INTEGER,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
        )
    `).run();

    // Resources table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id INTEGER,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            type TEXT CHECK(type IN ('video', 'pdf', 'link')),
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
        )
    `).run();

    // Ratings table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS ratings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id INTEGER,
            user_id INTEGER,
            rating INTEGER CHECK(rating BETWEEN 1 AND 5),
            comment TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `).run();

    // Bookmarks table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS bookmarks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            topic_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
            UNIQUE(user_id, topic_id)
        )
    `).run();

    // Study Progress table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS study_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            topic_id INTEGER,
            status TEXT CHECK(status IN ('completed', 'in_progress')) DEFAULT 'in_progress',
            last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
            UNIQUE(user_id, topic_id)
        )
    `).run();

    // Streak Tracker table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS streak_tracker (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE,
            last_visit_date DATE,
            current_streak INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `).run();

    // Roadmap Steps table
    db.prepare(`
        CREATE TABLE IF NOT EXISTS roadmap_steps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject_id INTEGER,
            topic_id INTEGER,
            step_number INTEGER,
            FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
            FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE
        )
    `).run();

    console.log('Database initialized successfully.');
};

module.exports = { db, initDb };

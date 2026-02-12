const { db } = require('../database');

const AdminController = {
    getDashboard: (req, res) => {
        const stats = {
            users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
            subjects: db.prepare('SELECT COUNT(*) as count FROM subjects').get().count,
            topics: db.prepare('SELECT COUNT(*) as count FROM topics').get().count,
            resources: db.prepare('SELECT COUNT(*) as count FROM resources').get().count
        };
        const subjects = db.prepare('SELECT * FROM subjects').all();
        res.render('admin/dashboard', { title: 'Admin Panel', stats, subjects });
    },

    addSubject: (req, res) => {
        const { name, description, icon, color } = req.body;
        db.prepare('INSERT INTO subjects (name, description, icon, color) VALUES (?, ?, ?, ?)').run(name, description, icon, color);
        res.redirect('/admin');
    },

    addTopic: (req, res) => {
        const { subject_id, name, description, difficulty, roadmap_order } = req.body;
        db.prepare('INSERT INTO topics (subject_id, name, description, difficulty, roadmap_order) VALUES (?, ?, ?, ?, ?)')
            .run(subject_id, name, description, difficulty, roadmap_order);
        res.redirect(`/admin/subjects/${subject_id}`);
    },

    addResource: (req, res) => {
        const { topic_id, title, url, type } = req.body;
        db.prepare('INSERT INTO resources (topic_id, title, url, type) VALUES (?, ?, ?, ?)')
            .run(topic_id, title, url, type);
        res.redirect('back');
    },

    deleteSubject: (req, res) => {
        db.prepare('DELETE FROM subjects WHERE id = ?').run(req.params.id);
        res.redirect('/admin');
    }
};

module.exports = AdminController;

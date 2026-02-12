const { db } = require('../database');

const SubjectController = {
    getAllSubjects: (req, res) => {
        const subjects = db.prepare('SELECT * FROM subjects').all();
        res.render('pages/subjects', { title: 'Browse Subjects', subjects });
    },

    getSubjectDetails: (req, res) => {
        const { id } = req.params;
        const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(id);
        if (!subject) return res.status(404).render('pages/error', { message: 'Subject not found' });

        const topics = db.prepare(`
            SELECT t.*, 
            (SELECT status FROM study_progress WHERE user_id = ? AND topic_id = t.id) as status
            FROM topics t 
            WHERE t.subject_id = ? 
            ORDER BY t.roadmap_order ASC
        `).all(req.session.userId || 0, id);

        res.render('pages/subject_details', { title: subject.name, subject, topics });
    }
};

module.exports = SubjectController;

const { db } = require('../database');

const TopicController = {
    getTopicDetails: (req, res) => {
        const { id } = req.params;
        const topic = db.prepare(`
            SELECT t.*, s.name as subject_name 
            FROM topics t 
            JOIN subjects s ON t.subject_id = s.id 
            WHERE t.id = ?
        `).get(id);

        if (!topic) return res.status(404).render('pages/error', { message: 'Topic not found' });

        const resources = db.prepare('SELECT * FROM resources WHERE topic_id = ?').all(id);
        const ratings = db.prepare(`
            SELECT r.*, u.name as user_name 
            FROM ratings r 
            JOIN users u ON r.user_id = u.id 
            WHERE r.topic_id = ?
            ORDER BY r.created_at DESC
        `).all(id);

        const avgRating = db.prepare('SELECT AVG(rating) as average FROM ratings WHERE topic_id = ?').get(id).average || 0;

        const isBookmarked = db.prepare('SELECT 1 FROM bookmarks WHERE user_id = ? AND topic_id = ?').get(req.session.userId || 0, id);

        // Recommendations (same subject, different topic)
        const recommendations = db.prepare('SELECT * FROM topics WHERE subject_id = ? AND id != ? LIMIT 3').all(topic.subject_id, id);

        res.render('pages/topic_details', {
            title: topic.name,
            topic,
            resources,
            ratings,
            avgRating: parseFloat(avgRating).toFixed(1),
            isBookmarked: !!isBookmarked,
            recommendations
        });
    },

    toggleBookmark: (req, res) => {
        if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
        const { id } = req.params;
        const exists = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND topic_id = ?').get(req.session.userId, id);

        if (exists) {
            db.prepare('DELETE FROM bookmarks WHERE id = ?').run(exists.id);
            res.json({ bookmarked: false });
        } else {
            db.prepare('INSERT INTO bookmarks (user_id, topic_id) VALUES (?, ?)').run(req.session.userId, id);
            res.json({ bookmarked: true });
        }
    },

    getRevisionMode: (req, res) => {
        const { id } = req.params;
        const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(id);
        if (!topic) return res.status(404).render('pages/error', { message: 'Topic not found' });

        res.render('pages/revision', { title: `Revision: ${topic.name}`, topic, layout: false });
    },

    markCompleted: (req, res) => {
        if (!req.session.userId) return res.status(401).json({ error: 'Unauthorized' });
        const { id } = req.params;
        const userId = req.session.userId;

        const exists = db.prepare('SELECT id FROM study_progress WHERE user_id = ? AND topic_id = ?').get(userId, id);

        if (exists) {
            db.prepare('UPDATE study_progress SET status = ?, last_accessed = CURRENT_TIMESTAMP WHERE id = ?').run('completed', exists.id);
        } else {
            db.prepare('INSERT INTO study_progress (user_id, topic_id, status) VALUES (?, ?, ?)').run(userId, id, 'completed');
        }

        res.json({ success: true, status: 'completed' });
    }
};

module.exports = TopicController;

const { db } = require('../database');

const StudentController = {
    getDashboard: (req, res) => {
        const userId = req.session.userId;
        if (!userId) return res.redirect('/auth/login');

        const streak = db.prepare('SELECT current_streak FROM streak_tracker WHERE user_id = ?').get(userId) || { current_streak: 0 };

        const bookmarks = db.prepare(`
            SELECT b.*, t.name as topic_name, s.name as subject_name 
            FROM bookmarks b 
            JOIN topics t ON b.topic_id = t.id 
            JOIN subjects s ON t.subject_id = s.id 
            WHERE b.user_id = ?
            LIMIT 5
        `).all(userId);

        const recentTopics = db.prepare(`
            SELECT sp.*, t.name as topic_name, s.name as subject_name 
            FROM study_progress sp 
            JOIN topics t ON sp.topic_id = t.id 
            JOIN subjects s ON t.subject_id = s.id 
            WHERE sp.user_id = ? 
            ORDER BY sp.last_accessed DESC 
            LIMIT 5
        `).all(userId);

        const totalTopics = db.prepare('SELECT COUNT(*) as count FROM topics').get().count;
        const completedTopics = db.prepare('SELECT COUNT(*) as count FROM study_progress WHERE user_id = ? AND status = "completed"').get(userId).count;
        const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

        res.render('pages/dashboard', {
            title: 'Student Dashboard',
            streak: streak.current_streak,
            bookmarks,
            recentTopics,
            progressPercent
        });
    },

    updateStreak: (userId) => {
        const today = new Date().toISOString().split('T')[0];
        const tracker = db.prepare('SELECT * FROM streak_tracker WHERE user_id = ?').get(userId);

        if (!tracker) {
            db.prepare('INSERT INTO streak_tracker (user_id, last_visit_date, current_streak) VALUES (?, ?, ?)').run(userId, today, 1);
        } else if (tracker.last_visit_date !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (tracker.last_visit_date === yesterdayStr) {
                db.prepare('UPDATE streak_tracker SET current_streak = current_streak + 1, last_visit_date = ? WHERE user_id = ?').run(today, userId);
            } else {
                db.prepare('UPDATE streak_tracker SET current_streak = 1, last_visit_date = ? WHERE user_id = ?').run(today, userId);
            }
        }
    }
};

module.exports = StudentController;

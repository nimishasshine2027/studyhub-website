const bcrypt = require('bcryptjs');
const { db } = require('../database');
const StudentController = require('./studentController');

const AuthController = {
    getLogin: (req, res) => {
        if (req.session.userId) return res.redirect('/dashboard');
        res.render('pages/login', { title: 'Login' });
    },

    postLogin: (req, res) => {
        const { email, password } = req.body;
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.userId = user.id;
            req.session.role = user.role;
            req.session.user = { id: user.id, name: user.name, role: user.role };
            StudentController.updateStreak(user.id);
            return res.redirect('/dashboard');
        }

        res.render('pages/login', { title: 'Login', error: 'Invalid credentials' });
    },

    getRegister: (req, res) => {
        if (req.session.userId) return res.redirect('/dashboard');
        res.render('pages/register', { title: 'Register' });
    },

    postRegister: (req, res) => {
        const { name, email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);

        try {
            const info = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashedPassword);
            req.session.userId = info.lastInsertRowid;
            req.session.role = 'student';
            req.session.user = { id: info.lastInsertRowid, name, role: 'student' };
            res.redirect('/dashboard');
        } catch (error) {
            res.render('pages/register', { title: 'Register', error: 'Email already exists' });
        }
    },

    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
};

module.exports = AuthController;

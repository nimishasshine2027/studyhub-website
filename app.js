const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
const dotenv = require('dotenv');
const { initDb } = require('./database');

// Load environment variables
dotenv.config();

// Initialize Database
initDb();

const app = express();
const PORT = process.env.PORT || 3000;

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'studyhub_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Global Locals Middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.theme = req.session.theme || 'light';
    res.locals.path = req.path;
    next();
});

// Routes
const authRoutes = require('./routes/authRoutes');
const studyRoutes = require('./routes/studyRoutes');
const studentRoutes = require('./routes/studentRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/auth', authRoutes);
app.use('/study', studyRoutes);
app.use('/', studentRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => res.render('pages/index', { title: 'Welcome to Study Hub' }));
app.get('/health', (req, res) => res.json({ status: 'UP', timestamp: new Date().toISOString() }));

app.post('/theme', (req, res) => {
    req.session.theme = req.body.theme;
    req.session.save(() => {
        res.sendStatus(200);
    });
});

// Error Handling
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('pages/error', {
        title: 'Error',
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Study Hub Server running at http://localhost:${PORT}`);
});

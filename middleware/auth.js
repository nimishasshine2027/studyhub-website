module.exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    res.redirect('/auth/login');
};

module.exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.role === 'admin') {
        return next();
    }
    res.status(403).render('pages/error', {
        message: 'Access Denied: Admins Only',
        error: { status: 403 }
    });
};

module.exports.localUser = (req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
};

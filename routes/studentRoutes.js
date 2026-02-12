const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/dashboard', isAuthenticated, StudentController.getDashboard);

module.exports = router;

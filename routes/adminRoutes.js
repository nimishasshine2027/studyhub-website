const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.use(isAuthenticated, isAdmin);

router.get('/', AdminController.getDashboard);
router.post('/subjects', AdminController.addSubject);
router.post('/topics', AdminController.addTopic);
router.post('/resources', AdminController.addResource);
router.delete('/subjects/:id', AdminController.deleteSubject);

module.exports = router;

const express = require('express');
const router = express.Router();
const SubjectController = require('../controllers/subjectController');
const TopicController = require('../controllers/topicController');

router.get('/subjects', SubjectController.getAllSubjects);
router.get('/subjects/:id', SubjectController.getSubjectDetails);
router.get('/topics/:id', TopicController.getTopicDetails);
router.post('/topics/:id/bookmark', TopicController.toggleBookmark);
router.post('/topics/:id/complete', TopicController.markCompleted);
router.get('/topics/:id/revision', TopicController.getRevisionMode);

module.exports = router;

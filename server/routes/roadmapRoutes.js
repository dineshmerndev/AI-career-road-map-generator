const express = require('express');
const { generateRoadmap, getRoadmaps, getRoadmapById, updateProgress } = require('../controllers/roadmapController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/generate', auth, generateRoadmap);
router.get('/', auth, getRoadmaps);
router.get('/:id', auth, getRoadmapById);
router.patch('/progress', auth, updateProgress);

module.exports = router;

const express = require('express');
const rankingController = require('../controllers/rankingController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', rankingController.obtener);
router.post('/', auth, rankingController.upsert);

module.exports = router;

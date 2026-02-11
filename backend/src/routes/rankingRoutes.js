const express = require('express');
const rankingController = require('../controllers/rankingController');

const router = express.Router();

router.get('/', rankingController.obtener);
router.post('/', rankingController.upsert);

module.exports = router;

const express = require('express');
const rachasController = require('../controllers/rachasController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/usuario/:usuarioId', auth, rachasController.resumenUsuario);

module.exports = router;


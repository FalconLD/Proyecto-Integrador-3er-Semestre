const express = require('express');
const rachasController = require('../controllers/rachasController');

const router = express.Router();

router.get('/usuario/:usuarioId', rachasController.resumenUsuario);

module.exports = router;


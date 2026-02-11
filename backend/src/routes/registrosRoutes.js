const express = require('express');
const registrosController = require('../controllers/registrosController');

const router = express.Router();

router.get('/usuario/:usuarioId', registrosController.obtenerPorUsuario);
router.get('/usuario/:usuarioId/semanales', registrosController.obtenerSemanales);
router.post('/', registrosController.crear);
router.delete('/:id', registrosController.eliminar);

module.exports = router;

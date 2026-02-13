const express = require('express');
const { auth } = require('../middleware/auth');
const registrosController = require('../controllers/registrosController');

const router = express.Router();

// Todas las rutas de registros requieren autenticación (Segmento 1)
router.get('/usuario/:usuarioId', auth, registrosController.obtenerPorUsuario);
router.get('/usuario/:usuarioId/semanales', auth, registrosController.obtenerSemanales);
router.post('/', auth, registrosController.crear);
router.delete('/:id', auth, registrosController.eliminar);

module.exports = router;

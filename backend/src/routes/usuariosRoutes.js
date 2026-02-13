const express = require('express');
const { auth } = require('../middleware/auth');
const usuariosController = require('../controllers/usuariosController');

const router = express.Router();

// Todas las rutas de usuarios requieren autenticación (Segmento 1)
router.get('/', auth, usuariosController.obtenerTodos);
router.get('/email/:email', auth, usuariosController.obtenerPorEmail);
router.get('/:id', auth, usuariosController.obtenerPorId);
router.post('/', auth, usuariosController.crear);
router.put('/:id', auth, usuariosController.actualizar);
router.delete('/:id', auth, usuariosController.eliminar);

module.exports = router;

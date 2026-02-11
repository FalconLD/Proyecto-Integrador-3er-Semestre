const express = require('express');
const usuariosController = require('../controllers/usuariosController');

const router = express.Router();

router.get('/', usuariosController.obtenerTodos);
router.get('/email/:email', usuariosController.obtenerPorEmail);
router.get('/:id', usuariosController.obtenerPorId);
router.post('/', usuariosController.crear);
router.put('/:id', usuariosController.actualizar);
router.delete('/:id', usuariosController.eliminar);

module.exports = router;

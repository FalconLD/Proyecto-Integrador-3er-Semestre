const express = require('express');
const adminController = require('../controllers/adminController');
const { auth } = require('../middleware/auth');
const { tieneAlgunPermiso } = require('../middleware/permisos');

const panelAdmin = tieneAlgunPermiso('ver_panel_admin', 'ver_estadisticas_avanzadas');
const gestionarUsuarios = tieneAlgunPermiso('ver_panel_admin', 'gestionar_usuarios');
const asignarPermisosMid = tieneAlgunPermiso('ver_panel_admin', 'asignar_permisos');

const router = express.Router();

router.get('/summary', auth, panelAdmin, adminController.resumen);
router.get('/usuarios', auth, gestionarUsuarios, adminController.listarUsuarios);
router.patch('/usuarios/:id/role', auth, gestionarUsuarios, adminController.cambiarRol);
router.patch('/usuarios/:id/permisos', auth, asignarPermisosMid, adminController.asignarPermisos);
router.get('/session-logs', auth, panelAdmin, adminController.sessionLogs);

module.exports = router;


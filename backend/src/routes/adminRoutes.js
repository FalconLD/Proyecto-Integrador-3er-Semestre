const express = require('express');
const adminController = require('../controllers/adminController');
const permisosCatalogoController = require('../controllers/permisosCatalogoController');
const rolesController = require('../controllers/rolesController');
const { auth } = require('../middleware/auth');
const { tieneAlgunPermiso } = require('../middleware/permisos');
const { PERMISOS } = require('../config/permisos');

const panelAdmin = tieneAlgunPermiso(PERMISOS.ADMIN_VER_PANEL, PERMISOS.ADMIN_VER_ESTADISTICAS, 'ver_panel_admin', 'ver_estadisticas_avanzadas');
const gestionarUsuarios = tieneAlgunPermiso(PERMISOS.ADMIN_VER_PANEL, PERMISOS.USUARIOS_LISTAR, PERMISOS.USUARIOS_EDITAR_ROL, 'ver_panel_admin', 'gestionar_usuarios');
const asignarPermisosMid = tieneAlgunPermiso(PERMISOS.ADMIN_VER_PANEL, PERMISOS.USUARIOS_ASIGNAR_PERMISOS, 'ver_panel_admin', 'asignar_permisos');

const router = express.Router();

router.get('/summary', auth, panelAdmin, adminController.resumen);
router.get('/usuarios', auth, gestionarUsuarios, adminController.listarUsuarios);
router.patch('/usuarios/:id/role', auth, gestionarUsuarios, adminController.cambiarRol);
router.patch('/usuarios/:id/permisos', auth, asignarPermisosMid, adminController.asignarPermisos);
router.get('/session-logs', auth, panelAdmin, adminController.sessionLogs);

router.get('/permisos-catalogo', auth, panelAdmin, permisosCatalogoController.listar);
router.post('/permisos-catalogo', auth, asignarPermisosMid, permisosCatalogoController.crear);
router.put('/permisos-catalogo/:id', auth, asignarPermisosMid, permisosCatalogoController.actualizar);
router.delete('/permisos-catalogo/:id', auth, asignarPermisosMid, permisosCatalogoController.eliminar);

router.get('/roles', auth, panelAdmin, rolesController.listar);
router.post('/roles', auth, gestionarUsuarios, rolesController.crear);
router.put('/roles/:id', auth, gestionarUsuarios, rolesController.actualizar);
router.delete('/roles/:id', auth, gestionarUsuarios, rolesController.eliminar);

module.exports = router;


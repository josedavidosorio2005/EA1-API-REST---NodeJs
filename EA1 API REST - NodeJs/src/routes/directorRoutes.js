const express = require('express');
const router = express.Router();
const directorController = require('../controllers/directorController');
const { validarDirector } = require('../middleware/validadores');

// Rutas para directores
router.get('/activos',  directorController.obtenerDirectoresActivos); // directores activos (para formulario de media)
router.get('/',         directorController.obtenerDirectores);
router.get('/:id',      directorController.obtenerDirectorPorId);
router.post('/',        validarDirector, directorController.crearDirector);
router.put('/:id',      directorController.actualizarDirector);
router.delete('/:id',  directorController.eliminarDirector);

module.exports = router;

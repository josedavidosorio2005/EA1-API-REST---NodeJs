const express = require('express');
const router = express.Router();
const generoController = require('../controllers/generoController');
const { validarGenero } = require('../middleware/validadores');

// Rutas para géneros
router.get('/activos',   generoController.obtenerGenerosActivos); // géneros activos (para formulario de media)
router.get('/',          generoController.obtenerGeneros);
router.get('/:id',       generoController.obtenerGeneroPorId);
router.post('/',         validarGenero, generoController.crearGenero);
router.put('/:id',       generoController.actualizarGenero);
router.delete('/:id',   generoController.eliminarGenero);

module.exports = router;

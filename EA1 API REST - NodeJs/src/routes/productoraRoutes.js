const express = require('express');
const router = express.Router();
const productoraController = require('../controllers/productoraController');
const { validarProductora } = require('../middleware/validadores');

// Rutas para productoras
router.get('/activas',   productoraController.obtenerProductorasActivas); // productoras activas (para formulario de media)
router.get('/',          productoraController.obtenerProductoras);
router.get('/:id',       productoraController.obtenerProductoraPorId);
router.post('/',         validarProductora, productoraController.crearProductora);
router.put('/:id',       productoraController.actualizarProductora);
router.delete('/:id',   productoraController.eliminarProductora);

module.exports = router;

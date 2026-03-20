const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const { validarMedia } = require('../middleware/validadores');

// Rutas de filtrado (deben ir primero para evitar conflicto con :id)
router.get('/filtro/tipo/:tipoId', mediaController.obtenerMediaPorTipo);
router.get('/filtro/genero/:generoId', mediaController.obtenerMediaPorGenero);

// Rutas para media (películas y series)
router.get('/', mediaController.obtenerMedia);
router.get('/:id', mediaController.obtenerMediaPorId);
router.post('/', validarMedia, mediaController.crearMedia);
router.put('/:id', mediaController.actualizarMedia);
router.delete('/:id', mediaController.eliminarMedia);

module.exports = router;

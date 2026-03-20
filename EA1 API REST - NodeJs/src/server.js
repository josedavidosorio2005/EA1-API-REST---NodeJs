require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { createTables } = require('./config/init-db');

// Rutas
const generoRoutes = require('./routes/generoRoutes');
const directorRoutes = require('./routes/directorRoutes');
const productoraRoutes = require('./routes/productoraRoutes');
const tipoRoutes = require('./routes/tipoRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../public')));

// Inicializar base de datos
createTables();

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas de la API
app.use('/api/generos',     generoRoutes);
app.use('/api/directores',  directorRoutes);
app.use('/api/productoras', productoraRoutes);
app.use('/api/tipos',       tipoRoutes);
app.use('/api/media',       mediaRoutes);

// Ruta de información de la API
app.get('/api', (req, res) => {
  res.json({
    mensaje: 'API REST de Películas y Series - IU Digital de Antioquia',
    version: '1.0.0',
    endpoints: {
      generos:    { todos: '/api/generos',           activos: '/api/generos/activos' },
      directores: { todos: '/api/directores',        activos: '/api/directores/activos' },
      productoras:{ todos: '/api/productoras',       activas: '/api/productoras/activas' },
      tipos:      { todos: '/api/tipos' },
      media:      {
        todos:      '/api/media',
        porTipo:   '/api/media/filtro/tipo/:tipoId',
        porGenero: '/api/media/filtro/genero/:generoId'
      }
    }
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

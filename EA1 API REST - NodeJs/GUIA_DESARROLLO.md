# Guía de Desarrollo - API REST Películas y Series

## Introducción para Desarrolladores

Este documento proporciona orientación para desarrolladores que trabajan con esta API REST.

## Convenciones de Código

### Estructura de Carpetas

```
src/
├── config/          # Configuración (BD, inicialización)
├── controllers/     # Lógica de negocio
├── middleware/      # Funciones middleware
├── models/          # Modelos de datos (futuro)
├── routes/          # Definición de rutas
└── server.js        # Punto de entrada
```

### Nomenclatura

- **Archivos de controladores**: `{entidad}Controller.js` (ej: `generoController.js`)
- **Archivos de rutas**: `{entidad}Routes.js` (ej: `generoRoutes.js`)
- **Funciones**: camelCase (ej: `obtenerGeneros`, `crearGenero`)
- **Constantes**: UPPER_CASE (ej: `DB_PATH`)
- **Clases**: PascalCase (ej: `GeneroController`)

## Cómo Agregar un Nuevo Módulo

### Paso 1: Crear Tabla en Base de Datos

Edita `src/config/init-db.js`:

```javascript
db.run(`
  CREATE TABLE IF NOT EXISTS nuevaTabla (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
```

### Paso 2: Crear Controlador

Crea `src/controllers/nuevaController.js`:

```javascript
const db = require('../config/database');

exports.obtenerTodos = (req, res) => {
  db.all('SELECT * FROM nuevaTabla', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};

exports.crear = (req, res) => {
  const { nombre } = req.body;
  
  if (!nombre) {
    res.status(400).json({ error: 'Nombre es requerido' });
    return;
  }
  
  db.run(
    'INSERT INTO nuevaTabla (nombre) VALUES (?)',
    [nombre],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, nombre });
    }
  );
};

// Agregar más métodos (obtenerPorId, actualizar, eliminar)
```

### Paso 3: Crear Rutas

Crea `src/routes/nuevaRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const nuevaController = require('../controllers/nuevaController');

router.get('/', nuevaController.obtenerTodos);
router.post('/', nuevaController.crear);

module.exports = router;
```

### Paso 4: Registrar Rutas en server.js

En `src/server.js`, agrega:

```javascript
const nuevaRoutes = require('./routes/nuevaRoutes');

app.use('/api/nueva', nuevaRoutes);
```

## Patrones Comunes

### Obtener Todos los Registros

```javascript
exports.obtenerTodos = (req, res) => {
  db.all('SELECT * FROM tabla ORDER BY campo ASC', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
};
```

### Obtener por ID

```javascript
exports.obtenerPorId = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM tabla WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'No encontrado' });
      return;
    }
    res.json(row);
  });
};
```

### Crear Registro

```javascript
exports.crear = (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    res.status(400).json({ error: 'Nombre requerido' });
    return;
  }

  db.run(
    'INSERT INTO tabla (nombre) VALUES (?)',
    [nombre],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, nombre });
    }
  );
};
```

### Actualizar Registro

```javascript
exports.actualizar = (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;

  db.run(
    'UPDATE tabla SET nombre = ? WHERE id = ?',
    [nombre, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'No encontrado' });
        return;
      }
      res.json({ id, nombre });
    }
  );
};
```

### Eliminar Registro

```javascript
exports.eliminar = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tabla WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'No encontrado' });
      return;
    }
    res.json({ mensaje: 'Eliminado correctamente' });
  });
};
```

## Manejo de Errores

### Códigos de Estado Comunes

| Código | Cuándo usar |
|--------|------------|
| 200 | Solicitud exitosa (GET, PUT) |
| 201 | Recurso creado (POST) |
| 400 | Solicitud inválida |
| 404 | Recurso no encontrado |
| 500 | Error del servidor |

### Estructura de Error Consistente

```javascript
res.status(400).json({ 
  error: 'Descripción clara del error' 
});
```

## Validación de Entrada

### Crear Validador

En `src/middleware/validadores.js`:

```javascript
const validarNueva = (req, res, next) => {
  const { nombre, email } = req.body;
  
  if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
    return res.status(400).json({ error: 'Nombre inválido' });
  }
  
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }
  
  next();
};

module.exports = { validarNueva };
```

### Usar Validador

```javascript
router.post('/', validarNueva, nuevaController.crear);
```

## Testing

### Pruebas Manuales con cURL

```bash
# GET
curl http://localhost:3000/api/generos

# POST
curl -X POST http://localhost:3000/api/generos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Drama"}'

# PUT
curl -X PUT http://localhost:3000/api/generos/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Drama 2"}'

# DELETE
curl -X DELETE http://localhost:3000/api/generos/1
```

### Pruebas con Postman

Importar `postman_collection.json` y ejecutar solicitudes.

## Debugging

### Habilitar Logs Detallados

En `src/server.js`:

```javascript
// Middleware de logging détallado
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});
```

### Console.log Temporal

```javascript
console.log('Debug:', { variable, otroValor });
```

## Mejoras Sugeridas

### Corto Plazo
- [ ] Agregar campo `updatedAt` a todas las tablas
- [ ] Implementar soft delete
- [ ] Agregar más validaciones
- [ ] Crear seeds más completos

### Mediano Plazo
- [ ] Agregar autenticación JWT
- [ ] Implementar rate limiting
- [ ] Agregar paginación
- [ ] Documuentación Swagger
- [ ] Tests unitarios

### Largo Plazo
- [ ] Migrar a TypeScript
- [ ] Implementar ORM (Sequelize, TypeORM)
- [ ] Microservicios
- [ ] Docker

## Recursos Útiles

- [Documentación Express.js](https://expressjs.com/es/)
- [SQLite3 npm](https://www.npmjs.com/package/sqlite3)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc7231.html#status.codes)

## Contribuir

1. Crear rama: `git checkout -b feature/nombre-feature`
2. Hacer cambios y commits
3. Push a la rama: `git push origin feature/nombre-feature`
4. Crear Pull Request

## Licencia

ISC

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026

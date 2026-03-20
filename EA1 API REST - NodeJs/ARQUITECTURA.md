# Documentación de Arquitectura - API REST Películas y Series

## Descripción General

Esta API REST implementa un patrón de arquitectura por capas (Layered Architecture) con la siguiente estructura:

```
┌─────────────────────────────────────┐
│    Cliente HTTP (Postman, cURL)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Express.js (Servidor HTTP)     │
│         - CORS                      │
│         - Body-Parser               │
│         - Logging                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Capa de Rutas               │
│  (generoRoutes, directorRoutes...)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Capa de Middlewares               │
│    (Validadores)                    │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Capa de Controladores             │
│  (generoController, etc.)           │
│  - Lógica de negocio                │
│  - Respuestas HTTP                  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Capa de Base de Datos             │
│    (SQLite3)                        │
│    - Tablas relacion                │
│    - Queries                        │
└─────────────────────────────────────┘
```

## Flujo de una Solicitud

1. **Cliente envía solicitud HTTP**
   - Método: GET, POST, PUT, DELETE
   - Endpoint: /api/generos, /api/media, etc.
   - Body (si aplica): JSON

2. **Express recibe la solicitud**
   - Aplica middlewares globales (CORS, Body-Parser)
   - Registra la solicitud

3. **Enrutador (Router)**
   - Identifica la ruta correspondiente
   - Aplica middlewares específicos (Validadores)

4. **Controlador (Controller)**
   - Procesa la lógica de negocio
   - Construye queries SQL
   - Interactúa con la BD

5. **Base de Datos**
   - Ejecuta operaciones (SELECT, INSERT, UPDATE, DELETE)
   - Retorna resultados

6. **Respuesta HTTP**
   - Controlador construye JSON de respuesta
   - Envía código de estado HTTP
   - Cliente recibe respuesta

## Diagrama de Base de Datos

```
┌─────────────────────┐         ┌──────────────────────┐
│     GENEROS         │         │    TIPOS             │
├─────────────────────┤         ├──────────────────────┤
│ id (PK)             │         │ id (PK)              │
│ nombre (UNIQUE)     │         │ nombre (UNIQUE)      │
│ descripcion         │         │ descripcion          │
│ createdAt           │         │ createdAt            │
└──────────┬──────────┘         └──────────┬───────────┘
           │                               │
           │ genero_id                     │ tipo_id
           │                               │
           └───────────────┬───────────────┘
                           │
                    ┌──────▼──────────┐
                    │    MEDIA        │
                    ├─────────────────┤
                    │ id (PK)         │
                    │ titulo          │
                    │ descripcion     │
                    │ año             │
                    │ duracion        │
                    │ puntuacion      │
                    │ tipo_id (FK)    │
                    │ genero_id (FK)  │
                    │ director_id(FK) │
                    │ productora_id(FK)
                    │ cartel          │
                    │ fecha_lanz.     │
                    │ createdAt       │
                    │ updatedAt       │
                    └──────┬──────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
       director_id                    productora_id
           │                               │
     ┌─────▼──────────────┐    ┌──────────▼────────┐
     │   DIRECTORES       │    │  PRODUCTORAS     │
     ├────────────────────┤    ├──────────────────┤
     │ id (PK)            │    │ id (PK)          │
     │ nombre             │    │ nombre (UNIQUE)  │
     │ apellido           │    │ pais             │
     │ email (UNIQUE)     │    │ email            │
     │ telefono           │    │ telefono         │
     │ pais               │    │ website          │
     │ createdAt          │    │ createdAt        │
     └────────────────────┘    └──────────────────┘
```

## Relaciones de Base de Datos

### Relación Media - Géneros
- **Tipo**: Many-to-One
- **Descripción**: Muchas películas/series pueden tener un género
- **Foreign Key**: media.genero_id → generos.id

### Relación Media - Tipos
- **Tipo**: Many-to-One
- **Descripción**: Muchas películas pueden ser del mismo tipo
- **Foreign Key**: media.tipo_id → tipos.id

### Relación Media - Directores
- **Tipo**: Many-to-One
- **Descripción**: Muchas películas pueden ser dirigidas por un director
- **Foreign Key**: media.director_id → directores.id

### Relación Media - Productoras
- **Tipo**: Many-to-One
- **Descripción**: Muchas películas pueden ser producidas por la misma productora
- **Foreign Key**: media.productora_id → productoras.id

## Componentes Principales

### 1. **Rutas (routes/)**
Definen los endpoints y asocian con controladores.

```javascript
router.get('/generos', generoController.obtenerGeneros);
router.post('/generos', validarGenero, generoController.crearGenero);
```

### 2. **Controladores (controllers/)**
Contienen la lógica de negocio y interactúan con la BD.

```javascript
exports.obtenerGeneros = (req, res) => {
  db.all('SELECT * FROM generos', [], (err, rows) => {
    // Manejo de respuesta
  });
};
```

### 3. **Middlewares (middleware/)**
Procesan solicitudes antes de que lleguen al controlador.

```javascript
const validarGenero = (req, res, next) => {
  // Validaciones
  next(); // Continúa al siguiente middleware
};
```

### 4. **Configuración (config/)**
Maneja conexión a BD y inicialización.

```javascript
const db = new sqlite3.Database(dbPath);
```

## Códigos de Estado HTTP

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| 200 | OK | GET exitoso |
| 201 | Created | POST exitoso |
| 400 | Bad Request | Datos inválidos |
| 404 | Not Found | Recurso no existe |
| 500 | Server Error | Error de BD |

## Flujo de Creación de Género (Ejemplo)

```
POST /api/generos
Body: {"nombre": "Drama", "descripcion": "Películas dramáticas"}
       ▼
┌─────────────────────┐
│ Validador           │ ← Verifica que nombre no sea vacío
└──────────┬──────────┘
           ▼
┌─────────────────────────────────────────┐
│ generoController.crearGenero()          │
│ INSERT INTO generos (nombre, descripcion)
│ VALUES (?, ?)
└──────────┬──────────────────────────────┘
           ▼
┌─────────────────────┐
│ SQLite Database     │
└──────────┬──────────┘
           ▼
┌────────────────────────────────────┐
│ Response 201                       │
│ {"id": 1, "nombre": "Drama", ...}  │
└────────────────────────────────────┘
```

## Escalabilidad y Mejoras Futuras

### Corto Plazo
- Agregar autenticación JWT
- Implementar paginación
- Agregar búsqueda avanzada
- Tests automatizados
- Documentación Swagger

### Mediano Plazo
- Sistema de caché (Redis)
- Logging centralizado
- Monitoreo de performance
- Rate limiting
- GraphQL como alternativa

### Largo Plazo
- Microservicios
- Base de datos NoSQL
- Deployment en contenedores (Docker)
- CI/CD pipeline
- Replicación y alta disponibilidad

## Variables de Entorno

```ini
PORT=3000                    # Puerto del servidor
NODE_ENV=development         # Entorno (development/production)
DB_PATH=./database/peliculas.db  # Ruta de BD
```

## Seguridad

### Implementadas
- CORS habilitado
- Validación de entrada
- Claves foráneas en BD

### Recomendadas
- Autenticación (JWT)
- Encriptación de contraseñas
- Rate limiting
- Sanitización de entrada
- HTTPS en producción

---

**Versión**: 1.0.0  
**Fecha**: Febrero 2026

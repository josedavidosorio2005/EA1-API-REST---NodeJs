# API REST de Películas y Series

## Descripción

API REST desarrollada con Node.js y Express para gestionar películas y series. Esta aplicación permite realizar operaciones CRUD (Create, Read, Update, Delete) sobre diferentes módulos: Géneros, Directores, Productoras, Tipos y Media (Películas y Series).

## Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript del lado del servidor
- **Express.js**: Framework web para Node.js
- **SQLite3**: Base de datos relacional
- **Body-Parser**: Middleware para parsear JSON
- **CORS**: Middleware para compartir recursos entre orígenes
- **Dotenv**: Manejo de variables de entorno

## Estructura del Proyecto

```
EA1 API REST - NodeJs/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de conexión a BD
│   │   └── init-db.js           # Inicialización de tablas
│   ├── controllers/
│   │   ├── generoController.js
│   │   ├── directorController.js
│   │   ├── productoraController.js
│   │   ├── tipoController.js
│   │   └── mediaController.js
│   ├── routes/
│   │   ├── generoRoutes.js
│   │   ├── directorRoutes.js
│   │   ├── productoraRoutes.js
│   │   ├── tipoRoutes.js
│   │   └── mediaRoutes.js
│   ├── middleware/
│   └── server.js                # Archivo principal
├── database/
│   └── peliculas.db            # Base de datos SQLite
├── package.json
├── .env
└── .gitignore
```

## Instalación

1. **Clonar o descargar el proyecto**
   ```bash
   cd "EA1 API REST - NodeJs"
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Crear archivo .env** (ya incluido con valores por defecto)
   ```
   PORT=3000
   NODE_ENV=development
   DB_PATH=./database/peliculas.db
   ```

4. **Ejecutar el servidor**
   ```bash
   npm start
   ```
   O para modo desarrollo con nodemon:
   ```bash
   npm run dev
   ```

## Base de Datos

La aplicación utiliza SQLite3 con las siguientes tablas:

### 1. **generos**
- `id` (INTEGER, PRIMARY KEY)
- `nombre` (TEXT, UNIQUE)
- `descripcion` (TEXT)
- `createdAt` (DATETIME)

### 2. **directores**
- `id` (INTEGER, PRIMARY KEY)
- `nombre` (TEXT)
- `apellido` (TEXT)
- `email` (TEXT, UNIQUE)
- `telefono` (TEXT)
- `pais` (TEXT)
- `createdAt` (DATETIME)

### 3. **productoras**
- `id` (INTEGER, PRIMARY KEY)
- `nombre` (TEXT, UNIQUE)
- `pais` (TEXT)
- `email` (TEXT)
- `telefono` (TEXT)
- `website` (TEXT)
- `createdAt` (DATETIME)

### 4. **tipos**
- `id` (INTEGER, PRIMARY KEY)
- `nombre` (TEXT, UNIQUE)
- `descripcion` (TEXT)
- `createdAt` (DATETIME)

### 5. **media**
- `id` (INTEGER, PRIMARY KEY)
- `titulo` (TEXT)
- `descripcion` (TEXT)
- `año` (INTEGER)
- `duracion` (INTEGER)
- `puntuacion` (REAL)
- `tipo_id` (FOREIGN KEY → tipos)
- `director_id` (FOREIGN KEY → directores)
- `productora_id` (FOREIGN KEY → productoras)
- `genero_id` (FOREIGN KEY → generos)
- `cartel` (TEXT)
- `fecha_lanzamiento` (DATE)
- `createdAt` (DATETIME)
- `updatedAt` (DATETIME)

## Endpoints de la API

### Base URL
```
http://localhost:3000/api
```

### Géneros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/generos` | Obtener todos los géneros |
| GET | `/generos/:id` | Obtener un género por ID |
| POST | `/generos` | Crear un nuevo género |
| PUT | `/generos/:id` | Actualizar un género |
| DELETE | `/generos/:id` | Eliminar un género |

**Ejemplo POST /generos:**
```json
{
  "nombre": "Acción",
  "descripcion": "Películas de aventura y acción"
}
```

### Directores

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/directores` | Obtener todos los directores |
| GET | `/directores/:id` | Obtener un director por ID |
| POST | `/directores` | Crear un nuevo director |
| PUT | `/directores/:id` | Actualizar un director |
| DELETE | `/directores/:id` | Eliminar un director |

**Ejemplo POST /directores:**
```json
{
  "nombre": "Steven",
  "apellido": "Spielberg",
  "email": "steven@example.com",
  "telefono": "+1-555-0100",
  "pais": "Estados Unidos"
}
```

### Productoras

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/productoras` | Obtener todas las productoras |
| GET | `/productoras/:id` | Obtener una productora por ID |
| POST | `/productoras` | Crear una nueva productora |
| PUT | `/productoras/:id` | Actualizar una productora |
| DELETE | `/productoras/:id` | Eliminar una productora |

**Ejemplo POST /productoras:**
```json
{
  "nombre": "Universal Pictures",
  "pais": "Estados Unidos",
  "email": "info@universal.com",
  "telefono": "+1-555-0200",
  "website": "www.universalstudios.com"
}
```

### Tipos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/tipos` | Obtener todos los tipos |
| GET | `/tipos/:id` | Obtener un tipo por ID |
| POST | `/tipos` | Crear un nuevo tipo |
| PUT | `/tipos/:id` | Actualizar un tipo |
| DELETE | `/tipos/:id` | Eliminar un tipo |

**Ejemplo POST /tipos:**
```json
{
  "nombre": "Película",
  "descripcion": "Largometraje de cine"
}
```

### Media (Películas y Series)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/media` | Obtener todos los media |
| GET | `/media/:id` | Obtener un media por ID |
| POST | `/media` | Crear un nuevo media |
| PUT | `/media/:id` | Actualizar un media |
| DELETE | `/media/:id` | Eliminar un media |
| GET | `/media/filtro/tipo/:tipoId` | Obtener media por tipo |
| GET | `/media/filtro/genero/:generoId` | Obtener media por género |

**Ejemplo POST /media:**
```json
{
  "titulo": "Jurassic Park",
  "descripcion": "Una aventura en un parque con dinosaurios",
  "año": 1993,
  "duracion": 127,
  "puntuacion": 8.1,
  "tipo_id": 1,
  "director_id": 1,
  "productora_id": 1,
  "genero_id": 1,
  "cartel": "jurassic-park.jpg",
  "fecha_lanzamiento": "1993-06-11"
}
```

## Pruebas con Postman

1. **Descargar Postman** desde [postman.com](https://www.postman.com/)

2. **Crear una nueva colección** para organizar las pruebas

3. **Importar o crear requests** de prueba

### Ejemplo de Prueba - Crear un Género:

- **Método**: POST
- **URL**: http://localhost:3000/api/generos
- **Headers**: Content-Type: application/json
- **Body (JSON)**:
```json
{
  "nombre": "Drama",
  "descripcion": "Películas dramáticas"
}
```

## Manejo de Errores

La API devuelve los siguientes códigos de estado HTTP:

- **200 OK**: Solicitud exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Solicitud inválida (datos faltantes o incorrectos)
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor

**Formato de error:**
```json
{
  "error": "Descripción del error"
}
```

## Variables de Entorno

El archivo `.env` contiene las variables de configuración:

```ini
PORT=3000                          # Puerto del servidor
NODE_ENV=development               # Entorno de ejecución
DB_PATH=./database/peliculas.db   # Ruta de la base de datos
```

## Notas Importantes

1. Las tablas se crean automáticamente al iniciar el servidor
2. Se utilizan relaciones de clave foránea para mantener la integridad referencial
3. La API soporta operaciones CRUD completas
4. Se incluyen sistemas de logging básico

## Mejoras Futuras

- Autenticación y autorización
- Validación de entrada más robusta
- Paginación en los listados
- Búsqueda avanzada
- Caché de datos
- Tests automatizados
- Documentación interactiva con Swagger

## Licencia

ISC

## Autor

Estudiante de Desarrollo Web - Actividad Evaluativa

---

**Fecha**: Febrero de 2026
**Versión**: 1.0.0

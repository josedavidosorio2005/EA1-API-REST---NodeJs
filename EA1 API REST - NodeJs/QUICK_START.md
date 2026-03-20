# Guía de Inicio Rápido - API REST Películas y Series

## Requisitos Previos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)
- Postman o similar (para pruebas de API)
- Git (opcional, para control de versiones)

## Pasos de Instalación

### 1. Descargar e Instalar Node.js

Descarga desde: https://nodejs.org/

Verifica la instalación:
```bash
node --version
npm --version
```

### 2. Instalar Dependencias del Proyecto

```bash
cd "EA1 API REST - NodeJs"
npm install
```

Esto instalará:
- express: Framework web
- sqlite3: Base de datos
- body-parser: Parseo de JSON
- cors: Compartir recursos entre orígenes
- dotenv: Variables de entorno
- nodemon: Reinicio automático en desarrollo

### 3. Ejecutar el Servidor

```bash
npm start
```

O para desarrollo con reinicio automático:
```bash
npm run dev
```

Deberías ver:
```
Servidor corriendo en http://localhost:3000
Conectado a la base de datos SQLite
Tablas creadas exitosamente
```

## Probar la API

### Opción 1: Usar Postman (Recomendado)

1. **Descargar Postman** desde https://www.postman.com/
2. **Importar la colección**:
   - Abre Postman
   - Click en "Import"
   - Selecciona el archivo `postman_collection.json`
3. **Ejecutar pruebas**:
   - Selecciona GET /generos
   - Click en "Send"

### Opción 2: Usar cURL en la terminal

```bash
# Obtener todos los géneros
curl http://localhost:3000/api/generos

# Crear un nuevo género
curl -X POST http://localhost:3000/api/generos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Drama","descripcion":"Películas dramáticas"}'
```

### Opción 3: Usar Thunder Client o RestClient

Extensiones del navegador o editores que permiten hacer solicitudes HTTP.

## Estructura de Carpetas Creada

```
EA1 API REST - NodeJs/
├── src/
│   ├── config/
│   │   ├── database.js           # Conexión a BD
│   │   ├── init-db.js            # Crear tablas
│   │   └── seed.js               # Datos de ejemplo
│   ├── controllers/              # Lógica de negocio
│   ├── routes/                   # Definición de endpoints
│   ├── middleware/               # Middlewares personalizados
│   └── server.js                 # Punto de entrada
├── database/
│   └── peliculas.db             # Archivo de BD (se crea automáticamente)
├── README.md                     # Documentación completa
├── QUICK_START.md               # Esta guía
├── package.json                  # Dependencias del proyecto
├── .env                          # Variables de entorno
├── .gitignore                    # Archivos a ignorar en Git
└── postman_collection.json      # Colección de Postman
```

## Endpoints Disponibles

### Raíz
- `GET /` - Información de la API

### Géneros
- `GET /api/generos` - Listar todos
- `POST /api/generos` - Crear nuevo
- `GET /api/generos/:id` - Obtener por ID
- `PUT /api/generos/:id` - Actualizar
- `DELETE /api/generos/:id` - Eliminar

### Directores
- `GET /api/directores` - Listar todos
- `POST /api/directores` - Crear nuevo
- `GET /api/directores/:id` - Obtener por ID
- `PUT /api/directores/:id` - Actualizar
- `DELETE /api/directores/:id` - Eliminar

### Productoras
- `GET /api/productoras` - Listar todos
- `POST /api/productoras` - Crear nuevo
- `GET /api/productoras/:id` - Obtener por ID
- `PUT /api/productoras/:id` - Actualizar
- `DELETE /api/productoras/:id` - Eliminar

### Tipos
- `GET /api/tipos` - Listar todos
- `POST /api/tipos` - Crear nuevo
- `GET /api/tipos/:id` - Obtener por ID
- `PUT /api/tipos/:id` - Actualizar
- `DELETE /api/tipos/:id` - Eliminar

### Media (Películas y Series)
- `GET /api/media` - Listar todos
- `POST /api/media` - Crear nuevo
- `GET /api/media/:id` - Obtener por ID
- `PUT /api/media/:id` - Actualizar
- `DELETE /api/media/:id` - Eliminar
- `GET /api/media/filtro/tipo/:tipoId` - Por tipo
- `GET /api/media/filtro/genero/:generoId` - Por género

## Ejemplos de Solicitudes

### Crear un Género

**Método**: POST  
**URL**: http://localhost:3000/api/generos  
**Headers**: Content-Type: application/json  
**Body**:
```json
{
  "nombre": "Acción",
  "descripcion": "Películas de acción y aventura"
}
```

**Respuesta**:
```json
{
  "id": 1,
  "nombre": "Acción",
  "descripcion": "Películas de acción y aventura"
}
```

### Crear un Director

**Método**: POST  
**URL**: http://localhost:3000/api/directores  
**Headers**: Content-Type: application/json  
**Body**:
```json
{
  "nombre": "Steven",
  "apellido": "Spielberg",
  "email": "steven@example.com",
  "telefono": "+1-555-0100",
  "pais": "Estados Unidos"
}
```

### Crear una Película

**Método**: POST  
**URL**: http://localhost:3000/api/media  
**Headers**: Content-Type: application/json  
**Body**:
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

## Solución de Problemas

### Error: "npm: command not found"
- Instala Node.js desde https://nodejs.org/

### Error: "SQLITE_CANTOPEN"
- Asegúrate de que la carpeta `database/` existe
- Verifica permisos de carpeta

### Error: "Address already in use"
- El puerto 3000 está ocupado
- Cambia el puerto en `.env`: `PORT=3001`

### Error de CORS
- Asegúrate de que el header Content-Type está configurado correctamente

## Configuración Avanzada

### Cambiar Puerto

Edita el archivo `.env`:
```
PORT=5000
```

### Cambiar Ubicación de BD

Edita el archivo `.env`:
```
DB_PATH=./database/mi-base-datos.db
```

### Agregar Más Datos

Modifica `src/config/seed.js` y agrega tus datos de ejemplo.

## Próximos Pasos

1. Prueba todos los endpoints
2. Crea datos de ejemplo
3. Realiza operaciones CRUD
4. Explora las rutas de filtrado
5. Personaliza según tus necesidades

## Soporte

Para más información, revisita en:
- README.md - Documentación completa
- Consola del servidor - Muestra logs de solicitudes

---

**Versión**: 1.0.0  
**Última actualización**: Febrero 2026

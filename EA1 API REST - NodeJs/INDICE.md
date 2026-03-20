# API REST PELÍCULAS Y SERIES - ÍNDICE Y RESUMEN

## Resumen Ejecutivo

Se ha desarrollado una **API REST completa** para gestionar películas y series, implementada con:
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **SQLite3**: Base de datos relacional
- **Arquitectura por capas**: Controladores, Rutas, Middlewares

## Estructura del Proyecto

```
EA1 API REST - NodeJs/
├── 📄 README.md                    # Documentación principal (LEER PRIMERO)
├── 📄 QUICK_START.md              # Guía rápida de inicio
├── 📄 ARQUITECTURA.md             # Diseño de BD y arquitectura
├── 📄 GUIA_DESARROLLO.md          # Cómo desarrollar e iterar
├── 📄 package.json                # Dependencias NPM
├── 📄 .env                        # Variables de entorno
├── 📄 .env.example                # Ejemplo de .env
├── 📄 .gitignore                  # Configuración de Git
├── 📄 postman_collection.json     # Colección de Postman
├── 📁 src/                        # Código fuente
│   ├── server.js                  # Punto de entrada
│   ├── 📁 config/                 # Configuración
│   │   ├── database.js            # Conexión a BD
│   │   ├── init-db.js             # Crear tablas
│   │   └── seed.js                # Datos de ejemplo
│   ├── 📁 controllers/            # Lógica de negocio
│   │   ├── generoController.js
│   │   ├── directorController.js
│   │   ├── productoraController.js
│   │   ├── tipoController.js
│   │   └── mediaController.js
│   ├── 📁 routes/                 # Definición de endpoints
│   │   ├── generoRoutes.js
│   │   ├── directorRoutes.js
│   │   ├── productoraRoutes.js
│   │   ├── tipoRoutes.js
│   │   └── mediaRoutes.js
│   ├── 📁 middleware/             # Funciones middleware
│   │   └── validadores.js         # Validación de entrada
│   └── 📁 models/                 # (Futuro: modelos de datos)
├── 📁 database/                   # Base de datos
│   └── peliculas.db               # Archivo BD (se crea)
├── 📄 test_api.sh                 # Tests para Linux/Mac
└── 📄 test_api.bat                # Tests para Windows
```

## Orden de Lectura Recomendado

### Para Empezar Rápido ⚡
1. **QUICK_START.md** - Instrucciones de instalación y primer test
2. **postman_collection.json** - Importar en Postman
3. Ejecutar: `npm install` → `npm start`

### Para Entender la Arquitectura 🏗️
1. **README.md** - Documentación completa
2. **ARQUITECTURA.md** - Diagrama de BD y flujos

### Para Desarrollar 💻
1. **GUIA_DESARROLLO.md** - Patrones y convenciones
2. **src/controllers/** - Ver ejemplos
3. Personalizar según necesidades

## Características Implementadas ✅

### CRUD Operations
- ✅ CREATE: `POST /api/generos`, etc.
- ✅ READ: `GET /api/generos`, `/api/generos/:id`
- ✅ UPDATE: `PUT /api/generos/:id`
- ✅ DELETE: `DELETE /api/generos/:id`

### Módulos
- ✅ **Géneros**: 5 endpoints
- ✅ **Directores**: 5 endpoints
- ✅ **Productoras**: 5 endpoints
- ✅ **Tipos**: 5 endpoints
- ✅ **Media (Películas/Series)**: 7 endpoints (incluyendo filtros)

### Base de Datos
- ✅ 5 tablas relacionales
- ✅ Claves foráneas implementadas
- ✅ Timestamps (createdAt, updatedAt)
- ✅ Unique constraints

### Seguridad y Validación
- ✅ CORS habilitado
- ✅ Validación de entrada en middlewares
- ✅ Manejo de errores centralizado
- ✅ Códigos HTTP apropiados

## Instalación Rápida

```bash
cd "EA1 API REST - NodeJs"
npm install
npm start
```

Luego accede a: `http://localhost:3000`

## Endpoints Disponibles

| Módulo | GET | POST | PUT | DELETE | Filtros |
|--------|-----|------|-----|--------|---------|
| Géneros | ✅ | ✅ | ✅ | ✅ | - |
| Directores | ✅ | ✅ | ✅ | ✅ | - |
| Productoras | ✅ | ✅ | ✅ | ✅ | - |
| Tipos | ✅ | ✅ | ✅ | ✅ | - |
| Media | ✅ | ✅ | ✅ | ✅ | Tipo, Género |

## Pruebas

### Opción 1: Postman (Recomendado)
```
1. Abre Postman
2. Click: File → Import
3. Selecciona: postman_collection.json
4. ¡Listo!
```

### Opción 2: cURL
```bash
curl http://localhost:3000/api/generos
```

### Opción 3: Scripts
```bash
# Linux/Mac
./test_api.sh

# Windows
test_api.bat
```

## Próximos Pasos

### Para el Estudiante 👨‍🎓
1. ✅ Clonar/descargar el proyecto
2. ✅ Ejecutar `npm install`
3. ✅ Ejecutar `npm start`
4. ✅ Probar con Postman
5. ✅ Personalizar valores en la BD
6. ✅ Grabar video explicativo (opcional)
7. ✅ Subir a GitHub/Bitbucket

### Personalizaciones Sugeridas 🎨
- Modificar colores/estilos si hay frontend
- Agregar más géneros, directores, etc.
- Implementar paginación
- Agregar búsqueda avanzada
- Documentación con Swagger

## Entrega Final 📦

El proyecto incluye:
- ✅ Código fuente completo
- ✅ Documentación en .md
- ✅ Base de datos vacía (se crea automáticamente)
- ✅ Colección Postman
- ✅ Ejemplos y guías

Falta por entregar:
- 📹 Video en YouTube (o documento PDF si no es posible)
- 📊 Datos de ejemplo (Géneros, Directores, etc.)

## Comando 'npm'

```bash
npm install      # Instalar dependencias
npm start        # Ejecutar servidor
npm run dev      # Ejecutar con nodemon
```

## Requisitos Mínimos

- Node.js 14+
- npm 6+
- 100 MB de espacio libre
- Puerto 3000 disponible

## Soporte

- 📖 README.md - Documentación técnica
- 📋 QUICK_START.md - Guía rápida
- 🏗️ ARQUITECTURA.md - Diseño del sistema
- 💻 GUIA_DESARROLLO.md - Desarrollo personalizado

## Licenses y Créditos

- **Express.js**: https://expressjs.com/es/
- **SQLite3**: https://www.sqlite.org/
- **Node.js**: https://nodejs.org/es/
- Estudiante: [Tu Nombre]

## Checklist Final

- [ ] Instalar Node.js
- [ ] Clonar/descargar proyecto
- [ ] Ejecutar `npm install`
- [ ] Ejecutar `npm start`
- [ ] Probar con Postman
- [ ] Crear datos de ejemplo
- [ ] Grabar video o escribir documento
- [ ] Subir a GitHub/Bitbucket
- [ ] Enviar al profesor

---

**Estado**: ✅ Completo y Funcional  
**Versión**: 1.0.0  
**Fecha de Creación**: Febrero 2026  
**Lenguaje**: JavaScript (Node.js)  
**Base de Datos**: SQLite3  
**Framework**: Express.js

### Última Actualización: Febrero 25, 2026

---

## ¿Preguntas Frecuentes?

**¿Cómo cambio el puerto?**
Edita `.env` y cambia `PORT=3000` a `PORT=5000`

**¿Dónde está la base de datos?**
En: `database/peliculas.db`

**¿Cómo agrego datos?**
Usa Postman o cURL para hacer requests POST

**¿Puedo cambiar la estructura de tablas?**
Sí, edita `src/config/init-db.js` y reinicia

**¿Es seguro para producción?**
No. Agrega autenticación, HTTPS y validación adicional

¡Para comenzar, lee **QUICK_START.md**! 🚀

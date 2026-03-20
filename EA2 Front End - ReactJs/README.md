# EA2 Front End – ReactJs

Aplicación web desarrollada con **ReactJs** que consume la API REST construida en la **EA1: API REST NodeJs**.

## Tecnologías utilizadas

| Librería | Versión | Uso |
|---|---|---|
| React | 18 | Librería principal de UI |
| React Router | 6 | Navegación entre páginas |
| Axios | 1.6 | Comunicación HTTP con la API |
| Bootstrap | 5.3 | Estilos y componentes UI |
| Bootstrap Icons | 1.11 | Íconos |
| SweetAlert2 | 11 | Alertas y confirmaciones |
| Vite | 5 | Bundler y servidor de desarrollo |

## Módulos implementados

- **Géneros** – CRUD completo (nombre, estado, descripción)
- **Directores** – CRUD completo (nombres, estado)
- **Productoras** – CRUD completo (nombre, estado, slogan, descripción)
- **Tipos** – CRUD completo (nombre, descripción)
- **Películas y Series** – CRUD completo con filtros por tipo, visualización de portadas y detalle

## Requisitos previos

1. Tener corriendo la **API REST NodeJs** en `http://localhost:3000`
2. Node.js 18+

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Modo desarrollo (http://localhost:5173)
npm run dev

# Build para producción
npm run build
```

## Variables de entorno

Crea un archivo `.env` en la raíz con:

```
VITE_API_URL=http://localhost:3000/api
```

> El archivo `.env` ya está incluido con la configuración por defecto.

## Estructura del proyecto

```
src/
├── api/
│   └── axios.js          # Configuración de Axios
├── components/
│   ├── Sidebar.jsx        # Menú lateral de navegación
│   └── Footer.jsx         # Pie de página
├── pages/
│   ├── Home.jsx           # Dashboard con estadísticas
│   ├── generos/
│   │   └── Generos.jsx    # CRUD Géneros
│   ├── directores/
│   │   └── Directores.jsx # CRUD Directores
│   ├── productoras/
│   │   └── Productoras.jsx# CRUD Productoras
│   ├── tipos/
│   │   └── Tipos.jsx      # CRUD Tipos
│   └── media/
│       └── Media.jsx      # CRUD Películas y Series
├── App.jsx                # Rutas y layout principal
├── main.jsx               # Punto de entrada
└── index.css              # Estilos globales
```

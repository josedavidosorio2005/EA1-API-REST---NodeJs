const db = require('./database');

// Script para crear todas las tablas
function createTables() {
  db.serialize(() => {
    // Tabla de Géneros
    // Campos: nombre, estado (Activo/Inactivo), descripcion, createdAt, updatedAt
    db.run(`
      CREATE TABLE IF NOT EXISTS generos (
        id          INTEGER  PRIMARY KEY AUTOINCREMENT,
        nombre      TEXT     NOT NULL UNIQUE,
        estado      TEXT     NOT NULL DEFAULT 'Activo' CHECK(estado IN ('Activo','Inactivo')),
        descripcion TEXT,
        createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de Directores
    // Campos: nombres (nombre + apellido), estado, createdAt, updatedAt
    db.run(`
      CREATE TABLE IF NOT EXISTS directores (
        id        INTEGER  PRIMARY KEY AUTOINCREMENT,
        nombres   TEXT     NOT NULL,
        estado    TEXT     NOT NULL DEFAULT 'Activo' CHECK(estado IN ('Activo','Inactivo')),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de Productoras
    // Campos: nombre, estado, slogan, descripcion, createdAt, updatedAt
    db.run(`
      CREATE TABLE IF NOT EXISTS productoras (
        id          INTEGER  PRIMARY KEY AUTOINCREMENT,
        nombre      TEXT     NOT NULL UNIQUE,
        estado      TEXT     NOT NULL DEFAULT 'Activo' CHECK(estado IN ('Activo','Inactivo')),
        slogan      TEXT,
        descripcion TEXT,
        createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de Tipos (película, serie, etc.)
    // Campos: nombre, descripcion, createdAt, updatedAt
    db.run(`
      CREATE TABLE IF NOT EXISTS tipos (
        id          INTEGER  PRIMARY KEY AUTOINCREMENT,
        nombre      TEXT     NOT NULL UNIQUE,
        descripcion TEXT,
        createdAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt   DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de Media (Películas y Series)
    // Campos: serial (único), titulo, sinopsis, url (único), portada, createdAt, updatedAt,
    //         anio_estreno, genero_id (solo activos), director_id (solo activos),
    //         productora_id (solo activas), tipo_id
    db.run(`
      CREATE TABLE IF NOT EXISTS media (
        id           INTEGER  PRIMARY KEY AUTOINCREMENT,
        serial       TEXT     NOT NULL UNIQUE,
        titulo       TEXT     NOT NULL,
        sinopsis     TEXT,
        url          TEXT     NOT NULL UNIQUE,
        portada      TEXT,
        anio_estreno INTEGER,
        genero_id    INTEGER  NOT NULL,
        director_id  INTEGER  NOT NULL,
        productora_id INTEGER NOT NULL,
        tipo_id      INTEGER  NOT NULL,
        createdAt    DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt    DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (genero_id)     REFERENCES generos(id),
        FOREIGN KEY (director_id)   REFERENCES directores(id),
        FOREIGN KEY (productora_id) REFERENCES productoras(id),
        FOREIGN KEY (tipo_id)       REFERENCES tipos(id)
      )
    `);

    console.log('Tablas creadas exitosamente');
  });
}

module.exports = { createTables };

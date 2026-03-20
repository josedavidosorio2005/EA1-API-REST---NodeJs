const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbDir  = path.join(__dirname, '../../database');
const dbPath = path.join(dbDir, 'peliculas.db');

// Crear el directorio si no existe
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Habilitar claves foráneas
db.run('PRAGMA foreign_keys = ON');

module.exports = db;

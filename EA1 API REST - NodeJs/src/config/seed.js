const db = require('./database');

function seedDatabase() {
  // Insertar géneros (5 iniciales del caso de estudio)
  const generos = [
    { nombre: 'Acción',          estado: 'Activo', descripcion: 'Películas llenas de acción y adrenalina' },
    { nombre: 'Aventura',        estado: 'Activo', descripcion: 'Películas de exploración y aventuras épicas' },
    { nombre: 'Ciencia Ficción', estado: 'Activo', descripcion: 'Películas de ciencia ficción y futurismo' },
    { nombre: 'Drama',           estado: 'Activo', descripcion: 'Películas dramáticas y emotivas' },
    { nombre: 'Terror',          estado: 'Activo', descripcion: 'Películas de horror y miedo' }
  ];

  generos.forEach(g => {
    db.run(
      'INSERT OR IGNORE INTO generos (nombre, estado, descripcion) VALUES (?, ?, ?)',
      [g.nombre, g.estado, g.descripcion]
    );
  });

  // Insertar directores
  const directores = [
    { nombres: 'Steven Spielberg',   estado: 'Activo' },
    { nombres: 'Christopher Nolan',  estado: 'Activo' },
    { nombres: 'Quentin Tarantino',  estado: 'Activo' },
    { nombres: 'Martin Scorsese',    estado: 'Activo' }
  ];

  directores.forEach(d => {
    db.run(
      'INSERT OR IGNORE INTO directores (nombres, estado) VALUES (?, ?)',
      [d.nombres, d.estado]
    );
  });

  // Insertar productoras
  const productoras = [
    { nombre: 'Universal Pictures', estado: 'Activo', slogan: 'The Entertainment Destination', descripcion: 'Una de las productoras más antiguas de Hollywood' },
    { nombre: 'Warner Bros',        estado: 'Activo', slogan: 'The stuff that dreams are made of', descripcion: 'Major studio de entretenimiento global' },
    { nombre: 'Paramount Pictures', estado: 'Activo', slogan: 'If it\'s a Paramount picture, it\'s the best show in town', descripcion: 'Productora pionera de la era dorada de Hollywood' },
    { nombre: 'Disney',             estado: 'Activo', slogan: 'The most magical place on Earth', descripcion: 'La empresa de entretenimiento más reconocida del mundo' },
    { nombre: 'MGM',                estado: 'Activo', slogan: 'Ars Gratia Artis', descripcion: 'Metro-Goldwyn-Mayer, estudio clásico de Hollywood' }
  ];

  productoras.forEach(p => {
    db.run(
      'INSERT OR IGNORE INTO productoras (nombre, estado, slogan, descripcion) VALUES (?, ?, ?, ?)',
      [p.nombre, p.estado, p.slogan, p.descripcion]
    );
  });

  // Insertar tipos (2 iniciales del caso de estudio)
  const tipos = [
    { nombre: 'Película', descripcion: 'Largometraje de cine' },
    { nombre: 'Serie',    descripcion: 'Serie de televisión con múltiples episodios' }
  ];

  tipos.forEach(t => {
    db.run(
      'INSERT OR IGNORE INTO tipos (nombre, descripcion) VALUES (?, ?)',
      [t.nombre, t.descripcion]
    );
  });

  console.log('Base de datos poblada con datos de ejemplo');
}

module.exports = { seedDatabase };

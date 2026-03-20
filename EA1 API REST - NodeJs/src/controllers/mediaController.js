const db = require('../config/database');

// Función auxiliar: verifica que genero, director y productora existen y están Activos
function verificarRelacionesActivas(genero_id, director_id, productora_id, tipo_id, callback) {
  db.get("SELECT id, estado FROM generos    WHERE id = ?", [genero_id],     (err, genero) => {
    if (err)     return callback(err);
    if (!genero) return callback(null, 'El género indicado no existe');
    if (genero.estado !== 'Activo') return callback(null, 'El género indicado no está activo');

    db.get("SELECT id, estado FROM directores  WHERE id = ?", [director_id],   (err2, director) => {
      if (err2)      return callback(err2);
      if (!director) return callback(null, 'El director indicado no existe');
      if (director.estado !== 'Activo') return callback(null, 'El director indicado no está activo');

      db.get("SELECT id, estado FROM productoras WHERE id = ?", [productora_id], (err3, productora) => {
        if (err3)       return callback(err3);
        if (!productora) return callback(null, 'La productora indicada no existe');
        if (productora.estado !== 'Activo') return callback(null, 'La productora indicada no está activa');

        db.get("SELECT id FROM tipos WHERE id = ?", [tipo_id], (err4, tipo) => {
          if (err4)  return callback(err4);
          if (!tipo) return callback(null, 'El tipo indicado no existe');
          callback(null, null); // Todo OK
        });
      });
    });
  });
}

// Obtener todos los media (películas y series)
exports.obtenerMedia = (req, res) => {
  const query = `
    SELECT m.*,
           g.nombre as genero,
           d.nombres as director,
           p.nombre as productora,
           t.nombre as tipo
    FROM media m
    LEFT JOIN generos     g ON m.genero_id     = g.id
    LEFT JOIN directores  d ON m.director_id   = d.id
    LEFT JOIN productoras p ON m.productora_id = p.id
    LEFT JOIN tipos       t ON m.tipo_id       = t.id
    ORDER BY m.titulo ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Obtener media por ID
exports.obtenerMediaPorId = (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT m.*,
           g.nombre  as genero,
           d.nombres as director,
           p.nombre  as productora,
           t.nombre  as tipo
    FROM media m
    LEFT JOIN generos     g ON m.genero_id     = g.id
    LEFT JOIN directores  d ON m.director_id   = d.id
    LEFT JOIN productoras p ON m.productora_id = p.id
    LEFT JOIN tipos       t ON m.tipo_id       = t.id
    WHERE m.id = ?
  `;
  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Media no encontrada' });
    res.json(row);
  });
};

// Crear nuevo media (película o serie)
// Campos requeridos por el caso de estudio:
//   serial (único), titulo, url (único), genero_id (activo),
//   director_id (activo), productora_id (activa), tipo_id
exports.crearMedia = (req, res) => {
  const {
    serial, titulo, sinopsis, url, portada,
    anio_estreno, genero_id, director_id, productora_id, tipo_id
  } = req.body;

  const gId = parseInt(genero_id);
  const dId = parseInt(director_id);
  const pId = parseInt(productora_id);
  const tId = parseInt(tipo_id);

  verificarRelacionesActivas(gId, dId, pId, tId, (err, msg) => {
    if (err) return res.status(500).json({ error: err.message });
    if (msg) return res.status(400).json({ error: msg });

    db.run(
      `INSERT INTO media
         (serial, titulo, sinopsis, url, portada, anio_estreno,
          genero_id, director_id, productora_id, tipo_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [serial, titulo, sinopsis || null, url, portada || null,
       anio_estreno || null, gId, dId, pId, tId],
      function (err2) {
        if (err2) {
          if (err2.message.includes('UNIQUE'))
            return res.status(400).json({ error: 'El serial o la URL ya están registrados' });
          return res.status(500).json({ error: err2.message });
        }
        db.get(
          `SELECT m.*, g.nombre as genero, d.nombres as director,
                  p.nombre as productora, t.nombre as tipo
           FROM media m
           LEFT JOIN generos g ON m.genero_id = g.id
           LEFT JOIN directores d ON m.director_id = d.id
           LEFT JOIN productoras p ON m.productora_id = p.id
           LEFT JOIN tipos t ON m.tipo_id = t.id
           WHERE m.id = ?`,
          [this.lastID],
          (e, row) => {
            if (e) return res.status(500).json({ error: e.message });
            res.status(201).json(row);
          }
        );
      }
    );
  });
};

// Actualizar media
exports.actualizarMedia = (req, res) => {
  const { id } = req.params;
  const {
    serial, titulo, sinopsis, url, portada,
    anio_estreno, genero_id, director_id, productora_id, tipo_id
  } = req.body;

  db.get('SELECT * FROM media WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Media no encontrada' });

    const nuevoSerial       = serial       !== undefined ? serial       : row.serial;
    const nuevoTitulo       = titulo       !== undefined ? titulo       : row.titulo;
    const nuevaSinopsis     = sinopsis     !== undefined ? sinopsis     : row.sinopsis;
    const nuevaUrl          = url          !== undefined ? url          : row.url;
    const nuevaPortada      = portada      !== undefined ? portada      : row.portada;
    const nuevoAnio         = anio_estreno !== undefined ? anio_estreno : row.anio_estreno;
    const nuevoGenero       = genero_id    !== undefined ? parseInt(genero_id)    : row.genero_id;
    const nuevoDirector     = director_id  !== undefined ? parseInt(director_id)  : row.director_id;
    const nuevoProductora   = productora_id !== undefined ? parseInt(productora_id) : row.productora_id;
    const nuevoTipo         = tipo_id      !== undefined ? parseInt(tipo_id)      : row.tipo_id;

    verificarRelacionesActivas(nuevoGenero, nuevoDirector, nuevoProductora, nuevoTipo, (err2, msg) => {
      if (err2) return res.status(500).json({ error: err2.message });
      if (msg)  return res.status(400).json({ error: msg });

      db.run(
        `UPDATE media
            SET serial = ?, titulo = ?, sinopsis = ?, url = ?, portada = ?,
                anio_estreno = ?, genero_id = ?, director_id = ?,
                productora_id = ?, tipo_id = ?, updatedAt = CURRENT_TIMESTAMP
          WHERE id = ?`,
        [nuevoSerial, nuevoTitulo, nuevaSinopsis, nuevaUrl, nuevaPortada,
         nuevoAnio, nuevoGenero, nuevoDirector, nuevoProductora, nuevoTipo, id],
        function (err3) {
          if (err3) {
            if (err3.message.includes('UNIQUE'))
              return res.status(400).json({ error: 'El serial o la URL ya están registrados' });
            return res.status(500).json({ error: err3.message });
          }
          db.get(
            `SELECT m.*, g.nombre as genero, d.nombres as director,
                    p.nombre as productora, t.nombre as tipo
             FROM media m
             LEFT JOIN generos g ON m.genero_id = g.id
             LEFT JOIN directores d ON m.director_id = d.id
             LEFT JOIN productoras p ON m.productora_id = p.id
             LEFT JOIN tipos t ON m.tipo_id = t.id
             WHERE m.id = ?`,
            [id],
            (e, updated) => {
              if (e) return res.status(500).json({ error: e.message });
              res.json(updated);
            }
          );
        }
      );
    });
  });
};

// Eliminar media
exports.eliminarMedia = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM media WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Media no encontrada' });
    res.json({ mensaje: 'Media eliminada correctamente' });
  });
};

// Filtrar media por tipo (películas o series)
exports.obtenerMediaPorTipo = (req, res) => {
  const { tipoId } = req.params;
  const query = `
    SELECT m.*, g.nombre as genero, d.nombres as director,
           p.nombre as productora, t.nombre as tipo
    FROM media m
    LEFT JOIN generos g ON m.genero_id = g.id
    LEFT JOIN directores d ON m.director_id = d.id
    LEFT JOIN productoras p ON m.productora_id = p.id
    LEFT JOIN tipos t ON m.tipo_id = t.id
    WHERE m.tipo_id = ?
    ORDER BY m.titulo ASC
  `;
  db.all(query, [tipoId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Filtrar media por género
exports.obtenerMediaPorGenero = (req, res) => {
  const { generoId } = req.params;
  const query = `
    SELECT m.*, g.nombre as genero, d.nombres as director,
           p.nombre as productora, t.nombre as tipo
    FROM media m
    LEFT JOIN generos g ON m.genero_id = g.id
    LEFT JOIN directores d ON m.director_id = d.id
    LEFT JOIN productoras p ON m.productora_id = p.id
    LEFT JOIN tipos t ON m.tipo_id = t.id
    WHERE m.genero_id = ?
    ORDER BY m.titulo ASC
  `;
  db.all(query, [generoId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

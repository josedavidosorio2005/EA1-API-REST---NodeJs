const db = require('../config/database');

// Obtener todos los tipos
exports.obtenerTipos = (req, res) => {
  db.all('SELECT * FROM tipos ORDER BY nombre ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Obtener tipo por ID
exports.obtenerTipoPorId = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM tipos WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Tipo no encontrado' });
    res.json(row);
  });
};

// Crear nuevo tipo
exports.crearTipo = (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });

  db.run(
    'INSERT INTO tipos (nombre, descripcion) VALUES (?, ?)',
    [nombre.trim(), descripcion || null],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE'))
          return res.status(400).json({ error: 'El tipo ya existe' });
        return res.status(500).json({ error: err.message });
      }
      db.get('SELECT * FROM tipos WHERE id = ?', [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.status(201).json(row);
      });
    }
  );
};

// Actualizar tipo
exports.actualizarTipo = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;

  db.get('SELECT * FROM tipos WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Tipo no encontrado' });

    const nuevoNombre      = nombre      !== undefined ? nombre.trim() : row.nombre;
    const nuevaDescripcion = descripcion !== undefined ? descripcion    : row.descripcion;

    db.run(
      `UPDATE tipos
          SET nombre = ?, descripcion = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?`,
      [nuevoNombre, nuevaDescripcion, id],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        db.get('SELECT * FROM tipos WHERE id = ?', [id], (e, updated) => {
          if (e) return res.status(500).json({ error: e.message });
          res.json(updated);
        });
      }
    );
  });
};

// Eliminar tipo
exports.eliminarTipo = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tipos WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: 'Tipo no encontrado' });
    res.json({ mensaje: 'Tipo eliminado correctamente' });
  });
};

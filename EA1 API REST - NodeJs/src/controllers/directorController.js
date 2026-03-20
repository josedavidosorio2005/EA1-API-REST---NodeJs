const db = require('../config/database');

// Obtener todos los directores
exports.obtenerDirectores = (req, res) => {
  db.all('SELECT * FROM directores ORDER BY nombres ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Obtener solo directores activos (útil para el formulario de media)
exports.obtenerDirectoresActivos = (req, res) => {
  db.all("SELECT * FROM directores WHERE estado = 'Activo' ORDER BY nombres ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Obtener director por ID
exports.obtenerDirectorPorId = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM directores WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Director no encontrado' });
    res.json(row);
  });
};

// Crear nuevo director
exports.crearDirector = (req, res) => {
  const { nombres, estado = 'Activo' } = req.body;

  if (!nombres) return res.status(400).json({ error: 'El campo nombres es requerido' });
  if (!['Activo', 'Inactivo'].includes(estado))
    return res.status(400).json({ error: 'El estado debe ser Activo o Inactivo' });

  db.run(
    'INSERT INTO directores (nombres, estado) VALUES (?, ?)',
    [nombres.trim(), estado],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT * FROM directores WHERE id = ?', [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.status(201).json(row);
      });
    }
  );
};

// Actualizar director
exports.actualizarDirector = (req, res) => {
  const { id } = req.params;
  const { nombres, estado } = req.body;

  if (estado && !['Activo', 'Inactivo'].includes(estado))
    return res.status(400).json({ error: 'El estado debe ser Activo o Inactivo' });

  db.get('SELECT * FROM directores WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Director no encontrado' });

    const nuevosNombres = nombres !== undefined ? nombres.trim() : row.nombres;
    const nuevoEstado  = estado  !== undefined ? estado          : row.estado;

    db.run(
      `UPDATE directores
          SET nombres = ?, estado = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?`,
      [nuevosNombres, nuevoEstado, id],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        db.get('SELECT * FROM directores WHERE id = ?', [id], (e, updated) => {
          if (e) return res.status(500).json({ error: e.message });
          res.json(updated);
        });
      }
    );
  });
};

// Eliminar director
exports.eliminarDirector = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM directores WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: 'Director no encontrado' });
    res.json({ mensaje: 'Director eliminado correctamente' });
  });
};

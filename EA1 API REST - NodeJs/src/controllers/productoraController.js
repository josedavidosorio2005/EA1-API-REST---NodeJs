const db = require('../config/database');

// Obtener todas las productoras
exports.obtenerProductoras = (req, res) => {
  db.all('SELECT * FROM productoras ORDER BY nombre ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Obtener solo productoras activas (útil para el formulario de media)
exports.obtenerProductorasActivas = (req, res) => {
  db.all("SELECT * FROM productoras WHERE estado = 'Activo' ORDER BY nombre ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Obtener productora por ID
exports.obtenerProductoraPorId = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM productoras WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Productora no encontrada' });
    res.json(row);
  });
};

// Crear nueva productora
exports.crearProductora = (req, res) => {
  const { nombre, estado = 'Activo', slogan, descripcion } = req.body;

  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });
  if (!['Activo', 'Inactivo'].includes(estado))
    return res.status(400).json({ error: 'El estado debe ser Activo o Inactivo' });

  db.run(
    'INSERT INTO productoras (nombre, estado, slogan, descripcion) VALUES (?, ?, ?, ?)',
    [nombre.trim(), estado, slogan || null, descripcion || null],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE'))
          return res.status(400).json({ error: 'La productora ya existe' });
        return res.status(500).json({ error: err.message });
      }
      db.get('SELECT * FROM productoras WHERE id = ?', [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.status(201).json(row);
      });
    }
  );
};

// Actualizar productora
exports.actualizarProductora = (req, res) => {
  const { id } = req.params;
  const { nombre, estado, slogan, descripcion } = req.body;

  if (estado && !['Activo', 'Inactivo'].includes(estado))
    return res.status(400).json({ error: 'El estado debe ser Activo o Inactivo' });

  db.get('SELECT * FROM productoras WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Productora no encontrada' });

    const nuevoNombre      = nombre      !== undefined ? nombre.trim()  : row.nombre;
    const nuevoEstado      = estado      !== undefined ? estado          : row.estado;
    const nuevoSlogan      = slogan      !== undefined ? slogan          : row.slogan;
    const nuevaDescripcion = descripcion !== undefined ? descripcion     : row.descripcion;

    db.run(
      `UPDATE productoras
          SET nombre = ?, estado = ?, slogan = ?, descripcion = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?`,
      [nuevoNombre, nuevoEstado, nuevoSlogan, nuevaDescripcion, id],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        db.get('SELECT * FROM productoras WHERE id = ?', [id], (e, updated) => {
          if (e) return res.status(500).json({ error: e.message });
          res.json(updated);
        });
      }
    );
  });
};

// Eliminar productora
exports.eliminarProductora = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM productoras WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: 'Productora no encontrada' });
    res.json({ mensaje: 'Productora eliminada correctamente' });
  });
};

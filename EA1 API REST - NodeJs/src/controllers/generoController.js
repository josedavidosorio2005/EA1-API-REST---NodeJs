const db = require('../config/database');

// Obtener todos los géneros
exports.obtenerGeneros = (req, res) => {
  db.all('SELECT * FROM generos ORDER BY nombre ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Obtener solo géneros activos (útil para el formulario de media)
exports.obtenerGenerosActivos = (req, res) => {
  db.all("SELECT * FROM generos WHERE estado = 'Activo' ORDER BY nombre ASC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// Obtener género por ID
exports.obtenerGeneroPorId = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM generos WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Género no encontrado' });
    res.json(row);
  });
};

// Crear nuevo género
exports.crearGenero = (req, res) => {
  const { nombre, estado = 'Activo', descripcion } = req.body;

  if (!nombre) return res.status(400).json({ error: 'El nombre es requerido' });
  if (!['Activo', 'Inactivo'].includes(estado))
    return res.status(400).json({ error: 'El estado debe ser Activo o Inactivo' });

  db.run(
    'INSERT INTO generos (nombre, estado, descripcion) VALUES (?, ?, ?)',
    [nombre.trim(), estado, descripcion || null],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE'))
          return res.status(400).json({ error: 'El género ya existe' });
        return res.status(500).json({ error: err.message });
      }
      db.get('SELECT * FROM generos WHERE id = ?', [this.lastID], (e, row) => {
        if (e) return res.status(500).json({ error: e.message });
        res.status(201).json(row);
      });
    }
  );
};

// Actualizar género
exports.actualizarGenero = (req, res) => {
  const { id } = req.params;
  const { nombre, estado, descripcion } = req.body;

  if (estado && !['Activo', 'Inactivo'].includes(estado))
    return res.status(400).json({ error: 'El estado debe ser Activo o Inactivo' });

  // Primero obtenemos el registro actual para no pisar campos no enviados
  db.get('SELECT * FROM generos WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Género no encontrado' });

    const nuevoNombre      = nombre      !== undefined ? nombre.trim()      : row.nombre;
    const nuevoEstado      = estado      !== undefined ? estado              : row.estado;
    const nuevaDescripcion = descripcion !== undefined ? descripcion         : row.descripcion;

    db.run(
      `UPDATE generos
          SET nombre = ?, estado = ?, descripcion = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?`,
      [nuevoNombre, nuevoEstado, nuevaDescripcion, id],
      function (err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        db.get('SELECT * FROM generos WHERE id = ?', [id], (e, updated) => {
          if (e) return res.status(500).json({ error: e.message });
          res.json(updated);
        });
      }
    );
  });
};

// Eliminar género
exports.eliminarGenero = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM generos WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0)
      return res.status(404).json({ error: 'Género no encontrado' });
    res.json({ mensaje: 'Género eliminado correctamente' });
  });
};

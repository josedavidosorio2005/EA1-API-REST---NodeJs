// Middleware de validación de entrada
const validarGenero = (req, res, next) => {
  const { nombre } = req.body;
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre es requerido y debe ser texto' });
  }
  next();
};

const validarDirector = (req, res, next) => {
  const { nombres } = req.body;
  if (!nombres || typeof nombres !== 'string' || nombres.trim() === '') {
    return res.status(400).json({ error: 'El campo nombres es requerido y debe ser texto' });
  }
  next();
};

const validarProductora = (req, res, next) => {
  const { nombre } = req.body;
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre es requerido y debe ser texto' });
  }
  next();
};

const validarTipo = (req, res, next) => {
  const { nombre } = req.body;
  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({ error: 'El campo nombre es requerido y debe ser texto' });
  }
  next();
};

const validarMedia = (req, res, next) => {
  const { serial, titulo, url, genero_id, director_id, productora_id, tipo_id } = req.body;

  if (!serial || typeof serial !== 'string' || serial.trim() === '') {
    return res.status(400).json({ error: 'El campo serial es requerido (debe ser único)' });
  }
  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ error: 'El campo titulo es requerido' });
  }
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return res.status(400).json({ error: 'El campo url es requerido (debe ser única)' });
  }
  if (!genero_id) {
    return res.status(400).json({ error: 'El campo genero_id es requerido' });
  }
  if (!director_id) {
    return res.status(400).json({ error: 'El campo director_id es requerido' });
  }
  if (!productora_id) {
    return res.status(400).json({ error: 'El campo productora_id es requerido' });
  }
  if (!tipo_id) {
    return res.status(400).json({ error: 'El campo tipo_id es requerido' });
  }
  next();
};

module.exports = { validarGenero, validarDirector, validarProductora, validarTipo, validarMedia };

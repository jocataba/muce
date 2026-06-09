const router = require('express').Router();
const Compromiso = require('../models/Compromiso');
const Usuario = require('../models/Usuario');  // 👈 Importante: agregar esta línea
const Avance = require('../models/Avance');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Obtener compromisos según rol
router.get('/', authMiddleware, async (req, res) => {
  try {
    let where = {};
    if (req.usuario.rol !== 'admin') where.responsable_id = req.usuario.id;
    const compromisos = await Compromiso.findAll({
      where,
      include: [{ model: Usuario, as: 'responsable', attributes: ['nombre'] }], // 👈 Agregar esta línea
      order: [['fecha_vencimiento', 'ASC']]
    });
    res.json(compromisos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear (solo admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const nuevo = await Compromiso.create({
      ...req.body,
      creado_por: req.usuario.id,
      ultima_actualizacion: new Date()
    });
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Actualizar avance (operador puede actualizar estado/avance, admin todo)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const compromiso = await Compromiso.findByPk(req.params.id);
    if (!compromiso) return res.status(404).json({ error: 'No encontrado' });
    if (req.usuario.rol !== 'admin' && compromiso.responsable_id !== req.usuario.id) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }
    const avanceAnterior = compromiso.avance;
    const estadoAnterior = compromiso.estado;
    await compromiso.update({
      ...req.body,
      ultima_actualizacion: new Date()
    });
    if (req.body.avance !== undefined || req.body.estado !== undefined) {
      await Avance.create({
        compromiso_id: compromiso.id,
        usuario_id: req.usuario.id,
        avance_anterior: avanceAnterior,
        avance_nuevo: compromiso.avance,
        estado_anterior: estadoAnterior,
        estado_nuevo: compromiso.estado,
        observacion: req.body.observacion || null
      });
    }
    res.json(compromiso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar (solo admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await Compromiso.destroy({ where: { id: req.params.id } });
  res.json({ mensaje: 'Eliminado' });
});
// Crear (solo admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // 1. Crear la tarea como ya lo haces
    const nuevo = await Compromiso.create({
      ...req.body,
      creado_por: req.usuario.id,
      ultima_actualizacion: new Date()
    });

    // 2. Obtener los datos del responsable
    const responsable = await Usuario.findByPk(req.body.responsable_id);
    if (responsable) {
      // 3. Enviar las notificaciones
      await sendNewTaskEmail(responsable.email, responsable.nombre, nuevo.compromiso);
      await sendNewTaskWhatsApp(responsable.telefono, responsable.nombre, nuevo.compromiso);
    }

    // 4. Responder al cliente con la tarea creada
    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
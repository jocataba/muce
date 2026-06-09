const router = require('express').Router();
const Reserva = require('../models/Reserva');
const Usuario = require('../models/Usuario');
const { authMiddleware } = require('../middleware/auth');
const { Op } = require('sequelize');

// Obtener reservas
// - Si se provee sala y fecha: devuelve TODAS las activas de esa sala/fecha (calendario)
// - Si no: devuelve solo las del usuario autenticado
// - historial=true: devuelve reservas canceladas/completadas (sin límite de sala/fecha)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { sala, fecha, historial } = req.query;
    let where = {};

    // Si se pide el calendario (sala y fecha específicas), mostrar todas las reservas activas
    if (sala && fecha) {
      where.sala = sala;
      where.fecha = fecha;
      where.estado = 'activa';
    } else {
      // Vista personal: solo sus reservas
      where.usuario_id = req.usuario.id;
      if (historial === 'true') {
        where.estado = { [Op.ne]: 'activa' };
      } else {
        where.estado = 'activa';
      }
    }

    const reservas = await Reserva.findAll({
      where,
      include: [{ model: Usuario, as: 'usuario', attributes: ['nombre'] }],
      order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']]
    });
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear reserva (solo si no hay conflicto de horario)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { sala, fecha, hora_inicio, hora_fin, tema } = req.body;

    if (hora_fin <= hora_inicio) {
      return res.status(400).json({ error: 'La hora de fin debe ser posterior a la hora de inicio' });
    }

    // Verificar superposición (semiabierto: [inicio, fin) )
    const conflicto = await Reserva.findOne({
      where: {
        sala,
        fecha,
        estado: 'activa',
        [Op.and]: [
          { hora_inicio: { [Op.lt]: hora_fin } },   // inicio existente < nueva fin
          { hora_fin: { [Op.gt]: hora_inicio } }    // fin existente > nueva inicio
        ]
      }
    });

    if (conflicto) {
      return res.status(409).json({ error: 'Ya hay una reserva en ese horario' });
    }

    const reserva = await Reserva.create({
      sala, fecha, hora_inicio, hora_fin, tema,
      usuario_id: req.usuario.id,
      estado: 'activa'
    });
    res.status(201).json(reserva);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancelar reserva (solo el dueño o admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  const reserva = await Reserva.findByPk(req.params.id);
  if (!reserva) return res.status(404).json({ error: 'No encontrada' });
  if (reserva.usuario_id !== req.usuario.id && req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'No autorizado' });
  }
  await reserva.update({ estado: 'cancelada' });
  res.json({ mensaje: 'Reserva cancelada' });
});

module.exports = router;
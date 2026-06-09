const router = require('express').Router();
const Usuario = require('../models/Usuario');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  const usuarios = await Usuario.findAll({ attributes: ['id', 'nombre', 'email', 'rol'] });
  res.json(usuarios);
});

module.exports = router;
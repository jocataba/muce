const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { authMiddleware } = require('../middleware/auth');
console.log('🔍 Usuario en auth.js:', Usuario ? 'Definido' : 'UNDEFINED');
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const usuario = await Usuario.create({ nombre, email, password, rol: rol || 'operador' });
    res.status(201).json({ id: usuario.id, nombre, email, rol: usuario.rol });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

    console.log('Generando token para:', usuario.id, usuario.nombre, usuario.rol);
    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET || 'clave_secreta',
      { expiresIn: '8h' }
    );
    console.log('Token generado:', token ? 'OK' : 'FALLO');
    const responsePayload = { 
      token, 
      usuario: { 
        id: usuario.id, 
        nombre: usuario.nombre, 
        email: usuario.email, 
        rol: usuario.rol 
      } 
    };
    console.log('Enviando respuesta');
    res.json(responsePayload);
    console.log('Respuesta enviada');
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: error.message });
  }
});
// Cambiar contraseña (requiere autenticación)
router.put('/cambiar-password', authMiddleware, async (req, res) => {
  try {
    const { passwordActual, nuevaPassword } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Verificar contraseña actual
    const valido = await bcrypt.compare(passwordActual, usuario.password);
    if (!valido) return res.status(401).json({ error: 'Contraseña actual incorrecta' });

    // Hashear y guardar nueva contraseña
    usuario.password = await bcrypt.hash(nuevaPassword, 10);
    await usuario.save();

    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
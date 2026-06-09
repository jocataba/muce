const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');
const bcrypt = require('bcrypt');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM('admin', 'operador'), defaultValue: 'operador' },
  telefono: { type: DataTypes.STRING, allowNull: true }   // <-- NUEVO CAMPO
}, {
  hooks: {
    beforeCreate: async (usuario) => {
      usuario.password = await bcrypt.hash(usuario.password, 10);
    }
  }
});
console.log('✅ Modelo Usuario cargado correctamente');
module.exports = Usuario;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Reserva = sequelize.define('Reserva', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  sala: { type: DataTypes.ENUM('Sala 1', 'Sala 2', 'Sala 3', 'Sala 4'), allowNull: false },
  tema: { type: DataTypes.STRING, allowNull: false },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora_inicio: { type: DataTypes.TIME, allowNull: false },
  hora_fin: { type: DataTypes.TIME, allowNull: false },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  estado: { type: DataTypes.ENUM('activa', 'cancelada', 'completada'), defaultValue: 'activa' }
}, {
  timestamps: true,
  tableName: 'reservas'
});

module.exports = Reserva;
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Avance = sequelize.define('Avance', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  compromiso_id: { type: DataTypes.INTEGER, allowNull: false },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  avance_anterior: { type: DataTypes.INTEGER },
  avance_nuevo: { type: DataTypes.INTEGER },
  estado_anterior: { type: DataTypes.STRING },
  estado_nuevo: { type: DataTypes.STRING },
  observacion: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Avance;
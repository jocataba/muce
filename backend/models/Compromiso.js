const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Compromiso = sequelize.define('Compromiso', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  fecha_reunion: { type: DataTypes.DATEONLY, allowNull: false },
  tipo_reunion: {
    type: DataTypes.ENUM('Gabinete', 'Estratégica', 'Ejecutiva', 'Alcalde-Subalcaldes'),
    allowNull: false
  },
  compromiso: { type: DataTypes.TEXT, allowNull: false },
  responsable_id: { type: DataTypes.INTEGER, allowNull: false },
  fecha_compromiso: { type: DataTypes.DATEONLY, allowNull: false },
  fecha_vencimiento: { type: DataTypes.DATEONLY, allowNull: false },
  estado: { type: DataTypes.ENUM('Pendiente','En progreso','Completado','Retrasado','Bloqueado'), defaultValue: 'Pendiente' },
  avance: { type: DataTypes.INTEGER, defaultValue: 0 },
  evidencia: { type: DataTypes.STRING },
  creado_por: { type: DataTypes.INTEGER },
  ultima_actualizacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = Compromiso;
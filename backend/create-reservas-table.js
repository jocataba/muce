// backend/create-reservas-table.js
const { sequelize } = require('./database');

async function createTable() {
  try {
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS Reservas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sala TEXT NOT NULL,
        tema TEXT NOT NULL,
        fecha TEXT NOT NULL,
        hora_inicio TEXT NOT NULL,
        hora_fin TEXT NOT NULL,
        usuario_id INTEGER NOT NULL,
        estado TEXT DEFAULT 'activa',
        createdAt TEXT,
        updatedAt TEXT
      );
    `);
    console.log('✅ Tabla Reservas creada (o ya existía).');
  } catch (error) {
    console.error('❌ Error al crear la tabla:', error.message);
  } finally {
    await sequelize.close();
  }
}

createTable();
const { sequelize } = require('./database');

async function addTelefonoColumn() {
  try {
    // Agregar columna si no existe
    await sequelize.query(`ALTER TABLE Usuarios ADD COLUMN telefono TEXT;`);
    console.log('✅ Columna telefono agregada correctamente');
  } catch (error) {
    if (error.message.includes('duplicate column name')) {
      console.log('⚠️ La columna telefono ya existe');
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await sequelize.close();
  }
}

addTelefonoColumn();
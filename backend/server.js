require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database');

// Importar modelos
const Usuario = require('./models/Usuario');
const Compromiso = require('./models/Compromiso');
const Avance = require('./models/Avance');
 
// Definir asociaciones
 
Compromiso.belongsTo(Usuario, { as: 'responsable', foreignKey: 'responsable_id' });
Usuario.hasMany(Compromiso, { as: 'compromisos', foreignKey: 'responsable_id' });
Avance.belongsTo(Compromiso);
Avance.belongsTo(Usuario);
Compromiso.hasMany(Avance);
 
const app = express();
app.use(cors());
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
const compromisoRoutes = require('./routes/compromisos');
const usuarioRoutes = require('./routes/usuarios');

app.use('/api/auth', authRoutes);
app.use('/api/compromisos', compromisoRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Sincronizar
sequelize.sync({ force: false }).then(() => {
  console.log('Base de datos sincronizada');
  app.listen(5000, () => console.log('Backend escuchando en puerto 5000'));
});

const Reserva = require('./models/Reserva');
Reserva.belongsTo(Usuario, { as: 'usuario', foreignKey: 'usuario_id' });

const reservaRoutes = require('./routes/reservas');
app.use('/api/reservas', reservaRoutes);
 
// backend/crear-usuarios.js
const { sequelize } = require('./database');
const Usuario = require('./models/Usuario');
const bcrypt = require('bcrypt');

// Lista de usuarios (copia los datos de tu tabla)
const usuariosData = [
  { nombre: "Ruben Calle", telefono: "69957440", rol: "operador" },
  { nombre: "Urmia Inquillo", telefono: "77508453", rol: "operador" },
  { nombre: "René Salazar", telefono: "", rol: "operador" },
  { nombre: "Naira Escobari", telefono: "72587952", rol: "operador" },
  { nombre: "Javier Delgadillo", telefono: "72224866", rol: "admin" },
  { nombre: "Liliana Rengifo", telefono: "75252111", rol: "operador" },
  { nombre: "Raul Moreno", telefono: "76205961", rol: "operador" },
  { nombre: "Bernardo Vargas", telefono: "69767152", rol: "operador" },
  { nombre: "Heriberto Hermosa", telefono: "72039443", rol: "operador" },
  { nombre: "Reynaldo Vargas", telefono: "77550577", rol: "operador" },
  { nombre: "Renán Huanca", telefono: "77719995", rol: "operador" },
  { nombre: "Lenny Cáceres", telefono: "75204957", rol: "operador" },
  { nombre: "Cinthya Gonzales", telefono: "69994000", rol: "operador" },
  { nombre: "Rosángela Prieto", telefono: "78033464", rol: "operador" },
  { nombre: "Erick Sichori", telefono: "73019259", rol: "operador" },
  { nombre: "Jose Luis Zavala", telefono: "78899116", rol: "operador" },
  { nombre: "Mirna Zelaya", telefono: "75233482", rol: "operador" },
  { nombre: "Roberto Alba", telefono: "", rol: "operador" },
  { nombre: "Neil Navarro", telefono: "77738728", rol: "operador" },
  { nombre: "David Yujra", telefono: "", rol: "operador" },
  { nombre: "Mariana Paredes", telefono: "73009388", rol: "operador" },
  { nombre: "Willy Carrillo", telefono: "71978188", rol: "operador" },
  { nombre: "Edwin Alcon", telefono: "67064180", rol: "operador" },
  { nombre: "Rodolfo Perales", telefono: "76253320", rol: "operador" },
  { nombre: "Julio Yapuchura", telefono: "72759889", rol: "operador" },
  { nombre: "Ronald Guzmán", telefono: "73256718", rol: "operador" },
  { nombre: "Fabián Castro", telefono: "72017171", rol: "operador" },
  { nombre: "Vladimir Magne", telefono: "", rol: "operador" },
  { nombre: "Juana Villca", telefono: "70125277", rol: "operador" },
  { nombre: "Edwin Yujra", telefono: "75230297", rol: "operador" },
  { nombre: "Ivan Contreras", telefono: "70671118", rol: "operador" },
  { nombre: "Eduardo Burgoa", telefono: "71538848", rol: "operador" },
  { nombre: "Guillermo Jimenez", telefono: "72000963", rol: "operador" },
  { nombre: "Wilma Chávez", telefono: "", rol: "operador" },
  { nombre: "Javier Calderon", telefono: "77233926", rol: "operador" },
  { nombre: "Alicia Estrada", telefono: "79606572", rol: "operador" },
  { nombre: "Dorian Ayala", telefono: "75884594", rol: "operador" },
  { nombre: "Jorge Nolasco", telefono: "72008394", rol: "operador" },
  { nombre: "Juan Carlos Ramos Ticona", telefono: "77203777", rol: "operador" },
  { nombre: "Alex Altuzarra", telefono: "", rol: "operador" },
  { nombre: "Cesar Peralta", telefono: "76761737", rol: "operador" },
  { nombre: "Héctor Guzmán", telefono: "", rol: "operador" },
  { nombre: "Ramiro Narvaez", telefono: "76736660", rol: "operador" },
  { nombre: "Miriam Parada", telefono: "77267660", rol: "operador" },
  { nombre: "Valdemar Mollo", telefono: "72041410", rol: "operador" },
  { nombre: "Guillermo Castro", telefono: "72543693", rol: "operador" },
  { nombre: "Mikaela Gonzales", telefono: "78885398", rol: "operador" },
  { nombre: "Igor Ramírez", telefono: "76207200", rol: "operador" },
  { nombre: "Alfredo Gutiérrez", telefono: "79621976", rol: "operador" },
  { nombre: "Antonio Costas", telefono: "69915391", rol: "operador" },
  { nombre: "Karina Medinacelli", telefono: "72586044", rol: "operador" },
  { nombre: "Gonzalo Germán Vargas Yevara", telefono: "77555511", rol: "operador" },
  { nombre: "Julio Espinoza", telefono: "72519660", rol: "operador" },
  { nombre: "Aurea Balderrama", telefono: "72413278", rol: "operador" },
  { nombre: "Alejandro Bleichner", telefono: "74080753", rol: "operador" },
  { nombre: "Carmen Laguna", telefono: "70631258", rol: "operador" },
  { nombre: "Yolanda Limachi", telefono: "73074535", rol: "operador" },
  { nombre: "Jaime Arias", telefono: "72066546", rol: "operador" },
  { nombre: "Mijael Flores", telefono: "73090998", rol: "operador" },
  { nombre: "Fernando Silva", telefono: "77232781", rol: "operador" },
  { nombre: "Marynes Salazar", telefono: "70594342", rol: "operador" },
  { nombre: "Pamela Aliaga", telefono: "65658380", rol: "operador" },
  { nombre: "Alejandra Pari", telefono: "", rol: "operador" },
  { nombre: "Lizeth Zambrana", telefono: "77713110", rol: "operador" },
  { nombre: "Monserrat Chumacero", telefono: "60157017", rol: "operador" },
  { nombre: "Alan García", telefono: "72597437", rol: "operador" },
  { nombre: "Natalia Peñaranda", telefono: "72503392", rol: "operador" },
  { nombre: "Bianca Salazar", telefono: "70587617", rol: "operador" },
  { nombre: "Joel Montaño", telefono: "72029598", rol: "operador" },
  { nombre: "Katerine Acosta", telefono: "", rol: "operador" },
  { nombre: "Mauricio Rocabado", telefono: "", rol: "operador" },
  { nombre: "Carmen Almendras", telefono: "75813925", rol: "operador" },
  { nombre: "Helen Canqui", telefono: "72577041", rol: "operador" },
  { nombre: "Diego Cabrera", telefono: "74911299", rol: "operador" },
  { nombre: "Viviana Vanessa Villca", telefono: "69715800", rol: "operador" },
  { nombre: "Francisco Bueno", telefono: "73057063", rol: "operador" },
  { nombre: "Tatiana Soza", telefono: "77211155", rol: "operador" },
  { nombre: "Ana Vega", telefono: "76722816", rol: "operador" },
  { nombre: "Brian Decker", telefono: "75811329", rol: "operador" },
  { nombre: "Sergio Altamirano", telefono: "", rol: "operador" },
  { nombre: "Álvaro Viaña", telefono: "74906661", rol: "operador" },
  { nombre: "Bonny Morales", telefono: "72006011", rol: "operador" },
  { nombre: "Oswaldo Calderón", telefono: "79670777", rol: "operador" },
  { nombre: "Susana Sanabria", telefono: "70559456", rol: "operador" },
  { nombre: "Magaly Montaño", telefono: "70556876", rol: "operador" },
  { nombre: "Lourdes Paredes", telefono: "70676172", rol: "operador" },
  { nombre: "Vladimir Toro", telefono: "72017152", rol: "operador" },
  { nombre: "Juan Taboada", telefono: "74275758", rol: "operador" },
  { nombre: "David Mollinedo", telefono: "69701513", rol: "operador" },
  { nombre: "Javier Pacheco", telefono: "71526680", rol: "operador" },
  { nombre: "Solangel Murillo", telefono: "71538698", rol: "operador" },
  { nombre: "Jaime Tinini", telefono: "72017150", rol: "operador" },
  { nombre: "Andrés Belzu", telefono: "73072628", rol: "operador" },
  { nombre: "German Guaiwa", telefono: "79102197", rol: "operador" },
  { nombre: "Mauricio Álvarez", telefono: "", rol: "operador" },
  { nombre: "Ramiro Flores", telefono: "76241221", rol: "operador" },
  { nombre: "Iván Revollo", telefono: "70506039", rol: "operador" },
  { nombre: "Iván Soliz", telefono: "71960826", rol: "operador" },
  { nombre: "Claudia Mendoza", telefono: "72528406", rol: "operador" },
  { nombre: "Franz Choque", telefono: "", rol: "operador" },
  { nombre: "Víctor Hugo Villarreal", telefono: "70119420", rol: "operador" },
  { nombre: "Lizeth Revollo", telefono: "", rol: "operador" },
  { nombre: "Iván Zambrana", telefono: "72502257", rol: "operador" },
  { nombre: "Dennis Méndez", telefono: "79606572", rol: "operador" },
  { nombre: "Edwin Mayta", telefono: "73717062", rol: "operador" },
  { nombre: "Erik Ticona", telefono: "70672219", rol: "operador" },
  { nombre: "Raúl Bustillos", telefono: "74366151", rol: "operador" },
  { nombre: "Wálter Aranda", telefono: "68062306", rol: "operador" },
  { nombre: "Javier Rodriguez", telefono: "77747037", rol: "operador" },
  { nombre: "Carola Fortún", telefono: "70141700", rol: "operador" },
  { nombre: "Janeth Flores", telefono: "72028108", rol: "operador" },
  { nombre: "Isabel Vera", telefono: "72068655", rol: "operador" },
  { nombre: "Omar Quispe", telefono: "71298460", rol: "operador" },
  { nombre: "Rubén Lima", telefono: "", rol: "operador" },
  { nombre: "Yecid Medrano", telefono: "79606206", rol: "operador" },
  { nombre: "Fabiana Flores", telefono: "", rol: "operador" },
  { nombre: "Miguel Ruescas", telefono: "77504904", rol: "operador" },
  { nombre: "Leonardo Blanco", telefono: "71962060", rol: "operador" },
  { nombre: "Katherine Campos", telefono: "70656110", rol: "operador" },
  { nombre: "Giovanni Guerrero", telefono: "78345670", rol: "operador" },
  { nombre: "Hugo Ferrufino", telefono: "76269000", rol: "operador" },
  { nombre: "Jose Luis Mariaca", telefono: "77231370", rol: "operador" },
  { nombre: "Cristian Molina", telefono: "78797013", rol: "operador" },
  { nombre: "Leonidas Poma", telefono: "72587846", rol: "operador" }
];

// Función para normalizar nombre y crear email
function crearEmail(nombreCompleto) {
  // Eliminar tildes y caracteres especiales
  const sinTildes = nombreCompleto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Separar nombre y apellido (tomamos primera palabra y última palabra)
  const partes = sinTildes.trim().toLowerCase().split(/\s+/);
  let nombre = partes[0];
  let apellido = partes[partes.length - 1];
  // Casos especiales: nombres con dos apellidos o "de", "del", etc. Se puede ajustar manualmente
  // Para simplificar, uniremos nombre y último apellido con punto
  const email = `${nombre}.${apellido}@lapaz.gob.bo`;
  return email;
}

// Contraseña por defecto (puedes cambiarla)
const DEFAULT_PASSWORD = "123456";

async function crearUsuarios() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la base de datos");

    let creados = 0;
    let errores = 0;

    for (const usuario of usuariosData) {
      const email = crearEmail(usuario.nombre);
      const telefono = usuario.telefono ? usuario.telefono : null;
      const rol = usuario.rol;

      try {
        // Verificar si ya existe
        const existe = await Usuario.findOne({ where: { email } });
        if (existe) {
          console.log(`⚠️ Usuario ya existe: ${email}`);
          continue;
        }

        // Crear usuario
        await Usuario.create({
          nombre: usuario.nombre,
          email: email,
          password: DEFAULT_PASSWORD,
          rol: rol,
          telefono: telefono
        });
        console.log(`✅ Creado: ${email} (${usuario.nombre})`);
        creados++;
      } catch (error) {
        console.error(`❌ Error con ${usuario.nombre}:`, error.message);
        errores++;
      }
    }

    console.log(`\n📊 Resumen: ${creados} usuarios creados, ${errores} errores.`);
    await sequelize.close();
  } catch (error) {
    console.error("Error de conexión:", error);
  }
}

crearUsuarios();
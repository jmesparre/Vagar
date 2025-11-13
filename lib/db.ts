import mysql from 'mysql2/promise';

// Crear un pool de conexiones.
// El pool gestiona múltiples conexiones, lo que es más eficiente
// que crear una nueva conexión para cada consulta.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: 'Z', // Forzar UTC
});

export default pool;

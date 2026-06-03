import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

export async function connectDatabase() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'photobackup_logs',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+00:00',
  });

  await pool.getConnection();
  console.log('Conectado a MySQL');
  return pool;
}

export function getPool() {
  if (!pool) {
    throw new Error('Base de datos no inicializada');
  }
  return pool;
}

import mysql from 'mysql2/promise';
import { env } from './env';

// Crear el Pool de Conexiones de MySQL (InnoDB)
export const pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

/**
 * Función para verificar la conexión a MySQL durante el arranque
 */
export async function testDbConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ [MySQL] Conexión establecida exitosamente con la base de datos "${env.DB_NAME}" (${env.DB_HOST}:${env.DB_PORT})`);
    connection.release();
    return true;
  } catch (error: any) {
    console.warn(`⚠️ [MySQL] No se pudo conectar a MySQL: ${error.message}`);
    console.warn(`ℹ️ Recuerda verificar que el servicio MySQL esté iniciado y que hayas importado "schema.sql" y "seeds.sql".`);
    return false;
  }
}

import dotenv from 'dotenv';
import path from 'path';

// Carga las variables del archivo .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Base de datos MySQL
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: Number(process.env.DB_PORT) || 3306,
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'guineval_db',

  // Autenticación JWT
  JWT_SECRET: process.env.JWT_SECRET || 'guineval_jwt_default_secret_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Contactos Guineval
  COMPANY_WHATSAPP_ES: process.env.COMPANY_WHATSAPP_ES || '+34661532115',
  COMPANY_WHATSAPP_GQ: process.env.COMPANY_WHATSAPP_GQ || '+240222271440',
  COMPANY_EMAIL: process.env.COMPANY_EMAIL || 'daniel.alonso@exportacionesguineval.com',
};

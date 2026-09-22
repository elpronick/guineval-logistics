import app from './app';
import { env } from './config/env';
import { testDbConnection } from './config/database';

async function startServer() {
  console.log('\n======================================================');
  console.log('🚀 Iniciando Servidor Backend: Exportaciones Guineval');
  console.log('======================================================');

  // Verificar estado de conexión con MySQL
  await testDbConnection();

  // Iniciar escucha del servidor HTTP
  app.listen(env.PORT, () => {
    console.log(`\n🌍 Servidor activo en: http://localhost:${env.PORT}`);
    console.log(`🩺 Health Check:       http://localhost:${env.PORT}/api/health`);
    console.log(`📦 Tracking API:       http://localhost:${env.PORT}/api/tracking/GNV-ES-2026-001`);
    console.log(`🧮 Cotizador API:      http://localhost:${env.PORT}/api/quotes/calculate`);
    console.log(`🏢 Sedes API:          http://localhost:${env.PORT}/api/warehouses`);
    console.log('======================================================\n');
  });
}

startServer().catch((err) => {
  console.error('❌ Error fatal al iniciar el servidor:', err);
  process.exit(1);
});

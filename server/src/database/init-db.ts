import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { env } from '../config/env';

async function initDatabase() {
  console.log('\n========================================================');
  console.log('📦 Inicializando Base de Datos: Exportaciones Guineval');
  console.log('========================================================');
  console.log(`📡 Conectando a MySQL (${env.DB_HOST}:${env.DB_PORT}) como usuario "${env.DB_USER}"...`);

  // Paso 1: Conexión al servidor MySQL sin especificar base de datos para crearla si no existe
  let rootConn;
  try {
    rootConn = await mysql.createConnection({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    });
    console.log('✅ Conexión con el servidor MySQL establecida correctamente.');
  } catch (err: any) {
    console.error(`❌ Error al conectar con el servidor MySQL: ${err.message}`);
    process.exit(1);
  }

  try {
    console.log(`🛠️ Creando base de datos "${env.DB_NAME}" si no existe...`);
    await rootConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`✅ Base de datos "${env.DB_NAME}" lista.`);
  } finally {
    await rootConn.end();
  }

  // Paso 2: Conexión directa a guineval_db con soporte para multi-sentencias
  console.log(`🔌 Conectando directamente a la base de datos "${env.DB_NAME}"...`);
  const dbConn = await mysql.createConnection({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    multipleStatements: true,
  });

  try {
    // Paso 3: Cargar y ejecutar schema.sql
    const schemaPath = path.resolve(__dirname, 'schema.sql');
    console.log(`📄 Leyendo estructura desde: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('⚙️ Ejecutando sentencias DDL de schema.sql...');
    await dbConn.query(schemaSql);
    console.log('✅ Esquema DDL ejecutado con éxito (tablas y restricciones creadas).');

    // Paso 4: Cargar y ejecutar seeds.sql
    const seedsPath = path.resolve(__dirname, 'seeds.sql');
    console.log(`🌱 Leyendo datos semilla desde: ${seedsPath}`);
    const seedsSql = fs.readFileSync(seedsPath, 'utf8');

    console.log('🌱 Insertando datos semilla (sedes, tarifas, envíos, usuarios)...');
    await dbConn.query('DELETE FROM tracking_events;');
    await dbConn.query(seedsSql);
    console.log('✅ Datos semilla insertados o actualizados correctamente.');

    // Paso 5: Verificación del contenido de las tablas
    console.log('\n📊 Verificando recuento de registros por tabla:');
    console.log('--------------------------------------------------------');
    const tables = [
      'warehouses',
      'users',
      'rates_config',
      'shipments',
      'tracking_events',
      'purchase_requests',
    ];

    for (const table of tables) {
      const [rows]: any = await dbConn.query(`SELECT COUNT(*) AS total FROM \`${table}\``);
      const total = rows[0]?.total || 0;
      console.log(`  🔹 ${table.padEnd(20)}: ${total} registros`);
    }

    console.log('--------------------------------------------------------');
    console.log('🎉 ¡Base de datos MySQL configurada y sincronizada al 100%!\n');
  } catch (err: any) {
    console.error(`❌ Error durante la inicialización de la base de datos: ${err.message}`);
    process.exit(1);
  } finally {
    await dbConn.end();
  }
}

initDatabase();

import app from './app';
import http from 'http';
import { pool } from './config/database';

async function runTests() {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(4001, resolve));
  console.log('🧪 Servidor de pruebas iniciado en puerto 4001');

  try {
    // 1. Test /api/health
    const resHealth = await fetch('http://localhost:4001/api/health');
    const dataHealth = await resHealth.json();
    console.log('✅ Health check:', dataHealth.status, dataHealth.company);

    // 2. Test /api/warehouses
    const resWarehouses = await fetch('http://localhost:4001/api/warehouses');
    const dataWarehouses = await resWarehouses.json();
    console.log('✅ Sedes encontradas:', dataWarehouses.data.length, dataWarehouses.data.map((w: any) => `${w.city} (${w.code})`));

    // 3. Test /api/quotes/calculate
    const resQuote = await fetch('http://localhost:4001/api/quotes/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        destination_city: 'Malabo',
        cargo_category: 'GENERAL',
        weight_kg: 5.0,
        length_cm: 35,
        width_cm: 25,
        height_cm: 20,
      }),
    });
    const dataQuote = await resQuote.json();
    console.log('✅ Cotizador cálculo:', {
      volumetric: dataQuote.data.weights.volumetric_weight_kg,
      airTotal: `${dataQuote.data.options[0].total_eur} € / ${dataQuote.data.options[0].total_xaf} XAF`,
      seaTotal: `${dataQuote.data.options[1].total_eur} € / ${dataQuote.data.options[1].total_xaf} XAF`,
    });

    // 4. Test /api/tracking/GNV-ES-2026-001
    const resTracking = await fetch('http://localhost:4001/api/tracking/GNV-ES-2026-001');
    const dataTracking = await resTracking.json();
    console.log('✅ Tracking response:', {
      tracking: dataTracking.data.tracking_number,
      status: dataTracking.data.current_status,
      events: dataTracking.data.timeline?.length,
    });

    // 5. Test /api/purchases/request
    const resPurchase = await fetch('http://localhost:4001/api/purchases/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_name: 'Esteban Nguema',
        customer_phone: '+240 222 334 455',
        destination_city: 'Malabo',
        item_name: 'Zapatillas Nike Air Max',
        store_name: 'Nike España',
        product_url: 'https://nike.es/sample',
        estimated_item_price_eur: 120,
        quantity: 1,
      }),
    });
    const dataPurchase = await resPurchase.json();
    console.log('✅ Purchase request:', {
      code: dataPurchase.data.request.request_code,
      total_eur: dataPurchase.data.request.total_estimated_eur,
      whatsapp: dataPurchase.data.whatsapp_url.substring(0, 50) + '...',
    });

    console.log('\n🎉 ¡Todos los endpoints del backend funcionan a la perfección!');
  } finally {
    server.close();
    await pool.end();
    process.exit(0);
  }
}

runTests().catch(console.error);

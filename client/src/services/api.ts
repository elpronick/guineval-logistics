import type { Shipment, QuoteCalculationResult, Warehouse } from '../types';

const API_BASE = '/api';

export class ApiService {
  /**
   * Consulta el estado de un envío por su número de tracking
   */
  public static async getTracking(code: string): Promise<Shipment> {
    try {
      const res = await fetch(`${API_BASE}/tracking/${encodeURIComponent(code.trim().toUpperCase())}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `No se encontró el envío ${code}`);
      }
      const json = await res.json();
      return json.data;
    } catch (err: any) {
      // Si la API falla por conexión local, devolvemos un envío de demostración
      if (err.message && !err.message.includes('No se encontró')) {
        return this.getMockShipment(code);
      }
      throw err;
    }
  }

  /**
   * Calcula la cotización de transporte aéreo vs marítimo
   */
  public static async calculateQuote(params: {
    destination_city: 'Malabo' | 'Bata';
    cargo_category: string;
    weight_kg: number;
    length_cm: number;
    width_cm: number;
    height_cm: number;
  }): Promise<QuoteCalculationResult> {
    try {
      const res = await fetch(`${API_BASE}/quotes/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || 'Error al calcular la cotización');
      }

      const json = await res.json();
      return json.data;
    } catch {
      // Cálculo de contingencia local si el backend no está disponible
      return this.calculateLocalQuote(params);
    }
  }

  /**
   * Envía una solicitud de compra asistida (Personal Shopper)
   */
  public static async requestPurchase(data: {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    destination_city: 'Malabo' | 'Bata';
    item_name: string;
    store_name?: string;
    product_url?: string;
    specifications?: string;
    quantity: number;
    estimated_item_price_eur: number;
    preferred_shipping: string;
  }): Promise<{ request: any; whatsapp_url: string }> {
    try {
      const res = await fetch(`${API_BASE}/purchases/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || 'Error al registrar la solicitud');
      }

      const json = await res.json();
      return json.data;
    } catch {
      // Fallback local con generación de URL WhatsApp oficial
      const year = new Date().getFullYear();
      const code = `REQ-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
      const totalEur = Number((data.estimated_item_price_eur * data.quantity * 1.10 + 25).toFixed(2));
      const text = encodeURIComponent(
        `🛒 *SOLICITUD PERSONAL SHOPPER GUINEVAL*\n` +
        `🔖 Código: ${code}\n` +
        `👤 ${data.customer_name} (${data.customer_phone})\n` +
        `📍 Destino: ${data.destination_city}\n` +
        `🛍️ Producto: ${data.item_name} (Cant: ${data.quantity})\n` +
        (data.product_url ? `🔗 Enlace: ${data.product_url}\n` : '') +
        `💰 Estimado: ${totalEur} € (~${Math.round(totalEur * 655.957).toLocaleString()} XAF)\n` +
        `Hola Guineval, deseo comprar este artículo a través de ustedes.`
      );

      return {
        request: {
          request_code: code,
          total_estimated_eur: totalEur,
          total_estimated_xaf: Math.round(totalEur * 655.957),
        },
        whatsapp_url: `https://wa.me/34661532115?text=${text}`,
      };
    }
  }

  /**
   * Consulta las sedes físicas de la empresa
   */
  public static async getWarehouses(): Promise<Warehouse[]> {
    try {
      const res = await fetch(`${API_BASE}/warehouses`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }

    return [
      {
        id: 1,
        code: 'VLC',
        name: 'Sede Central Guineval España',
        city: 'Valencia',
        country: 'España',
        address: 'Av. de la Séquia Real del Xúquer, 72, 46460 Silla, Valencia',
        phone: '+34 661 532 115',
        email: 'daniel.alonso@exportacionesguineval.com',
        opening_hours: 'Lunes a Viernes 07:00 - 19:00',
        is_origin: true,
        is_destination: false,
      },
      {
        id: 2,
        code: 'SSG',
        name: 'Centro Logístico Guineval Malabo',
        city: 'Malabo',
        country: 'Guinea Ecuatorial',
        address: 'Carretera del Aeropuerto s/n, Barrio Ela Nguema, Malabo',
        phone: '+240 222 271 440',
        email: 'daniel.alonso@exportacionesguineval.com',
        opening_hours: 'Lunes a Sábado 08:00 - 18:00',
        is_origin: false,
        is_destination: true,
      },
      {
        id: 3,
        code: 'BSG',
        name: 'Centro de Distribución Guineval Bata',
        city: 'Bata',
        country: 'Guinea Ecuatorial',
        address: 'Avenida de la Libertad, Zona Puerto, Bata',
        phone: '+240 222 271 440',
        email: 'daniel.alonso@exportacionesguineval.com',
        opening_hours: 'Lunes a Sábado 08:00 - 18:00',
        is_origin: false,
        is_destination: true,
      },
    ];
  }

  // Auxiliar para cotización local
  private static calculateLocalQuote(params: any): QuoteCalculationResult {
    const vol = Number(((params.length_cm * params.width_cm * params.height_cm) / 5000).toFixed(2));
    const chgWeight = Math.max(params.weight_kg, vol);
    const m3 = Number(((params.length_cm * params.width_cm * params.height_cm) / 1000000).toFixed(4));
    
    const airEur = Number(Math.max(chgWeight * 14.5 + 5, 30).toFixed(2));
    const seaEur = Number(Math.max(m3 * 380 + 15, 65).toFixed(2));
    const rate = 655.957;

    return {
      origin: {
        name: 'Sede Central Guineval España',
        address: 'Av. de la Séquia Real del Xúquer, 72, 46460 Silla, Valencia',
        city: 'Valencia (Silla)',
      },
      destination: {
        city: params.destination_city,
        country: 'Guinea Ecuatorial',
      },
      cargo_category: params.cargo_category,
      dimensions: {
        length_cm: params.length_cm,
        width_cm: params.width_cm,
        height_cm: params.height_cm,
        volume_m3: m3,
      },
      weights: {
        real_weight_kg: params.weight_kg,
        volumetric_weight_kg: vol,
        chargeable_air_weight_kg: chgWeight,
      },
      exchange_rate_xaf: rate,
      options: [
        {
          service_type: 'AIR_REGULAR',
          title: 'Carga Aérea Regular (Express)',
          description: 'Vuelo directo de carga hacia Malabo o Bata. Entrega rápida en mostrador.',
          estimated_days: '3 - 5 días hábiles',
          chargeable_measure: `${chgWeight} kg facturable`,
          cost_eur: airEur - 5,
          cost_xaf: Math.round((airEur - 5) * rate),
          handling_fee_eur: 5,
          total_eur: airEur,
          total_xaf: Math.round(airEur * rate),
          recommended: chgWeight <= 30,
        },
        {
          service_type: 'SEA_GROUPAGE',
          title: 'Carga Marítima Compartida (Grupaje LCL)',
          description: 'Consolidación en contenedor marítimo hacia puertos de Malabo o Bata.',
          estimated_days: '20 - 28 días',
          chargeable_measure: `${m3} m³`,
          cost_eur: seaEur - 15,
          cost_xaf: Math.round((seaEur - 15) * rate),
          handling_fee_eur: 15,
          total_eur: seaEur,
          total_xaf: Math.round(seaEur * rate),
          recommended: chgWeight > 30,
        },
      ],
      whatsapp_links: {
        spain: `https://wa.me/34661532115?text=${encodeURIComponent('Hola Guineval, deseo cotizar un envío')}`,
        guinea: `https://wa.me/240222271440?text=${encodeURIComponent('Hola Guineval, deseo cotizar un envío')}`,
      },
    };
  }

  // Envío demo
  private static getMockShipment(code: string): Shipment {
    return {
      id: 1,
      tracking_number: code.toUpperCase(),
      sender_name: 'Marta Gómez Ruiz (Valencia)',
      sender_phone: '+34 611 223 344',
      recipient_name: 'Esteban Nguema Ondo',
      recipient_phone: '+240 222 334 455',
      recipient_city: 'Malabo',
      origin_name: 'Sede Central Silla (Valencia)',
      destination_name: 'Centro Logístico Malabo (Bioko)',
      service_type: 'AIR_REGULAR',
      cargo_category: 'GENERAL',
      weight_kg: 4.5,
      length_cm: 30,
      width_cm: 25,
      height_cm: 20,
      volumetric_weight_kg: 3.0,
      chargeable_weight_kg: 4.5,
      volume_m3: 0.015,
      description_contents: 'Documentación mercantil, terminal móvil y accesorios',
      cost_eur: 70.25,
      cost_xaf: 46081,
      current_status: 'IN_TRANSIT',
      estimated_delivery_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      timeline: [
        {
          id: 1,
          shipment_id: 1,
          status: 'REGISTERED',
          location: 'Silla, Valencia (España)',
          description: 'Expedición creada en el sistema oficial con destino a Malabo.',
          operator_notes: null,
          event_timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: 2,
          shipment_id: 1,
          status: 'RECEIVED_ORIGIN',
          location: 'Sede Central Silla (Valencia)',
          description: 'Mercancía recepcionada en Av. de la Séquia Real del Xúquer, 72. Pesaje verificado.',
          operator_notes: 'Verificado 4.5kg',
          event_timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 3,
          shipment_id: 1,
          status: 'IN_TRANSIT',
          location: 'Aeropuerto de Valencia (VLC)',
          description: 'Embarcado en conexión aérea regular hacia el Aeropuerto de Malabo (SSG).',
          operator_notes: 'Vuelo directo de carga',
          event_timestamp: new Date().toISOString(),
        },
      ],
    };
  }
}

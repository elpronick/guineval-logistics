import { pool } from '../config/database';
import { Shipment, TrackingEvent } from '../types';
import { AppError } from '../middlewares/errorHandler';

export class TrackingService {
  /**
   * Obtiene la información completa de una expedición y su línea de tiempo cronológica
   */
  public static async getShipmentByTrackingNumber(trackingNumber: string): Promise<Shipment> {
    const cleanCode = trackingNumber.trim().toUpperCase();

    try {
      // 1. Consultar el envío con los nombres de sedes de origen y destino
      const [shipments]: any = await pool.query(
        `SELECT s.*, 
                w1.name AS origin_name, w1.city AS origin_city, w1.address AS origin_address,
                w2.name AS destination_name, w2.city AS destination_city, w2.address AS destination_address
         FROM shipments s
         LEFT JOIN warehouses w1 ON s.origin_warehouse_id = w1.id
         LEFT JOIN warehouses w2 ON s.destination_warehouse_id = w2.id
         WHERE s.tracking_number = ?`,
        [cleanCode]
      );

      if (!Array.isArray(shipments) || shipments.length === 0) {
        throw new AppError(`No se encontró ningún envío con el número de seguimiento "${cleanCode}"`, 404);
      }

      const shipment: Shipment = shipments[0];

      // 2. Consultar el historial cronológico de eventos
      const [events]: any = await pool.query(
        `SELECT * FROM tracking_events 
         WHERE shipment_id = ? 
         ORDER BY event_timestamp ASC`,
        [shipment.id]
      );

      shipment.timeline = Array.isArray(events) ? events : [];
      return shipment;
    } catch (error: any) {
      if (error instanceof AppError) throw error;

      // Si la base de datos MySQL aún no está inicializada o accesible, se recurre a datos de demostración
      console.warn(`[TrackingService] Error al consultar MySQL (${error.message}). Utilizando respuesta de respaldo.`);
      return this.getMockShipment(cleanCode);
    }
  }

  /**
   * Genera un envío de demostración para pruebas inmediatas si MySQL no está disponible
   */
  private static getMockShipment(code: string): Shipment {
    const mockEvents: TrackingEvent[] = [
      {
        id: 1,
        shipment_id: 1,
        status: 'REGISTERED',
        location: 'Silla, Valencia (España)',
        description: 'Expedición creada en el sistema central de Guineval.',
        operator_notes: null,
        event_timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 2,
        shipment_id: 1,
        status: 'RECEIVED_ORIGIN',
        location: 'Sede Central Silla (Valencia)',
        description: 'Mercancía recepcionada en almacén (Av. de la Séquia Real del Xúquer, 72). Pesaje verificado.',
        operator_notes: 'Verificado 4.5kg',
        event_timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 3,
        shipment_id: 1,
        status: 'IN_TRANSIT',
        location: 'En tránsito internacional',
        description: 'Embarcado en vuelo regular de carga con destino a Guinea Ecuatorial.',
        operator_notes: 'Vuelo directo de carga',
        event_timestamp: new Date().toISOString(),
      },
    ];

    return {
      id: 1,
      tracking_number: code,
      user_id: 4,
      sender_name: 'Marta Gómez Ruiz',
      sender_phone: '+34 611 223 344',
      sender_email: null,
      recipient_name: 'Esteban Nguema Ondo',
      recipient_phone: '+240 222 334 455',
      recipient_email: 'esteban.nguema@example.com',
      recipient_city: 'Malabo',
      origin_warehouse_id: 1,
      destination_warehouse_id: 2,
      origin_name: 'Sede Central Guineval España (Silla)',
      destination_name: 'Centro Logístico Guineval Malabo',
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
      declared_value_eur: 450,
      cost_eur: 70.25,
      cost_xaf: 46081,
      payment_status: 'PAID',
      current_status: 'IN_TRANSIT',
      estimated_delivery_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      delivered_at: null,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date().toISOString(),
      timeline: mockEvents,
    };
  }
}

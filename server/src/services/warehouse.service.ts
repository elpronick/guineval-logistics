import { pool } from '../config/database';
import { Warehouse } from '../types';

export class WarehouseService {
  /**
   * Obtiene la lista de sedes y centros de distribución activos
   */
  public static async getAllWarehouses(): Promise<Warehouse[]> {
    try {
      const [rows]: any = await pool.query(
        'SELECT * FROM warehouses WHERE is_active = TRUE ORDER BY is_origin DESC, id ASC'
      );
      if (Array.isArray(rows) && rows.length > 0) {
        return rows.map((w: any) => ({
          ...w,
          is_origin: Boolean(w.is_origin),
          is_destination: Boolean(w.is_destination),
          is_active: Boolean(w.is_active),
        }));
      }
    } catch {
      // Fallback estático con datos oficiales en caso de que MySQL no esté iniciado
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
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  }
}

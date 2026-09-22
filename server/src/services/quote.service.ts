import { DestinationCity, CargoCategory, QuoteCalculationResult, QuoteOption } from '../types';
import { env } from '../config/env';
import { pool } from '../config/database';

export interface CalculateQuoteInput {
  origin_city?: string;
  destination_city: DestinationCity;
  cargo_category: CargoCategory;
  weight_kg: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  declared_value_eur?: number;
}

export class QuoteService {
  /**
   * Calcula el presupuesto de envío (Aéreo vs Marítimo) en EUR y XAF
   */
  public static async calculate(input: CalculateQuoteInput): Promise<QuoteCalculationResult> {
    const {
      destination_city,
      cargo_category = 'GENERAL',
      weight_kg,
      length_cm,
      width_cm,
      height_cm,
    } = input;

    // 1. Fórmulas oficiales de cubicaje y volumetría (IATA)
    // Peso volumétrico = (Largo x Ancho x Alto) / 5000
    const volumetric_weight_kg = Number(((length_cm * width_cm * height_cm) / 5000).toFixed(2));
    
    // Peso facturable aéreo = mayor entre peso real y peso volumétrico
    const chargeable_air_weight_kg = Number(Math.max(weight_kg, volumetric_weight_kg).toFixed(2));
    
    // Volumen en metros cúbicos para transporte marítimo = (L x W x H) / 1.000.000
    const volume_m3 = Number(((length_cm * width_cm * height_cm) / 1000000).toFixed(4));

    // 2. Obtener tarifas de la base de datos o usar tarifas oficiales por defecto
    let airPricePerKg = 14.50;
    let airMinCharge = 25.00;
    let airHandlingFee = 5.00;

    let seaGroupagePricePerM3 = 380.00;
    let seaMinCharge = 50.00;
    let seaHandlingFee = 15.00;

    let xafRate = 655.9570; // Paridad oficial Franco CFA

    try {
      const [rows]: any = await pool.query(
        'SELECT service_type, price_per_unit_eur, minimum_charge_eur, handling_fee_eur, eur_to_xaf_rate FROM rates_config WHERE is_active = TRUE'
      );
      if (Array.isArray(rows) && rows.length > 0) {
        const air = rows.find((r: any) => r.service_type === 'AIR_REGULAR');
        if (air) {
          airPricePerKg = Number(air.price_per_unit_eur);
          airMinCharge = Number(air.minimum_charge_eur);
          airHandlingFee = Number(air.handling_fee_eur);
          xafRate = Number(air.eur_to_xaf_rate);
        }
        const sea = rows.find((r: any) => r.service_type === 'SEA_GROUPAGE');
        if (sea) {
          seaGroupagePricePerM3 = Number(sea.price_per_unit_eur);
          seaMinCharge = Number(sea.minimum_charge_eur);
          seaHandlingFee = Number(sea.handling_fee_eur);
        }
      }
    } catch {
      // Si la base de datos no está disponible, se utilizan los valores calculados seguros
    }

    // 3. Cálculos económicos: Opción Aérea Regular
    const airBaseCost = Math.max(chargeable_air_weight_kg * airPricePerKg, airMinCharge);
    const airTotalEur = Number((airBaseCost + airHandlingFee).toFixed(2));
    const airTotalXaf = Math.round(airTotalEur * xafRate);

    // 4. Cálculos económicos: Opción Marítima en Grupaje (LCL)
    const seaBaseCost = Math.max(volume_m3 * seaGroupagePricePerM3, seaMinCharge);
    const seaTotalEur = Number((seaBaseCost + seaHandlingFee).toFixed(2));
    const seaTotalXaf = Math.round(seaTotalEur * xafRate);

    const options: QuoteOption[] = [
      {
        service_type: 'AIR_REGULAR',
        title: 'Carga Aérea Regular (Express)',
        description: 'Vuelo directo de carga hacia Malabo o Bata. Ideal para paquetería urgente, compras online y documentación.',
        estimated_days: '3 - 5 días hábiles',
        chargeable_measure: `${chargeable_air_weight_kg} kg (Facturable)`,
        cost_eur: Number(airBaseCost.toFixed(2)),
        cost_xaf: Math.round(airBaseCost * xafRate),
        handling_fee_eur: airHandlingFee,
        total_eur: airTotalEur,
        total_xaf: airTotalXaf,
        recommended: chargeable_air_weight_kg <= 30,
      },
      {
        service_type: 'SEA_GROUPAGE',
        title: 'Carga Marítima Compartida (Grupaje LCL)',
        description: 'Consolidación en contenedor marítimo hacia puertos de Malabo o Bata. La opción más económica para cajas grandes o cargas pesadas.',
        estimated_days: '20 - 28 días',
        chargeable_measure: `${volume_m3} m³`,
        cost_eur: Number(seaBaseCost.toFixed(2)),
        cost_xaf: Math.round(seaBaseCost * xafRate),
        handling_fee_eur: seaHandlingFee,
        total_eur: seaTotalEur,
        total_xaf: seaTotalXaf,
        recommended: chargeable_air_weight_kg > 30 || volume_m3 >= 0.2,
      },
    ];

    // 5. Generación de enlaces pre-formateados de WhatsApp
    const msgText = encodeURIComponent(
      `👋 Hola Guineval Logistics,\nHe realizado una cotización en su web:\n` +
      `📦 Dimensiones: ${length_cm}x${width_cm}x${height_cm} cm | Peso: ${weight_kg} kg\n` +
      `⚖️ Peso volumétrico: ${volumetric_weight_kg} kg | Volumen: ${volume_m3} m³\n` +
      `📍 Ruta: Silla (Valencia) ➔ ${destination_city} (Guinea Ecuatorial)\n` +
      `💰 Est. Aéreo: ${airTotalEur} € (${airTotalXaf.toLocaleString()} XAF)\n` +
      `🚢 Est. Marítimo: ${seaTotalEur} € (${seaTotalXaf.toLocaleString()} XAF)\n` +
      `¿Podrían confirmarme los detalles para realizar el envío?`
    );

    const whatsappSpainUrl = `https://wa.me/${env.COMPANY_WHATSAPP_ES.replace(/\+/g, '')}?text=${msgText}`;
    const whatsappGuineaUrl = `https://wa.me/${env.COMPANY_WHATSAPP_GQ.replace(/\+/g, '')}?text=${msgText}`;

    return {
      origin: {
        name: 'Sede Central Guineval España',
        address: 'Av. de la Séquia Real del Xúquer, 72, 46460 Silla, Valencia',
        city: 'Valencia (Silla)',
      },
      destination: {
        city: destination_city,
        country: 'Guinea Ecuatorial',
      },
      cargo_category,
      dimensions: {
        length_cm,
        width_cm,
        height_cm,
        volume_m3,
      },
      weights: {
        real_weight_kg: weight_kg,
        volumetric_weight_kg,
        chargeable_air_weight_kg,
      },
      exchange_rate_xaf: xafRate,
      options,
      whatsapp_links: {
        spain: whatsappSpainUrl,
        guinea: whatsappGuineaUrl,
      },
    };
  }
}

import { pool } from '../config/database';
import { env } from '../config/env';
import { PurchaseRequest, DestinationCity, ServiceType, CargoCategory } from '../types';

export interface CreatePurchaseInput {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  destination_city: DestinationCity;
  item_name: string;
  store_name?: string;
  product_url?: string;
  specifications?: string;
  quantity?: number;
  cargo_category?: CargoCategory;
  estimated_item_price_eur: number;
  preferred_shipping?: ServiceType;
}

export class PurchaseService {
  /**
   * Registra una nueva solicitud de compra asistida (Personal Shopper)
   */
  public static async createRequest(input: CreatePurchaseInput): Promise<{
    request: Partial<PurchaseRequest>;
    whatsapp_url: string;
  }> {
    const {
      customer_name,
      customer_phone,
      customer_email = null,
      destination_city = 'Malabo',
      item_name,
      store_name = 'Tienda Online España',
      product_url = '',
      specifications = '',
      quantity = 1,
      cargo_category = 'GENERAL',
      estimated_item_price_eur = 0,
      preferred_shipping = 'AIR_REGULAR',
    } = input;

    // 1. Generar código único de solicitud (REQ-AÑO-ALEATORIO)
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const requestCode = `REQ-${year}-${randomSuffix}`;

    // 2. Cálculo de costes estimados y comisión del 10% (mínimo 5€)
    const commissionPct = 0.10;
    const itemTotal = Number((estimated_item_price_eur * quantity).toFixed(2));
    const serviceCommissionEur = Number(Math.max(itemTotal * commissionPct, 5.00).toFixed(2));
    
    // Estimación preliminar de transporte (aéreo mínimo 25€, marítimo mínimo 50€)
    const shippingEstimateEur = preferred_shipping.startsWith('AIR') ? 25.00 : 50.00;
    
    const totalEstimatedEur = Number((itemTotal + serviceCommissionEur + shippingEstimateEur).toFixed(2));
    const eurToXafRate = 655.9570;
    const totalEstimatedXaf = Math.round(totalEstimatedEur * eurToXafRate);

    try {
      await pool.query(
        `INSERT INTO purchase_requests (
          request_code, customer_name, customer_phone, customer_email, destination_city,
          item_name, store_name, product_url, specifications, quantity, cargo_category,
          estimated_item_price_eur, service_commission_eur, shipping_estimate_eur,
          total_estimated_eur, total_estimated_xaf, preferred_shipping, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_QUOTE')`,
        [
          requestCode, customer_name, customer_phone, customer_email, destination_city,
          item_name, store_name, product_url, specifications, quantity, cargo_category,
          itemTotal, serviceCommissionEur, shippingEstimateEur,
          totalEstimatedEur, totalEstimatedXaf, preferred_shipping
        ]
      );
    } catch (error: any) {
      console.warn(`[PurchaseService] No se pudo guardar en MySQL (${error.message}). Continuando con datos calculados.`);
    }

    // 3. Generar enlace estructurado para WhatsApp
    const message = encodeURIComponent(
      `🛒 *NUEVA SOLICITUD DE COMPRA ASISTIDA (PERSONAL SHOPPER)*\n` +
      `🔖 *Código:* ${requestCode}\n` +
      `👤 *Cliente:* ${customer_name} (${customer_phone})\n` +
      `📍 *Destino:* ${destination_city} (Guinea Ecuatorial)\n\n` +
      `🛍️ *Producto:* ${item_name} (Cant: ${quantity})\n` +
      `🏪 *Tienda:* ${store_name}\n` +
      (product_url ? `🔗 *Enlace:* ${product_url}\n` : '') +
      (specifications ? `📝 *Detalles:* ${specifications}\n` : '') +
      `\n💰 *Presupuesto Estimado:* ${totalEstimatedEur} € (${totalEstimatedXaf.toLocaleString()} XAF)\n` +
      `✈️ *Envío Deseado:* ${preferred_shipping.startsWith('AIR') ? 'Aéreo' : 'Marítimo'}\n\n` +
      `Hola Guineval, deseo que gestionen la compra de este artículo y su envío desde Valencia.`
    );

    const whatsappUrl = `https://wa.me/${env.COMPANY_WHATSAPP_ES.replace(/\+/g, '')}?text=${message}`;

    return {
      request: {
        request_code: requestCode,
        customer_name,
        customer_phone,
        destination_city,
        item_name,
        store_name,
        product_url,
        quantity,
        cargo_category,
        estimated_item_price_eur: itemTotal,
        service_commission_eur: serviceCommissionEur,
        shipping_estimate_eur: shippingEstimateEur,
        total_estimated_eur: totalEstimatedEur,
        total_estimated_xaf: totalEstimatedXaf,
        preferred_shipping,
        status: 'PENDING_QUOTE',
        created_at: new Date().toISOString(),
      },
      whatsapp_url: whatsappUrl,
    };
  }
}

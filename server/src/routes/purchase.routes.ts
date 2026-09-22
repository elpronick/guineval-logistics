import { Router } from 'express';
import { z } from 'zod';
import { PurchaseController } from '../controllers/purchase.controller';
import { validate } from '../middlewares/validateRequest';

const router = Router();

const createPurchaseSchema = z.object({
  body: z.object({
    customer_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    customer_phone: z.string().min(6, 'El teléfono es obligatorio para la gestión por WhatsApp'),
    customer_email: z.string().email().optional().or(z.literal('')),
    destination_city: z.enum(['Malabo', 'Bata']),
    item_name: z.string().min(2, 'El nombre del producto es obligatorio'),
    store_name: z.string().optional(),
    product_url: z.string().optional(),
    specifications: z.string().optional(),
    quantity: z.number().int().positive().default(1),
    cargo_category: z.enum([
      'GENERAL',
      'VEHICLES_CARS',
      'HEAVY_MACHINERY',
      'VOLUMINOUS_CARGO',
      'FURNITURE_APPLIANCES',
      'CONSTRUCTION_MATERIALS',
      'HAZARDOUS_ADR',
    ]).default('GENERAL'),
    estimated_item_price_eur: z.number().nonnegative('El precio debe ser un número positivo'),
    preferred_shipping: z.enum([
      'AIR_REGULAR',
      'AIR_CHARTER',
      'SEA_GROUPAGE',
      'SEA_FULL_CONTAINER',
    ]).default('AIR_REGULAR'),
  }),
});

// POST /api/purchases/request -> Encargo de compra asistida en España
router.post('/request', validate(createPurchaseSchema), PurchaseController.create);

export default router;

import { Router } from 'express';
import { z } from 'zod';
import { QuoteController } from '../controllers/quote.controller';
import { validate } from '../middlewares/validateRequest';

const router = Router();

const calculateQuoteSchema = z.object({
  body: z.object({
    destination_city: z.enum(['Malabo', 'Bata']),
    cargo_category: z.enum([
      'GENERAL',
      'VEHICLES_CARS',
      'HEAVY_MACHINERY',
      'VOLUMINOUS_CARGO',
      'FURNITURE_APPLIANCES',
      'CONSTRUCTION_MATERIALS',
      'HAZARDOUS_ADR',
    ]).default('GENERAL'),
    weight_kg: z.number().positive('El peso debe ser mayor a 0'),
    length_cm: z.number().positive('La longitud debe ser mayor a 0'),
    width_cm: z.number().positive('El ancho debe ser mayor a 0'),
    height_cm: z.number().positive('La altura debe ser mayor a 0'),
    declared_value_eur: z.number().nonnegative().optional(),
  }),
});

// POST /api/quotes/calculate -> Cálculo volumétrico y tarifas Aéreo/Marítimo en EUR y XAF
router.post('/calculate', validate(calculateQuoteSchema), QuoteController.calculate);

export default router;

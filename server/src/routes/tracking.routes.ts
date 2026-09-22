import { Router } from 'express';
import { z } from 'zod';
import { TrackingController } from '../controllers/tracking.controller';
import { validate } from '../middlewares/validateRequest';

const router = Router();

const trackingParamSchema = z.object({
  params: z.object({
    code: z.string().min(3, 'El número de seguimiento debe tener al menos 3 caracteres'),
  }),
});

// GET /api/tracking/:code -> Búsqueda pública de envíos
router.get('/:code', validate(trackingParamSchema), TrackingController.getTracking);

export default router;

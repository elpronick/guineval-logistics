import { Router } from 'express';
import trackingRoutes from './tracking.routes';
import quoteRoutes from './quote.routes';
import purchaseRoutes from './purchase.routes';
import warehouseRoutes from './warehouse.routes';

const router = Router();

// Endpoint de comprobación de salud del servidor
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'Guineval Logistics API',
    company: 'Exportaciones Guineval S.L.',
    timestamp: new Date().toISOString(),
    routes: [
      '/api/tracking/:code',
      '/api/quotes/calculate',
      '/api/purchases/request',
      '/api/warehouses',
    ],
  });
});

// Registrar submódulos de la API
router.use('/tracking', trackingRoutes);
router.use('/quotes', quoteRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/warehouses', warehouseRoutes);

export default router;

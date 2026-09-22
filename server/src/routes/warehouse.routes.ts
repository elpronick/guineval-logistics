import { Router } from 'express';
import { WarehouseController } from '../controllers/warehouse.controller';

const router = Router();

// GET /api/warehouses -> Lista de sedes (Silla Valencia, Malabo, Bata)
router.get('/', WarehouseController.getAll);

export default router;

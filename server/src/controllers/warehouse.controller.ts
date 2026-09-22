import { Request, Response, NextFunction } from 'express';
import { WarehouseService } from '../services/warehouse.service';

export class WarehouseController {
  public static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const warehouses = await WarehouseService.getAllWarehouses();
      res.status(200).json({
        success: true,
        data: warehouses,
      });
    } catch (error) {
      next(error);
    }
  }
}

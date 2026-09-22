import { Request, Response, NextFunction } from 'express';
import { PurchaseService } from '../services/purchase.service';

export class PurchaseController {
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PurchaseService.createRequest(req.body);
      res.status(201).json({
        success: true,
        message: 'Solicitud de compra asistida registrada con éxito',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

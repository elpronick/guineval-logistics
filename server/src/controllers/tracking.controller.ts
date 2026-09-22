import { Request, Response, NextFunction } from 'express';
import { TrackingService } from '../services/tracking.service';

export class TrackingController {
  public static async getTracking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.params;
      const shipment = await TrackingService.getShipmentByTrackingNumber(code);
      res.status(200).json({
        success: true,
        data: shipment,
      });
    } catch (error) {
      next(error);
    }
  }
}

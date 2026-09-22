import { Request, Response, NextFunction } from 'express';
import { QuoteService } from '../services/quote.service';

export class QuoteController {
  public static async calculate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const calculation = await QuoteService.calculate(req.body);
      res.status(200).json({
        success: true,
        data: calculation,
      });
    } catch (error) {
      next(error);
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        next(new AppError('Datos de entrada no válidos', 400, issues));
      } else {
        next(error);
      }
    }
  };
};

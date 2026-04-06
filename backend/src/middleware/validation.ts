import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './errorHandler';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = validated.body || req.body;
      req.query = validated.query || req.query;
      req.params = validated.params || req.params;

      next();
    } catch (error: any) {
      const details: Record<string, string> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path.join('.');
          details[path] = err.message;
        });
      }

      throw new AppError(400, 'Validation failed', details);
    }
  };
}

export const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): (req: Request, res: Response, next: NextFunction) => void => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
};

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error: any) {
      const details: Record<string, string> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path.join('.');
          details[path] = err.message;
        });
      }

      throw new AppError(400, 'Validation failed', details);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated;
      next();
    } catch (error: any) {
      const details: Record<string, string> = {};

      if (error.errors) {
        error.errors.forEach((err: any) => {
          const path = err.path.join('.');
          details[path] = err.message;
        });
      }

      throw new AppError(400, 'Validation failed', details);
    }
  };
}

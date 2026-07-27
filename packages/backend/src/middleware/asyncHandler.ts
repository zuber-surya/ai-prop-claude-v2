import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export const asyncHandler =
  (
    fn: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<void> | void
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = fn(req, res, next);
      // If the function returns a promise, wait for it
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      logger.error(error);
      next(error);
    }
  };

import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from 'express';
import logger from '../utils/logger';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler: ErrorRequestHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  logger.error(error);

  const statusCode = error.statusCode ?? 500;
  const message =
    process.env.NODE_ENV === 'production' && !error.statusCode
      ? 'Internal Server Error'
      : error.message;

  res.status(statusCode).json({
    success: false,
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message,
    },
  });
};

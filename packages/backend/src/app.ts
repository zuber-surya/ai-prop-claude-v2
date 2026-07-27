import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import logger from './utils/logger';
import { asyncHandler } from './middleware/asyncHandler';
import { errorHandler } from './middleware/errorHandler';
import apiRouter from './routes';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser());

// Request logging (not wrapped in asyncHandler as it's synchronous)
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
  next();
});

// API routes
app.use('/api/v1', apiRouter);

// 404 handler
app.use(
  asyncHandler((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${req.originalUrl} not found`,
      },
    });
  })
);

// Error handler (must be last)
app.use(errorHandler);

export default app;
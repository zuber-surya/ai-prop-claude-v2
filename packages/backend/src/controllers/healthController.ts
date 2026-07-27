import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';

/**
 * @desc    Get health check status
 * @route   GET /api/v1/health
 * @access  Public
 */
const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  // Add a dummy await to satisfy eslint rule requiring await in async functions
  await Promise.resolve();
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Property Vista CRM API',
    },
  });
});

export default {
  getHealth,
};

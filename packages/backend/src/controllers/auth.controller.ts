import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { AuthService } from '../services/auth.service';
import { registerSchema } from '../validator/auth.schema';
import jwt from 'jsonwebtoken';
import { jwtSecret, jwtExpiresIn, cookieOptions } from '../lib/auth';

const authService = new AuthService();

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: parseResult.error.format(),
        },
      });
    }

    const data = parseResult.data;

    try {
      const user = await authService.register(data);

      // Generate JWT access token (short-lived)
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );

      // Generate JWT refresh token (long-lived, e.g., 7 days)
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email },
        jwtSecret,
        { expiresIn: '7d' }
      );

      // Return user data and tokens
      return res.status(201).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          accessToken,
          refreshToken,
        },
      });
    } catch (error: any) {
      if (error.message === 'Email already registered') {
        return res.status(409).json({
          success: false,
          error: {
            code: 'EMAIL_EXISTS',
            message: 'Email already registered',
          },
        });
      }
      // Unexpected error
      throw error; // will be caught by asyncHandler and passed to errorHandler
    }
  }),
};
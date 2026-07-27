import { Secret } from 'jsonwebtoken';

export const jwtSecret: Secret = process.env.JWT_SECRET ?? 'fallback-secret-for-development-only';
export const jwtExpiresIn = '15m'; // access token expiry
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};
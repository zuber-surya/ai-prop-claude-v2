import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  name: z.string().max(100, 'Name must be at most 100 characters'),
  role: z.enum(['customer', 'agent']),
});

export type RegisterDto = z.infer<typeof registerSchema>;
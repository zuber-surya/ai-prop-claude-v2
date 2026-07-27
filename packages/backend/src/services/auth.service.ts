import bcrypt from 'bcryptjs';
import prisma from '../utils/prisma';
import { RegisterDto } from '../validator/auth.schema';

export class AuthService {
  async register(data: Readonly<RegisterDto>): Promise<Omit<Parameters<typeof prisma.user.create>[0]['data'], 'passwordHash'>> {
    const { email, password, name, role } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password with cost 12+ as per security requirements
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Map role string to Prisma Role enum
    const roleMap: Record<string, typeof prisma.role> = {
      customer: prisma.role.CUSTOMER,
      agent: prisma.role.AGENT,
    };
    const userRole = roleMap[role] ?? prisma.role.VISITOR; // fallback to VISITOR if not matched (should not happen due to validation)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: userRole,
        isVerified: false, // explicitly set, though default is false
      },
    });

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (payload: Record<string, unknown>): string => {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET || 'fallback-secret', {
    expiresIn: '7d'
  });
};

export const verifyToken = (token: string): Record<string, unknown> | null => {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET || 'fallback-secret') as Record<string, unknown>;
  } catch {
    return null;
  }
};
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export interface AuthenticatedRequest extends NextApiRequest {
  admin?: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}

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

export function verifyApiToken(req: AuthenticatedRequest, res: NextApiResponse): boolean {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token d\'authentification manquant' });
      return false;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    const decoded = verifyToken(token);
    if (!decoded || !decoded.admin) {
      res.status(401).json({ error: 'Token d\'authentification invalide' });
      return false;
    }
    
    req.admin = decoded.admin as {
      id: number;
      email: string;
      username: string;
      role: string;
    };
    
    return true;
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    res.status(401).json({ error: 'Token d\'authentification invalide' });
    return false;
  }
}

export function requireAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    if (!verifyApiToken(req, res)) {
      return; // Response already sent by verifyApiToken
    }
    
    return handler(req, res);
  };
}
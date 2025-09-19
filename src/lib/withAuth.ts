import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '@/lib/auth';

export interface AuthenticatedRequest extends NextApiRequest {
  admin?: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}

export const withAuth = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Extraire le token du header Authorization
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token d\'authentification manquant' });
      }

      const token = authHeader.substring(7); // Enlever "Bearer "

      // Vérifier le token
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({ message: 'Token d\'authentification invalide' });
      }

      // Ajouter les infos admin à la requête
      req.admin = {
        id: decoded.id as number,
        email: decoded.email as string,
        username: decoded.username as string,
        role: decoded.role as string
      };

      // Continuer vers le handler
      return handler(req, res);
      
    } catch (error) {
      console.error('Erreur middleware auth:', error);
      return res.status(401).json({ message: 'Token d\'authentification invalide' });
    }
  };
};

export default withAuth;
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateToken } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  // Validation des champs requis
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Email et mot de passe requis' 
    });
  }

  try {
    // Rechercher l'admin dans la base
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!admin) {
      return res.status(401).json({ 
        message: 'Identifiants invalides' 
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await verifyPassword(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Identifiants invalides' 
      });
    }

    // Générer le token JWT
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      username: admin.username,
      role: admin.role
    });

    // Retourner les informations d'admin (sans le mot de passe)
    const adminData = {
      id: admin.id,
      email: admin.email,
      username: admin.username,
      role: admin.role
    };

    res.status(200).json({
      message: 'Connexion réussie',
      admin: adminData,
      token
    });

  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur' 
    });
  }
}
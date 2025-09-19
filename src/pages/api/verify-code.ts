import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { verificationCodes } from './send-verification-code';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Méthode ${req.method} non autorisée`);
  }

  try {
    const { sessionId, code } = req.body;

    if (!sessionId || !code) {
      return res.status(400).json({ error: 'Session ID et code requis' });
    }

    // Vérifier si le code existe et n'est pas expiré
    const verification = verificationCodes[sessionId];
    
    if (!verification) {
      return res.status(400).json({ error: 'Code de vérification invalide ou expiré' });
    }

    if (Date.now() > verification.expiresAt) {
      // Supprimer le code expiré
      delete verificationCodes[sessionId];
      return res.status(400).json({ error: 'Code de vérification expiré' });
    }

    if (verification.code !== code) {
      return res.status(400).json({ error: 'Code de vérification incorrect' });
    }

    // Code valide, créer le message en base
    const message = await prisma.message.create({
      data: {
        name: verification.messageData.name,
        email: verification.messageData.email,
        subject: verification.messageData.subject,
        content: verification.messageData.content
      }
    });

    // Supprimer le code utilisé
    delete verificationCodes[sessionId];

    res.status(201).json({ 
      success: true, 
      message: 'Message créé avec succès',
      data: message
    });

  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    res.status(500).json({ error: 'Erreur lors de la vérification du code' });
  }
}
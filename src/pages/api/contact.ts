import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      message: 'Tous les champs sont requis' 
    });
  }

  // Validation email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      message: 'Email invalide' 
    });
  }

  try {
    // Enregistrer le message dans la base de données
    await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
        read: false
      }
    });

    res.status(200).json({ 
      message: 'Message envoyé avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du message:', error);
    res.status(500).json({ 
      message: 'Erreur interne du serveur' 
    });
  }
}
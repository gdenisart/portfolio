import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  try {
    const messages = await prisma.message.findMany({
      where: { read: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des messages non-lus.' });
  }
}

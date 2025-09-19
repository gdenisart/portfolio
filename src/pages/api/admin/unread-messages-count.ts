import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
  try {
    const count = await prisma.message.count({ where: { read: false } });
    res.status(200).json({ count });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la récupération du nombre de messages non-lus.' });
  }
}

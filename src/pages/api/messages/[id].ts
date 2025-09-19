import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (typeof id !== 'string') return res.status(400).json({ error: 'ID invalide' });

  if (req.method === 'GET') {
    try {
      const message = await prisma.message.findUnique({ where: { id: Number(id) } });
      if (!message) return res.status(404).json({ error: 'Message non trouvé' });
      return res.status(200).json({ message });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la récupération du message.' });
    }
  }
  if (req.method === 'PUT') {
    try {
      const { read } = req.body;
      const message = await prisma.message.update({
        where: { id: Number(id) },
        data: { read }
      });
      return res.status(200).json({ message });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour.' });
    }
  }
  if (req.method === 'DELETE') {
    try {
      await prisma.message.delete({ where: { id: Number(id) } });
      return res.status(204).end();
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
  }
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end(`Méthode ${req.method} non autorisée`);
}

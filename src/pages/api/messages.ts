import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
      return res.status(200).json({ messages });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
    }
  }
  if (req.method === 'POST') {
    try {
      const { name, email, subject, content } = req.body;
      const message = await prisma.message.create({
        data: { name, email, subject, content }
      });
      return res.status(201).json({ message });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la création du message.' });
    }
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Méthode ${req.method} non autorisée`);
}

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const skills = await prisma.skill.findMany({
        orderBy: { name: 'asc' }
      });
      res.status(200).json({ skills });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des compétences.' });
    }
    return;
  }

  if (req.method === 'POST') {
    return requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const { name, level, category } = req.body;
        if (!name || typeof level === 'undefined' || !category) {
          return res.status(400).json({ error: 'Nom, niveau et catégorie requis.' });
        }
        const skill = await prisma.skill.create({
          data: { name, level: Number(level), category }
        });
        return res.status(201).json({ skill });
      } catch {
        return res.status(500).json({ error: 'Erreur lors de la création.' });
      }
    })(req, res);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Méthode ${req.method} non autorisée`);
}

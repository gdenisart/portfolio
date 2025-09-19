import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const { title, company, location, startDate, endDate, current, description, technologies, achievements } = req.body;
        const experience = await prisma.experience.create({
          data: {
            title,
            company,
            location,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            current,
            description,
            technologies,
            achievements,
          }
        });
        return res.status(201).json({ experience });
      } catch {
        return res.status(500).json({ error: 'Erreur lors de la création.' });
      }
    })(req, res);
  }

  if (req.method === 'GET') {
    try {
      const experiences = await prisma.experience.findMany({
        orderBy: { startDate: 'desc' }
      });
      res.status(200).json({ experiences });
    } catch {
      res.status(500).json({ error: 'Erreur lors de la récupération des expériences.' });
    }
    return;
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Méthode ${req.method} non autorisée`);
}

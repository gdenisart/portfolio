import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth';

export default requireAuth(async function handler(req: AuthenticatedRequest, res: NextApiResponse): Promise<void> {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
    return;
  }
  try {
    const [projects, skills, experiences, messages] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.message.count(),
    ]);
    res.status(200).json({ projects, skills, experiences, messages });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la récupération des statistiques.' });
  }
});

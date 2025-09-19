import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }
  try {
    const [projects, skills, experiences, messages] = await Promise.all([
      prisma.project.count(),
      prisma.skill.count(),
      prisma.experience.count(),
      prisma.contact.count()
    ]);
    res.status(200).json({
      projects,
      skills,
      experiences,
      messages
    });
  } catch (error) {
    console.error('Erreur API /api/admin/stats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

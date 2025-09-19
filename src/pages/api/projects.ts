import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth, AuthenticatedRequest } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.status(200).json({ projects });
    } catch (error) {
      console.error('Erreur API /api/projects GET:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else if (req.method === 'POST') {
    return requireAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      try {
        const { title, description, longDescription, technologies, imageUrl, githubUrl, liveUrl, featured } = req.body;
        
        const project = await prisma.project.create({
          data: {
            title,
            description,
            longDescription,
            technologies: JSON.stringify(technologies),
            imageUrl,
            githubUrl,
            liveUrl,
            featured: Boolean(featured)
          }
        });
        
        res.status(201).json({ project });
      } catch (error) {
        console.error('Erreur API /api/projects POST:', error);
        res.status(500).json({ message: 'Erreur lors de la création du projet' });
      }
    })(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: `Méthode ${req.method} non autorisée` });
  }
}

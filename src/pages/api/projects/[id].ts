import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || Array.isArray(id)) {
    return res.status(400).json({ message: 'ID de projet invalide' });
  }

  if (req.method === 'GET') {
    try {
      const project = await prisma.project.findUnique({
        where: { id: Number(id) }
      });
      if (!project) {
        return res.status(404).json({ message: 'Projet non trouvé' });
      }
      res.status(200).json({ project });
    } catch (error) {
      console.error('Erreur API /api/projects/[id]:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else if (req.method === 'PUT') {
    try {
      const data = req.body;
      // Validation basique (à adapter selon besoins)
      if (!data.title || !data.description || !data.technologies) {
        return res.status(400).json({ message: 'Champs requis manquants' });
      }
      const updated = await prisma.project.update({
        where: { id: Number(id) },
        data: {
          title: data.title,
          description: data.description,
          longDescription: data.longDescription,
          technologies: data.technologies,
          imageUrl: data.imageUrl,
          githubUrl: data.githubUrl,
          liveUrl: data.liveUrl,
          featured: data.featured ?? false,
        }
      });
      res.status(200).json({ project: updated });
    } catch (error) {
      console.error('Erreur API PUT /api/projects/[id]:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.project.delete({ where: { id: Number(id) } });
      res.status(204).end();
    } catch (error) {
      console.error('Erreur API DELETE /api/projects/[id]:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;


  if (method === 'GET') {
    try {
      const experience = await prisma.experience.findUnique({
        where: { id: Number(id) }
      });
      if (!experience) return res.status(404).json({ error: 'Expérience non trouvée.' });
      return res.status(200).json({ experience });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la récupération.' });
    }
  }

  if (method === 'PUT') {
    try {
      const { title, company, location, startDate, endDate, current, description, technologies, achievements } = req.body;
      const experience = await prisma.experience.update({
        where: { id: Number(id) },
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
      return res.status(200).json({ experience });
    } catch {
      return res.status(500).json({ error: 'Erreur lors de la modification.' });
    }
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Méthode ${method} non autorisée`);
}

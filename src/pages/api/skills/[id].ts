import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method === 'DELETE') {
    try {
      await prisma.skill.delete({ where: { id: Number(id) } });
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la suppression.' });
    }
  }

  if (method === 'PUT') {
    try {
      const { name, level } = req.body;
      const skill = await prisma.skill.update({
        where: { id: Number(id) },
        data: { name, level },
      });
      return res.status(200).json({ skill });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la modification.' });
    }
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  res.status(405).end(`Méthode ${method} non autorisée`);
}

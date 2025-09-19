import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


async function main() {
  // Vérifier et insérer un message de test si la table est vide
  const messageCount = await prisma.message.count();
  if (messageCount === 0) {
    await prisma.message.create({
      data: {
        name: 'Admin',
        email: 'admin@shadcanard.com',
        subject: "Bienvenue dans l'interface",
        content: "Ce texte est un essai d'envoi de messages",
      },
    });
  }

  // Vérifier et insérer un projet de test si la table est vide
  const projectCount = await prisma.project.count();
  if (projectCount === 0) {
    await prisma.project.create({
      data: {
        title: 'Projet Démo',
        description: 'Un projet de démonstration.',
        longDescription: 'Description longue du projet démo.',
        technologies: JSON.stringify(['Next.js', 'Prisma', 'React']),
        imageUrl: null,
        githubUrl: null,
        liveUrl: null,
        featured: false,
      },
    });
  }

  // Vérifier et insérer une compétence de test si la table est vide
  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.create({
      data: {
        name: 'TypeScript',
        category: 'frontend',
        level: 80,
        iconUrl: null,
        description: 'Langage de typage pour JavaScript',
        featured: true,
      },
    });
  }

  // Vérifier et insérer une expérience de test si la table est vide
  const experienceCount = await prisma.experience.count();
  if (experienceCount === 0) {
    await prisma.experience.create({
      data: {
        title: 'Développeur Web',
        company: 'Entreprise Démo',
        location: 'Paris',
        startDate: new Date('2022-01-01'),
        endDate: null,
        current: true,
        description: 'Développement d\'applications web.',
        technologies: JSON.stringify(['React', 'Node.js']),
        achievements: JSON.stringify(['Mise en place CI/CD']),
      },
    });
  }

  // Vérifier et insérer une éducation de test si la table est vide
  const educationCount = await prisma.education.count();
  if (educationCount === 0) {
    await prisma.education.create({
      data: {
        degree: 'Master Informatique',
        institution: 'Université Démo',
        location: 'Lyon',
        startDate: new Date('2020-09-01'),
        endDate: new Date('2022-06-30'),
        current: false,
        description: 'Formation en développement logiciel.',
        grade: 'Mention Bien',
      },
    });
  }

  // Vérifier et insérer un contact de test si la table est vide
  const contactCount = await prisma.contact.count();
  if (contactCount === 0) {
    await prisma.contact.create({
      data: {
        name: 'Contact Démo',
        email: 'contact@demo.com',
        subject: 'Demande de contact',
        message: 'Bonjour, ceci est un message de test.',
      },
    });
  }

  // Vérifier et insérer un admin de test si la table est vide
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    await prisma.admin.create({
      data: {
        username: 'admin',
        email: 'admin@portfolio.dev',
        password: 'admin123', // À hasher en prod !
        role: 'admin',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

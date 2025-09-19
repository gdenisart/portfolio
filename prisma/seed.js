const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer un admin par défaut
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@portfolio.dev' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@portfolio.dev',
      password: hashedPassword,
      role: 'admin'
    }
  });

  // Projets d'exemple
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'E-Commerce Platform',
        description: 'Une plateforme e-commerce moderne avec React et Node.js',
        longDescription: 'Plateforme e-commerce complète avec gestion des utilisateurs, panier, paiements Stripe, et interface d\'administration. Utilise React, Node.js, MongoDB et Redux pour la gestion d\'état.',
        technologies: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux', 'Express']),
        imageUrl: '/images/ecommerce-project.jpg',
        githubUrl: 'https://github.com/example/ecommerce',
        liveUrl: 'https://ecommerce-demo.vercel.app',
        featured: true
      }
    }),
    prisma.project.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: 'Task Management App',
        description: 'Application de gestion de tâches collaborative',
        longDescription: 'Application web de gestion de tâches avec collaboration en temps réel, notifications push et synchronisation multi-appareils.',
        technologies: JSON.stringify(['Vue.js', 'Firebase', 'Vuetify', 'PWA']),
        imageUrl: '/images/task-app.jpg',
        githubUrl: 'https://github.com/example/task-manager',
        liveUrl: 'https://task-manager-demo.netlify.app',
        featured: true
      }
    }),
    prisma.project.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: 'Weather Dashboard',
        description: 'Dashboard météo avec données en temps réel',
        longDescription: 'Dashboard interactif affichant les conditions météorologiques actuelles et prévisions avec graphiques et cartes interactives.',
        technologies: JSON.stringify(['Next.js', 'TypeScript', 'Chart.js', 'API OpenWeather']),
        imageUrl: '/images/weather-app.jpg',
        githubUrl: 'https://github.com/example/weather-dashboard',
        featured: false
      }
    })
  ]);

  // Compétences d'exemple
  const skills = await Promise.all([
    // Frontend
    prisma.skill.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: 'React',
        category: 'frontend',
        level: 90,
        description: 'Développement d\'applications web modernes avec React et ses écosystèmes',
        featured: true
      }
    }),
    prisma.skill.upsert({
      where: { id: 2 },
      update: {},
      create: {
        name: 'TypeScript',
        category: 'frontend',
        level: 85,
        description: 'Typage statique pour JavaScript, amélioration de la qualité du code',
        featured: true
      }
    }),
    prisma.skill.upsert({
      where: { id: 3 },
      update: {},
      create: {
        name: 'Next.js',
        category: 'frontend',
        level: 88,
        description: 'Framework React pour les applications web full-stack',
        featured: true
      }
    }),
    // Backend
    prisma.skill.upsert({
      where: { id: 4 },
      update: {},
      create: {
        name: 'Node.js',
        category: 'backend',
        level: 85,
        description: 'Développement d\'APIs et services backend performants',
        featured: true
      }
    }),
    prisma.skill.upsert({
      where: { id: 5 },
      update: {},
      create: {
        name: 'Python',
        category: 'backend',
        level: 80,
        description: 'Développement backend, scripts d\'automatisation et data science',
        featured: false
      }
    }),
    // Base de données
    prisma.skill.upsert({
      where: { id: 6 },
      update: {},
      create: {
        name: 'PostgreSQL',
        category: 'database',
        level: 75,
        description: 'Gestion de bases de données relationnelles complexes',
        featured: false
      }
    }),
    prisma.skill.upsert({
      where: { id: 7 },
      update: {},
      create: {
        name: 'MongoDB',
        category: 'database',
        level: 70,
        description: 'Bases de données NoSQL pour applications modernes',
        featured: false
      }
    }),
    // Outils
    prisma.skill.upsert({
      where: { id: 8 },
      update: {},
      create: {
        name: 'Git',
        category: 'tools',
        level: 90,
        description: 'Gestion de versions et collaboration en équipe',
        featured: false
      }
    }),
    prisma.skill.upsert({
      where: { id: 9 },
      update: {},
      create: {
        name: 'Docker',
        category: 'tools',
        level: 70,
        description: 'Containerisation et déploiement d\'applications',
        featured: false
      }
    })
  ]);

  // Expériences d'exemple
  const experiences = await Promise.all([
    prisma.experience.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: 'Développeur Full Stack Senior',
        company: 'Tech Innovations SARL',
        location: 'Paris, France',
        startDate: new Date('2022-01-01'),
        current: true,
        description: 'Développement d\'applications web complexes et direction d\'équipe de développeurs junior.',
        technologies: JSON.stringify(['React', 'Node.js', 'TypeScript', 'AWS', 'Docker']),
        achievements: JSON.stringify([
          'Réduction de 40% du temps de chargement des applications',
          'Encadrement d\'une équipe de 4 développeurs',
          'Mise en place de l\'architecture microservices'
        ])
      }
    }),
    prisma.experience.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: 'Développeur Frontend',
        company: 'Digital Solutions',
        location: 'Lyon, France',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2021-12-31'),
        current: false,
        description: 'Développement d\'interfaces utilisateur modernes et responsive.',
        technologies: JSON.stringify(['Vue.js', 'React', 'SASS', 'Webpack']),
        achievements: JSON.stringify([
          'Développement de 5 applications web majeures',
          'Amélioration de l\'UX de 60%',
          'Formation de l\'équipe aux bonnes pratiques'
        ])
      }
    }),
  ]);

  
  const messages = await Promise.all([
      // Message de test
    await prisma.message.create({
      data: {
        name: 'Admin',
        email: 'admin@shadcanard.com',
        subject: 'Bienvenue dans l\'interface',
        content: 'Ce texte est un essai d\'envoi de messages',
      },
    })
  ]);

  // Formation d'exemple
  const education = await Promise.all([
    prisma.education.upsert({
      where: { id: 1 },
      update: {},
      create: {
        degree: 'Master en Informatique',
        institution: 'École Supérieure d\'Informatique',
        location: 'Paris, France',
        startDate: new Date('2018-09-01'),
        endDate: new Date('2020-06-30'),
        current: false,
        description: 'Spécialisation en développement web et ingénierie logicielle',
        grade: 'Mention Bien'
      }
    }),
    prisma.education.upsert({
      where: { id: 2 },
      update: {},
      create: {
        degree: 'Licence en Informatique',
        institution: 'Université de Technologie',
        location: 'Lille, France',
        startDate: new Date('2015-09-01'),
        endDate: new Date('2018-06-30'),
        current: false,
        description: 'Formation générale en informatique et programmation',
        grade: 'Mention Assez Bien'
      }
    })
  ]);

  console.log('✅ Seeding terminé avec succès!');
  console.log(`👤 Admin créé: ${admin.email}`);
  console.log(`🚀 ${projects.length} projets créés`);
  console.log(`🎯 ${skills.length} compétences créées`);
  console.log(`💼 ${experiences.length} expériences créées`);
  console.log(`🎓 ${education.length} formations créées`);
  console.log(`📨 ${messages.length} messages créés`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
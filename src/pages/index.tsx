import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import { GetStaticProps } from 'next';
import { prisma } from '@/lib/prisma';
import type { Project, Skill, Experience as ExperienceType } from '@/types';

interface HomeProps {
  projects: Project[];
  skills: Skill[];
  experiences: ExperienceType[];
}

export default function Home({ projects, skills, experiences }: HomeProps) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <Layout>
      <Hero />
      <About />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experiences={experiences} />
      <Contact />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [projects, skills, experiences] = await Promise.all([
    prisma.project.findMany({
      where: { featured: true },
      orderBy: { createdAt: 'desc' },
      take: 6
    }),
    prisma.skill.findMany({
      where: { featured: true },
      orderBy: { level: 'desc' }
    }),
    prisma.experience.findMany({
      orderBy: { startDate: 'desc' },
      take: 3
    })
  ]);

  return {
    props: {
      projects: JSON.parse(JSON.stringify(projects)),
      skills: JSON.parse(JSON.stringify(skills)),
      experiences: JSON.parse(JSON.stringify(experiences))
    },
    revalidate: 3600 // Revalidation toutes les heures
  };
};

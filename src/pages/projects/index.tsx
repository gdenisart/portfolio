import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string | null;
  technologies: string[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        // On parse le champ technologies si besoin
        const safeProjects = (data.projects || []).map((project: any) => ({
          ...project,
          technologies: Array.isArray(project.technologies)
            ? project.technologies
            : (project.technologies ? JSON.parse(project.technologies) : []),
        }));
        setProjects(safeProjects);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-8">
      <h1 className="text-4xl font-bold text-purple-500 mb-8 text-center">Projets</h1>
      {loading ? (
        <div className="text-center text-slate-400">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-slate-800 rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform"
            >
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-purple-400 mb-2">{project.title}</h2>
                <p className="text-slate-300 mb-4 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-block text-purple-400 hover:underline font-medium"
                >
                  Voir le projet →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

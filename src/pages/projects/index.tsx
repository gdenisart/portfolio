

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Modal from '@/components/Modal';
import { Project } from '@/types';

function safeParseTechnologies(tech: string) {
  try {
    const parsed = JSON.parse(tech);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'string') return [parsed];
    return [];
  } catch {
    return [];
  }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data.projects || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des projets.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-8">
      <h1 className="text-4xl font-bold text-purple-400 mb-10 text-center drop-shadow">Projets</h1>
      {loading ? (
        <div className="text-center text-slate-400">Chargement...</div>
      ) : error ? (
        <div className="text-center text-red-400">{error}</div>
      ) : projects.length === 0 ? (
        <div className="text-center text-slate-400">Aucun projet enregistré.</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={() => setSelected(project)}
              className="bg-slate-800 rounded-xl p-0 border border-slate-700 shadow block hover:border-purple-500/70 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 overflow-hidden text-left"
              tabIndex={0}
            >
              {project.imageUrl && (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-48 object-cover object-center border-b border-slate-700"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-purple-300">{project.title}</h2>
                <p className="text-slate-300 mb-2 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(Array.isArray(safeParseTechnologies(project.technologies))
                    ? safeParseTechnologies(project.technologies)
                    : []).map((tech: string) => (
                    <span key={tech} className="bg-purple-700/30 text-purple-200 px-2 py-0.5 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
                {project.featured && <span className="inline-block bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded text-xs mb-2">En vedette</span>}
                <div className="mt-2">
                  <span className="inline-block text-purple-400 hover:underline font-medium">Voir le projet →</span>
                </div>
              </div>
            </button>
          ))}
        </motion.div>
      )}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div>
            {selected.imageUrl && (
              <img
                src={selected.imageUrl}
                alt={selected.title}
                className="w-full h-56 object-cover object-center rounded-lg mb-4 border border-slate-700"
              />
            )}
            <h2 className="text-2xl font-bold text-purple-400 mb-2">{selected.title}</h2>
            <p className="text-slate-300 mb-4">{selected.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {(Array.isArray(safeParseTechnologies(selected.technologies))
                ? safeParseTechnologies(selected.technologies)
                : []).map((tech: string) => (
                <span key={tech} className="bg-purple-700/30 text-purple-200 px-2 py-0.5 rounded text-xs">
                  {tech}
                </span>
              ))}
            </div>
            {selected.featured && (
              <span className="inline-block bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded text-xs mb-2">En vedette</span>
            )}
            {selected.githubUrl && (
              <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer" className="block mt-4 text-blue-400 hover:underline">Voir sur GitHub</a>
            )}
            {selected.liveUrl && (
              <a href={selected.liveUrl} target="_blank" rel="noopener noreferrer" className="block mt-2 text-green-400 hover:underline">Voir le site</a>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

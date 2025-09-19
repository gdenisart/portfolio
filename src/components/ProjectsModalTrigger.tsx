import { useState } from 'react';
import Modal from './Modal';
import { Project } from '@/types';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

export default function ProjectsModalTrigger({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);
  return (
    <>
      <motion.button
        className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 mt-12"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
      >
        <span>Voir tous les projets</span>
        <ExternalLink size={16} />
      </motion.button>
      <Modal isOpen={open} onClose={() => { setOpen(false); setSelected(null); }}>
        <AnimatePresence mode="wait">
          {!selected ? (
            <motion.div
              key="list"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="max-h-[80vh] overflow-y-auto p-2"
            >
              <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">Tous les projets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow hover:border-purple-500/70 hover:shadow-lg transition-all duration-200 text-left w-full"
                    onClick={() => setSelected(project)}
                  >
                    {project.imageUrl && (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-40 object-cover object-center rounded mb-2 border border-slate-700"
                      />
                    )}
                    <h3 className="text-lg font-semibold text-purple-300 mb-1">{project.title}</h3>
                    <p className="text-slate-300 mb-2 line-clamp-2">{project.description}</p>
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
                    <div className="flex gap-2 mt-2">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">GitHub</a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline text-xs">Site</a>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detail"
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="max-h-[80vh] overflow-y-auto p-2 relative"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute left-0 top-0 flex items-center gap-2 text-purple-400 hover:text-purple-200 font-semibold text-lg px-4 py-2 z-10"
                aria-label="Retour à la liste"
              >
                <ArrowLeft size={22} /> Retour
              </button>
              <div className="pt-12 max-w-2xl mx-auto">
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
                <div className="flex gap-4 mt-4">
                  {selected.githubUrl && (
                    <a href={selected.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-base">GitHub</a>
                  )}
                  {selected.liveUrl && (
                    <a href={selected.liveUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline text-base">Site</a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </>
  );
}
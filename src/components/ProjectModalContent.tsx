import { Project } from '@/types';
import { safeParseTechnologies } from '@/pages/projects/index';

interface ProjectModalContentProps {
  project: Project;
}

export default function ProjectModalContent({ project }: ProjectModalContentProps) {
  return (
    <div>
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-56 object-cover object-center rounded-lg mb-4 border border-slate-700"
        />
      )}
      <h2 className="text-2xl font-bold text-purple-400 mb-2">{project.title}</h2>
      <p className="text-slate-300 mb-4">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {(Array.isArray(safeParseTechnologies(project.technologies))
          ? safeParseTechnologies(project.technologies)
          : []).map((tech: string) => (
          <span key={tech} className="bg-purple-700/30 text-purple-200 px-2 py-0.5 rounded text-xs">
            {tech}
          </span>
        ))}
      </div>
      {project.featured && (
        <span className="inline-block bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded text-xs mb-2">En vedette</span>
      )}
    </div>
  );
}

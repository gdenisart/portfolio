import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Project } from '@/types';

export default function AdminProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/projects/${id}`)
      .then(res => res.json())
      .then(data => {
        setProject(data.project || null);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement du projet.');
        setLoading(false);
      });
  }, [id]);

  return (
    <>
      <Head>
        <title>Détail projet - Admin</title>
        <meta name="description" content="Détail d'un projet du portfolio" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="text-slate-400">Chargement...</div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : !project ? (
              <div className="text-slate-400">Projet introuvable.</div>
            ) : (
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow relative">
                <div className="absolute top-8 right-8">
                  <a
                    href={`/admin/projects/${project.id}/edit`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 01.586-1.414z" /></svg>
                    Modifier
                  </a>
                </div>
                <h1 className="text-2xl font-bold mb-2 text-white">{project.title}</h1>
                <p className="text-slate-400 mb-4">{project.description}</p>
                <div className="mb-2 text-slate-500 text-sm">ID: {project.id}</div>
                <div className="mb-4">
                  <span className="font-semibold text-slate-300">Technologies :</span>{' '}
                  {JSON.parse(project.technologies).map((tech: string) => (
                    <span key={tech} className="bg-purple-700/30 text-purple-200 px-2 py-0.5 rounded text-xs mr-2">{tech}</span>
                  ))}
                </div>
                {project.longDescription && (
                  <div className="mb-4">
                    <span className="font-semibold text-slate-300">Description détaillée :</span>
                    <p className="text-slate-300 mt-1">{project.longDescription}</p>
                  </div>
                )}
                {project.imageUrl && (
                  <img src={project.imageUrl} alt={project.title} className="rounded-lg mb-4 max-h-64 object-cover" />
                )}
                <div className="flex flex-wrap gap-4 mt-4">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Code source</a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Voir en ligne</a>
                  )}
                  {project.featured && (
                    <span className="inline-block bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded text-xs">En vedette</span>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-6">Créé le {new Date(project.createdAt).toLocaleDateString()} • Modifié le {new Date(project.updatedAt).toLocaleDateString()}</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

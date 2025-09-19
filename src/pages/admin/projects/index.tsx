import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/lib/useAuth';
import Head from 'next/head';
import Link from 'next/link';
import { Project } from '@/types';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { LayoutDashboard, FolderOpen, Wrench, Briefcase, Mail } from 'lucide-react';

export default function AdminProjects() {
  const { admin, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!admin) {
      router.push('/admin');
      return;
    }
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
  }, [admin, router]);

  return (
    <>
      <Head>
        <title>Projets - Admin</title>
        <meta name="description" content="Résumé des projets enregistrés" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
        {/* Sidebar */}
        <AdminSidebar />
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Projets enregistrés</h1>
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-5 py-2 rounded-lg shadow hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Ajouter un projet
              </Link>
            </div>
            {loading ? (
              <div className="text-slate-400">Chargement...</div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : projects.length === 0 ? (
              <div className="text-slate-400">Aucun projet enregistré.</div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow block hover:border-purple-500/70 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                    <p className="text-slate-400 mb-2">{project.description}</p>
                    <div className="text-xs text-slate-500 mb-1">ID: {project.id}</div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(Array.isArray(safeParseTechnologies(project.technologies))
                        ? safeParseTechnologies(project.technologies)
                        : []).map((tech: string) => (
                        <span key={tech} className="bg-purple-700/30 text-purple-200 px-2 py-0.5 rounded text-xs">{tech}</span>
                      ))}
                    </div>
                    {project.featured && <span className="inline-block bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded text-xs">En vedette</span>}
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

// Helper pour parser en toute sécurité
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

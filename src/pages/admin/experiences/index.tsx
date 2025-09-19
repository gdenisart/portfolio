import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash } from 'lucide-react';
import Head from 'next/head';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Experience } from '@/types';

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/experiences')
      .then(res => res.json())
      .then(data => {
        setExperiences(data.experiences || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des expériences.');
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Head>
        <title>Expériences - Admin</title>
        <meta name="description" content="Gestion des expériences du portfolio" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Expériences</h1>
              <Link
                href="/admin/experiences/new"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                Nouvelle expérience
              </Link>
            </div>
            {loading ? (
              <div className="text-slate-400">Chargement...</div>
            ) : error ? (
              <div className="text-red-400 mb-4">{error}</div>
            ) : experiences.length === 0 ? (
              <div className="text-slate-400">Aucune expérience enregistrée.</div>
            ) : (
              <ul className="space-y-3">
                {experiences.map(exp => (
                  <li key={exp.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-white flex flex-col gap-1 group hover:bg-slate-700/50 transition cursor-pointer">
                    <Link href={`/admin/experiences/${exp.id}`} className="block focus:outline-none">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="font-medium group-hover:underline">{exp.title}</span>
                          <span className="ml-3 text-slate-400 text-sm">{exp.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            className="p-2 rounded hover:bg-blue-700/30 transition-colors"
                            title="Modifier"
                            onClick={e => { e.preventDefault(); /* TODO: ouvrir la modale d'édition */ }}
                          >
                            <Pencil size={18} className="text-blue-400 hover:text-blue-500" />
                          </button>
                          <button
                            type="button"
                            className="p-2 rounded hover:bg-red-700/30 transition-colors"
                            title="Supprimer"
                            onClick={e => { e.preventDefault(); /* TODO: implémenter la suppression */ }}
                          >
                            <Trash size={18} className="text-red-400 hover:text-red-500" />
                          </button>
                        </div>
                      </div>
                      <div className="text-slate-400 text-xs">
                        {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : exp.current ? 'Aujourd\'hui' : ''}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Experience } from '@/types';
import { Pencil, Trash } from 'lucide-react';
import Link from 'next/link';

export default function AdminExperienceDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/experiences/${id}`)
      .then(res => res.json())
      .then(data => {
        setExperience(data.experience || null);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement de l\'expérience.');
        setLoading(false);
      });
  }, [id]);

  return (
    <>
      <Head>
        <title>Détail expérience - Admin</title>
        <meta name="description" content="Détail d'une expérience du portfolio" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-2xl mx-auto">
            {loading ? (
              <div className="text-slate-400">Chargement...</div>
            ) : error ? (
              <div className="text-red-400 mb-4">{error}</div>
            ) : !experience ? (
              <div className="text-slate-400">Expérience introuvable.</div>
            ) : (
              <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 shadow text-white">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold">{experience.title}</h1>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/experiences/${experience.id}/edit`}
                      className="p-2 rounded hover:bg-blue-700/30 transition-colors"
                      title="Modifier"
                    >
                      <Pencil size={20} className="text-blue-400 hover:text-blue-500" />
                    </Link>
                    <button
                      type="button"
                      className="p-2 rounded hover:bg-red-700/30 transition-colors"
                      title="Supprimer"
                      onClick={() => {/* TODO: implémenter la suppression */}}
                    >
                      <Trash size={20} className="text-red-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="text-slate-400 text-sm mb-4">{experience.company} &bull; {experience.location}</div>
                <div className="text-slate-400 text-xs mb-4">
                  {new Date(experience.startDate).toLocaleDateString()} - {experience.endDate ? new Date(experience.endDate).toLocaleDateString() : experience.current ? 'Aujourd\'hui' : ''}
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-slate-300">Description :</span>
                  <div className="mt-1 whitespace-pre-line text-slate-200">{experience.description}</div>
                </div>
                {experience.technologies && (
                  <div className="mb-4">
                    <span className="font-semibold text-slate-300">Technologies :</span>
                    <div className="mt-1 text-slate-200">
                      {JSON.parse(experience.technologies).join(', ')}
                    </div>
                  </div>
                )}
                {experience.achievements && (
                  <div className="mb-4">
                    <span className="font-semibold text-slate-300">Réalisations :</span>
                    <ul className="mt-1 text-slate-200 list-disc list-inside space-y-1">
                      {JSON.parse(experience.achievements).map((ach: string, i: number) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

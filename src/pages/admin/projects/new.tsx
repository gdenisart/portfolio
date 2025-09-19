import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import Head from 'next/head';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminProjectNew() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    technologies: [] as string[],
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    featured: false
  });
  const [techInput, setTechInput] = useState('');
  const techInputRef = useRef<HTMLInputElement>(null);
  const techSuggestions = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Prisma', 'Tailwind CSS', 'Framer Motion', 'AOS', 'Redux', 'Firebase', 'PostgreSQL', 'SQLite', 'Chart.js', 'Stripe',
    // C# et .NET Core
    'C#', '.NET', '.NET Core', 'ASP.NET', 'ASP.NET Core', 'Entity Framework / Core', 'SignalR', 'MAUI', 'WPF', 'Dapper', 'AutoMapper', 'Swagger', 'Web API', 'REST', 'Microservices', 'Docker', 'IdentityServer', 'Hangfire',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name === 'technologies') return; // handled separately
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Ajout d'une technologie
  const handleAddTech = (tech: string) => {
    if (!tech.trim() || form.technologies.includes(tech.trim())) return;
    setForm(prev => ({ ...prev, technologies: [...prev.technologies, tech.trim()] }));
    setTechInput('');
    techInputRef.current?.focus();
  };

  // Suppression d'une technologie
  const handleRemoveTech = (tech: string) => {
    setForm(prev => ({ ...prev, technologies: prev.technologies.filter(t => t !== tech) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, technologies: JSON.stringify(form.technologies) })
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
      const data = await res.json();
      router.push(`/admin/projects/${data.project.id}`);
    } catch {
      setError('Erreur lors de la création du projet.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Nouveau projet - Admin</title>
        <meta name="description" content="Création d'un nouveau projet du portfolio" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Nouveau projet</h1>
            {error && <div className="text-red-400 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 rounded-xl p-8 border border-slate-700 shadow">
              <div>
                <label className="block text-slate-300 mb-1">Titre</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 rounded bg-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <input name="description" value={form.description} onChange={handleChange} className="w-full p-2 rounded bg-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description détaillée</label>
                <textarea name="longDescription" value={form.longDescription} onChange={handleChange} className="w-full p-2 rounded bg-slate-700 text-white" rows={3} />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Technologies</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.technologies.map((tech) => (
                    <span key={tech} className="bg-purple-700/30 text-purple-200 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                      {tech}
                      <button type="button" onClick={() => handleRemoveTech(tech)} className="ml-1 text-purple-300 hover:text-red-400">&times;</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    ref={techInputRef}
                    type="text"
                    className="flex-1 p-2 rounded bg-slate-700 text-white"
                    placeholder="Ajouter une technologie..."
                    value={techInput}
                    onChange={e => setTechInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech(techInput);
                      }
                    }}
                    list="tech-suggestions"
                  />
                  <button
                    type="button"
                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    onClick={() => handleAddTech(techInput)}
                  >Ajouter</button>
                </div>
                <datalist id="tech-suggestions">
                  {techSuggestions.filter(s => !form.technologies.includes(s)).map(s => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Image (URL)</label>
                <input name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full p-2 rounded bg-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Lien GitHub</label>
                <input name="githubUrl" value={form.githubUrl} onChange={handleChange} className="w-full p-2 rounded bg-slate-700 text-white" />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Lien en ligne</label>
                <input name="liveUrl" value={form.liveUrl} onChange={handleChange} className="w-full p-2 rounded bg-slate-700 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} id="featured" />
                <label htmlFor="featured" className="text-slate-300">Mettre en avant</label>
              </div>
              <button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50">
                {saving ? 'Création...' : 'Créer le projet'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

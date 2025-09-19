import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import Head from 'next/head';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminExperienceNew() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    technologies: [] as string[],
    achievements: [] as string[],
  });
  const [techInput, setTechInput] = useState('');
  const [achInput, setAchInput] = useState('');
  const techInputRef = useRef<HTMLInputElement>(null);
  const achInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

  // Ajout d'une réalisation
  const handleAddAch = (ach: string) => {
    if (!ach.trim() || form.achievements.includes(ach.trim())) return;
    setForm(prev => ({ ...prev, achievements: [...prev.achievements, ach.trim()] }));
    setAchInput('');
    achInputRef.current?.focus();
  };

  // Suppression d'une réalisation
  const handleRemoveAch = (ach: string) => {
    setForm(prev => ({ ...prev, achievements: prev.achievements.filter(a => a !== ach) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          technologies: JSON.stringify(form.technologies),
          achievements: JSON.stringify(form.achievements),
        })
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
      const data = await res.json();
      router.push(`/admin/experiences/${data.experience.id}`);
    } catch {
      setError('Erreur lors de la création de l\'expérience.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Nouvelle expérience - Admin</title>
        <meta name="description" content="Création d'une nouvelle expérience du portfolio" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Nouvelle expérience</h1>
            {error && <div className="text-red-400 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800 rounded-xl p-8 border border-slate-700 shadow">
              <div>
                <label className="block text-slate-300 mb-1">Titre</label>
                <input name="title" value={form.title} onChange={handleChange} className="w-full p-2 rounded bg-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Entreprise</label>
                <input name="company" value={form.company} onChange={handleChange} className="w-full p-2 rounded bg-slate-700 text-white" required />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Lieu</label>
                <input name="location" value={form.location} onChange={handleChange} className="w-full p-2 rounded bg-slate-700 text-white" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-slate-300 mb-1">Date de début</label>
                  <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full p-2 rounded bg-slate-700 text-white" required />
                </div>
                <div className="flex-1">
                  <label className="block text-slate-300 mb-1">Date de fin</label>
                  <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full p-2 rounded bg-slate-700 text-white" disabled={form.current} />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 text-slate-300 mb-1">
                    <input type="checkbox" name="current" checked={form.current} onChange={handleChange} />
                    Actuel
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 rounded bg-slate-700 text-white" rows={3} />
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
                  />
                  <button
                    type="button"
                    className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                    onClick={() => handleAddTech(techInput)}
                  >Ajouter</button>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Réalisations</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.achievements.map((ach) => (
                    <span key={ach} className="bg-blue-700/30 text-blue-200 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                      {ach}
                      <button type="button" onClick={() => handleRemoveAch(ach)} className="ml-1 text-blue-300 hover:text-red-400">&times;</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    ref={achInputRef}
                    type="text"
                    className="flex-1 p-2 rounded bg-slate-700 text-white"
                    placeholder="Ajouter une réalisation..."
                    value={achInput}
                    onChange={e => setAchInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAch(achInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => handleAddAch(achInput)}
                  >Ajouter</button>
                </div>
              </div>
              <button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50">
                {saving ? 'Création...' : 'Créer l\'expérience'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Skill } from '@/types';

import { Pencil, Trash, X, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdminSkills() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', level: '', category: '' });
  const [adding, setAdding] = useState(false);
  const openAddModal = () => {
    setAddForm({ name: '', level: '', category: '' });
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
    setAddForm({ name: '', level: '', category: '' });
  };

  const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addForm, level: Number(addForm.level) })
      });
      if (!res.ok) throw new Error('Erreur lors de l\'ajout');
      const data = await res.json();
      setSkills(skills => [...skills, data.skill]);
      closeAddModal();
    } catch {
      alert('Erreur lors de l\'ajout.');
    } finally {
      setAdding(false);
    }
  };
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [editForm, setEditForm] = useState({ name: '', level: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/skills')
      .then(res => res.json())
      .then(data => {
        setSkills(data.skills || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des compétences.');
        setLoading(false);
      });
  }, []);

  const openEditModal = (skill: Skill) => {
    setEditSkill(skill);
    setEditForm({ name: skill.name, level: String(skill.level) });
  };

  const closeEditModal = () => {
    setEditSkill(null);
    setEditForm({ name: '', level: '' });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editSkill) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/skills/${editSkill.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm, level: Number(editForm.level) })
      });
      if (!res.ok) throw new Error('Erreur lors de la modification');
      // Met à jour la liste locale
      setSkills(skills => skills.map(s => s.id === editSkill.id ? { ...s, ...editForm, level: Number(editForm.level) } : s));
      closeEditModal();
    } catch {
      alert('Erreur lors de la modification.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Compétences - Admin</title>
        <meta name="description" content="Gestion des compétences du portfolio" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Compétences</h1>
              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                <Plus size={18} />
                Ajouter
              </button>
            </div>
      {/* Modale d'ajout avec animation */}
      <AnimatePresence>
        {addModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="bg-slate-800 border border-slate-700 rounded-xl p-8 w-full max-w-md relative shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="absolute top-3 right-3 p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                onClick={closeAddModal}
                title="Fermer"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold text-white mb-4">Ajouter une compétence</h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-1">Nom</label>
                  <input
                    name="name"
                    value={addForm.name}
                    onChange={handleAddChange}
                    className="w-full p-2 rounded bg-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Niveau (%)</label>
                  <input
                    name="level"
                    type="number"
                    min="0"
                    max="100"
                    value={addForm.level}
                    onChange={handleAddChange}
                    className="w-full p-2 rounded bg-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Catégorie</label>
                  <select
                    name="category"
                    value={addForm.category}
                    onChange={handleAddChange}
                    className="w-full p-2 rounded bg-slate-700 text-white"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    <option value="frontend">Frontend</option>
                    <option value="backend">Backend</option>
                    <option value="devops">DevOps</option>
                    <option value="database">Base de données</option>
                    <option value="mobile">Mobile</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={adding}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50"
                >
                  {adding ? 'Ajout...' : 'Ajouter'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
            {loading ? (
              <div className="text-slate-400">Chargement...</div>
            ) : error ? (
              <div className="text-red-400 mb-4">{error}</div>
            ) : skills.length === 0 ? (
              <div className="text-slate-400">Aucune compétence enregistrée.</div>
            ) : (
              <ul className="space-y-3">
                {skills.map(skill => (
                  <li key={skill.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-white">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <span className="font-medium">{skill.name}</span>
                        <span className="ml-3 text-slate-400 text-sm">{skill.level}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="p-2 rounded hover:bg-blue-700/30 transition-colors"
                          title="Modifier"
                          onClick={() => openEditModal(skill)}
                        >
                          <Pencil size={18} className="text-blue-400 hover:text-blue-500" />
                        </button>
                        <button
                          type="button"
                          className="p-2 rounded hover:bg-red-700/30 transition-colors"
                          title="Supprimer"
                          onClick={async () => {
                            if (window.confirm('Supprimer cette compétence ?')) {
                              try {
                                const res = await fetch(`/api/skills/${skill.id}`, { method: 'DELETE' });
                                if (!res.ok && res.status !== 204) throw new Error('Erreur lors de la suppression');
                                setSkills(skills => skills.filter(s => s.id !== skill.id));
                              } catch {
                                alert('Erreur lors de la suppression.');
                              }
                            }
                          }}
                        >
                          <Trash size={18} className="text-red-400 hover:text-red-500" />
                        </button>
                      </div>
      {/* Modale d'édition avec animation */}
      <AnimatePresence>
        {editSkill && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="bg-slate-800 border border-slate-700 rounded-xl p-8 w-full max-w-md relative shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="absolute top-3 right-3 p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
                onClick={closeEditModal}
                title="Fermer"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-bold text-white mb-4">Modifier la compétence</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 mb-1">Nom</label>
                  <input
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    className="w-full p-2 rounded bg-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Niveau (%)</label>
                  <input
                    name="level"
                    type="number"
                    min="0"
                    max="100"
                    value={editForm.level}
                    onChange={handleEditChange}
                    className="w-full p-2 rounded bg-slate-700 text-white"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
                    </div>
                    {/* Barre de progression */}
                    <div className="mt-2 h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
                        style={{ width: `${typeof skill.level === 'number' ? skill.level : parseInt(skill.level, 10)}%` }}
                      />
                    </div>
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

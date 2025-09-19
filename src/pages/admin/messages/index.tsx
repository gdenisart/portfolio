import { useEffect, useState } from 'react';
import { Pencil, Trash, Mail, MessagesSquareIcon } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAuthenticatedFetch } from '@/lib/useAuth';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const authenticatedFetch = useAuthenticatedFetch();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    authenticatedFetch('/api/messages')
      .then(res => res.json())
      .then(data => {
        setMessages(data.messages || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement des messages.');
        setLoading(false);
      });
  }, []);

  const markAsRead = async (id: number, read: boolean) => {
    await fetch(`/api/messages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read }),
    });
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, read } : m));
  };

  const deleteMessage = async (id: number) => {
    await fetch(`/api/messages/${id}`, { method: 'DELETE' });
    setMessages(msgs => msgs.filter(m => m.id !== id));
  };

  // Filtrage par recherche
  const filteredMessages = messages.filter(m =>
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Messages - Admin</title>
        <meta name="description" content="Gestion des messages du portfolio" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h1 className="text-2xl font-bold text-white">Tous les messages</h1>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un message..."
                className="w-full sm:w-64 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            {loading ? (
              <div className="text-slate-400">Chargement...</div>
            ) : error ? (
              <div className="text-red-400 mb-4">{error}</div>
            ) : filteredMessages.length === 0 ? (
              <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700/50 text-center">
                <MessagesSquareIcon className="mx-auto text-slate-600 mb-4" size={48} />
                <p className="text-slate-400 mb-2">Aucun message</p>
                <p className="text-slate-500 text-sm">Les messages reçus apparaîtront ici</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {filteredMessages.map(msg => (
                  <li key={msg.id}>
                    <Link
                      href={`/admin/messages/${msg.id}`}
                      className={`block rounded-lg p-4 border flex flex-col gap-1 group hover:bg-slate-700/50 transition cursor-pointer ${msg.read ? 'bg-slate-800 border-slate-700' : 'bg-purple-950 border-purple-700'}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <span className="font-medium group-hover:underline text-purple-400 flex items-center gap-2">
                            <Mail size={16} /> {msg.subject}
                          </span>
                          <span className="ml-3 text-slate-400 text-sm">{msg.name} &lt;<span className="underline text-blue-400">{msg.email}</span>&gt;</span>
                        </div>
                        {/* Actions supprimées */}
                      </div>
                      <div className="text-slate-400 text-xs">
                        {new Date(msg.createdAt).toLocaleString('fr-FR')} • {msg.read ? 'Lu' : 'Non lu'}
                      </div>
                      <div className="text-slate-200 mt-2 text-sm">
                        {msg.content}
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

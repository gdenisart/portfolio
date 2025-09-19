
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Head from 'next/head';
import { Trash, CheckCircle } from 'lucide-react';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessageDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/messages/${id}`)
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        setLoading(false);
      })
      .catch(() => {
        setError('Erreur lors du chargement du message.');
        setLoading(false);
      });
  }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message || !reply.trim()) return;
    
    setSending(true);
    
    try {
      const response = await fetch('/api/admin/reply-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId: message.id,
          replyContent: reply
        }),
      });

      if (response.ok) {
        setSent(true);
        setReply('');
        // Optionnel : marquer le message comme lu après réponse
        if (!message.read) {
          await fetch(`/api/messages/${message.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ read: true }),
          });
          setMessage({ ...message, read: true });
        }
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      console.error('Erreur:', error);
      // Vous pouvez ajouter un état d'erreur ici si nécessaire
    } finally {
      setSending(false);
    }
  };


  // Marquer comme lu/non-lu
  const toggleRead = async () => {
    if (!message) return;
    setActionLoading(true);
    await fetch(`/api/messages/${message.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: !message.read }),
    });
    setMessage({ ...message, read: !message.read });
    setActionLoading(false);
  };

  // Supprimer le message
  const deleteMessage = async () => {
    if (!message) return;
    if (!confirm('Supprimer ce message ?')) return;
    setActionLoading(true);
    await fetch(`/api/messages/${message.id}`, { method: 'DELETE' });
    setActionLoading(false);
    router.push('/admin/messages');
  };

  return (
    <>
      <Head>
        <title>Message - Admin</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
        <AdminSidebar />
        <main className="flex-1 p-8 flex justify-center items-start">
          <div className="w-full max-w-xl bg-slate-800 rounded-lg shadow-lg p-8 border border-slate-700 mt-8">
            {loading ? (
              <div className="text-slate-400">Chargement...</div>
            ) : error ? (
              <div className="text-red-400">{error}</div>
            ) : message ? (
              <>
                <h1 className="text-2xl font-bold text-purple-400 mb-2">{message.subject}</h1>
                <div className="text-slate-400 text-sm mb-4">
                  De : <span className="font-medium text-slate-300">{message.name}</span> &lt;<a href={`mailto:${message.email}`} className="underline text-blue-400">{message.email}</a>&gt;<br />
                  Reçu le : {new Date(message.createdAt).toLocaleString('fr-FR')}
                </div>
                <div className="text-slate-200 mb-6 whitespace-pre-line">{message.content}</div>

                <div className="flex gap-3 mb-6">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded ${message.read ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold transition disabled:opacity-60`}
                    onClick={toggleRead}
                    disabled={actionLoading}
                  >
                    <CheckCircle size={18} />
                    {message.read ? 'Marquer comme non-lu' : 'Marquer comme lu'}
                  </button>
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-60"
                    onClick={deleteMessage}
                    disabled={actionLoading}
                  >
                    <Trash size={18} />
                    Supprimer
                  </button>
                </div>

                <hr className="my-6 border-slate-700" />
                <h2 className="text-lg font-semibold text-white mb-2">Répondre</h2>
                {sent ? (
                  <div className="text-green-400 font-medium mb-2">Réponse envoyée !</div>
                ) : (
                  <form onSubmit={handleReply} className="space-y-4">
                    <textarea
                      className="w-full rounded-lg bg-slate-900 border border-slate-700 text-slate-200 p-3 focus:outline-none focus:border-purple-500 resize-none min-h-[100px]"
                      placeholder="Votre réponse..."
                      value={reply}
                      onChange={e => setReply(e.target.value)}
                      required
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-60"
                      disabled={sending || !reply.trim()}
                    >
                      {sending ? 'Envoi...' : 'Envoyer la réponse'}
                    </button>
                  </form>
                )}
              </>
            ) : null}
          </div>
        </main>
      </div>
    </>
  );
}

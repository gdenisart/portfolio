import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Wrench, 
  Briefcase, 
  Mail, 
  LogOut,
  BarChart3,
  Eye,
  Plus,
  MessagesSquareIcon
} from 'lucide-react';
import { useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';

interface DashboardStats {
  projects: number;
  skills: number;
  experiences: number;
  messages: number;
}

export default function AdminDashboard() {
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    skills: 0,
    experiences: 0,
    messages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { admin, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirection si non connecté
  useEffect(() => {
    if (!authLoading && !admin) {
      router.push('/admin');
    }
  }, [admin, authLoading, router]);

  // Charger les statistiques et les messages non-lus
  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) throw new Error('Erreur API stats');
        const data = await res.json();
        setStats({
          projects: data.projects,
          skills: data.skills,
          experiences: data.experiences,
          messages: data.messages
        });
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    const loadUnreadMessages = async () => {
      try {
        const res = await fetch('/api/admin/unread-messages');
        if (!res.ok) throw new Error('Erreur API messages');
        const data = await res.json();
        setUnreadMessages(data.messages || []);
      } catch (e) {
        setUnreadMessages([]);
      }
    };
    if (admin) {
      loadStats();
      loadUnreadMessages();
    }
  }, [admin]);

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  if (authLoading || !admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  const quickActions = [
    {
      icon: Plus,
      label: 'Nouveau Projet',
      description: 'Ajouter un projet au portfolio',
      href: '/admin/projects/new',
      color: 'from-purple-500 to-blue-500'
    },
    {
      icon: Wrench,
      label: 'Nouvelle Compétence',
      description: 'Ajouter une compétence technique',
      href: '/admin/skills/new',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Briefcase,
      label: 'Nouvelle Expérience',
      description: 'Ajouter une expérience professionnelle',
      href: '/admin/experiences/new',
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: Eye,
      label: 'Voir le Portfolio',
      description: 'Visualiser le portfolio public',
      href: '/',
      color: 'from-orange-500 to-red-500',
      external: true
    }
  ];

  return (
    <>
      <Head>
        <title>Dashboard Admin - Portfolio</title>
        <meta name="description" content="Panel d'administration du portfolio" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="flex">
          {/* Sidebar */}
          <AdminSidebar admin={admin} handleLogout={handleLogout} />

          {/* Main Content */}
          <main className="flex-1 p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Bienvenue, {admin.username} !
                </h1>
                <p className="text-slate-400">
                  Gérez votre portfolio depuis cette interface d&apos;administration.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Projets', value: stats.projects, icon: FolderOpen, color: 'purple' },
                  { label: 'Compétences', value: stats.skills, icon: Wrench, color: 'blue' },
                  { label: 'Expériences', value: stats.experiences, icon: Briefcase, color: 'green' },
                  { label: 'Messages', value: stats.messages, icon: Mail, color: 'orange' }
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      className="bg-slate-800/50 backdrop-blur-md rounded-xl p-6 border border-slate-700/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-400 text-sm">{stat.label}</p>
                          <p className="text-2xl font-bold text-white">
                            {isLoading ? '...' : stat.value}
                          </p>
                        </div>
                        <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
                          <IconComponent className={`text-${stat.color}-400`} size={24} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Actions rapides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <motion.div
                        key={action.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                      >
                        <Link
                          href={action.href}
                          target={action.external ? '_blank' : undefined}
                          className="block p-4 bg-slate-800/30 backdrop-blur-md rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 group"
                        >
                          <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                            <IconComponent className="text-white" size={20} />
                          </div>
                          <h3 className="font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                            {action.label}
                          </h3>
                          <p className="text-slate-400 text-sm">
                            {action.description}
                          </p>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Derniers messages non-lus */}
              <motion.div
                className="bg-slate-800/30 backdrop-blur-md rounded-xl p-6 border border-slate-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h2 className="text-xl font-bold text-white mb-4">Messages non-lus</h2>
                {unreadMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessagesSquareIcon className="mx-auto text-slate-600 mb-4" size={48} />
                    <p className="text-slate-400 mb-2">Aucun message non-lu</p>
                    <p className="text-slate-500 text-sm">Les messages non-lus apparaîtront ici</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-700">
                    {unreadMessages.map(msg => (
                      <li key={msg.id}>
                        <Link href={`/admin/messages/${msg.id}`} className="block py-3 flex flex-col gap-1 hover:bg-slate-700/40 rounded transition">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-purple-400">{msg.subject}</span>
                            <span className="text-xs text-slate-400">{new Date(msg.createdAt).toLocaleString('fr-FR')}</span>
                          </div>
                          <div className="text-slate-300 text-sm truncate max-w-full">
                            {msg.content}
                          </div>
                          <div className="text-xs text-slate-400">
                            De : <span className="font-medium text-slate-300">{msg.name}</span> &lt;<span className="underline text-blue-400">{msg.email}</span>&gt;
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
}
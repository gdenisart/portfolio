
interface DashboardStats {
  projects: number;
  skills: number;
  experiences: number;
  messages: number;
}

function useUnreadMessagesCount() {
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    fetch('/api/admin/unread-messages-count')
      .then(res => res.json())
      .then(data => setUnread(data.count ?? 0));
  }, []);
  return unread;
}
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LayoutDashboard, FolderOpen, Wrench, Briefcase, Mail, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';



export default function AdminSidebar() {
  const { admin, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    skills: 0,
    experiences: 0,
    messages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const unreadMessages = useUnreadMessagesCount();

  // Charger les statistiques
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/stats');
        if (!res.ok) throw new Error('Erreur API stats');
        const data = await res.json();
        setStats({
          projects: data.projects ?? 0,
          skills: data.skills ?? 0,
          experiences: data.experiences ?? 0,
          messages: data.messages ?? 0
        });
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (admin) {
      loadStats();
    }
  }, [admin]);

  // Détection automatique de la page active
  const currentPath = router.pathname;
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/admin/dashboard',
      active: currentPath === '/admin/dashboard'
    },
    {
      icon: FolderOpen,
      label: 'Projets',
      href: '/admin/projects',
      count: stats.projects,
      active: currentPath === '/admin/projects'
    },
    {
      icon: Wrench,
      label: 'Compétences',
      href: '/admin/skills',
      count: stats.skills,
      active: currentPath === '/admin/skills'
    },
    {
      icon: Briefcase,
      label: 'Expériences',
      href: '/admin/experiences',
      count: stats.experiences,
      active: currentPath === '/admin/experiences'
    },
    {
      icon: Mail,
      label: 'Messages',
      href: '/admin/messages',
      count: stats.messages,
      badge: unreadMessages > 0,
      active: currentPath === '/admin/messages'
    }
  ];

  const handleLogout = () => {
    logout();
    router.push('/admin');
  };

  return (
    <aside
      className="w-64 bg-slate-800/50 backdrop-blur-md border-r border-slate-700/50 min-h-screen"
    >
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center font-bold text-white">
            DS
          </div>
          <div>
            <h2 className="font-bold text-white">Dashboard</h2>
            <p className="text-slate-400 text-sm">Administration</p>
          </div>
        </div>
        {/* Menu */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center justify-between space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    item.active
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent size={20} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.badge
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-600 text-slate-300'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {admin?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{admin?.username}</p>
                <p className="text-slate-400 text-xs truncate">{admin?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors text-sm"
            >
              <LogOut size={16} />
              <span>Se déconnecter</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}


import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { updatePageMeta } from '../utils/pageMeta';
import {
  LayoutDashboard,
  User,
  Code2,
  Briefcase,
  GraduationCap,
  FileText,
  Mail,
  LogOut,
  Sun,
  Moon,
  ExternalLink,
  Sparkles,
  Share2,
  Palette,
} from 'lucide-react';

const AdminLayout = () => {
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileFavicon, setProfileFavicon] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/profile', icon: User, label: 'Profile' },
    { to: '/admin/services', icon: Sparkles, label: 'Services' },
    { to: '/admin/social-links', icon: Share2, label: 'Social Links' },
    { to: '/admin/skills', icon: Code2, label: 'Skills' },
    { to: '/admin/projects', icon: Briefcase, label: 'Projects' },
    { to: '/admin/experiences', icon: GraduationCap, label: 'Experiences & Edu' },
    { to: '/admin/blogs', icon: FileText, label: 'Blogs' },
    { to: '/admin/messages', icon: Mail, label: 'Messages' },
    { to: '/admin/themes', icon: Palette, label: 'Theme Studio' },
  ];

  const currentNav = navItems.find((item) => item.to === location.pathname);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api.get('/portfolio');
        const fav = res.data?.profile?.favicon_url || res.data?.profile?.icon_image_url || '/favicon.svg';
        setProfileFavicon(fav);
        updatePageMeta({ faviconUrl: fav });
      } catch (e) {}
    };
    fetchMeta();
  }, []);

  useEffect(() => {
    const title = currentNav ? `${currentNav.label} | Admin Dashboard` : 'Admin Dashboard | Sakil Ahmed';
    updatePageMeta({ title, faviconUrl: profileFavicon });
  }, [location.pathname, currentNav, profileFavicon]);

  return (
    <div className="flex min-h-screen relative" style={{ color: 'var(--text-primary)', zIndex: 1 }}>
      
      {/* Sidebar (Theme Ready & Glass) */}
      <aside
        className="flex flex-col w-64 p-5 min-h-screen border-r backdrop-blur-xl shrink-0 transition-colors duration-300"
        style={{
          background: 'var(--bg-sidebar)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between px-2 mb-8">
          <div>
            <span className="text-xl font-black tracking-tight" style={{ color: 'var(--accent)' }}>
              Portfolio
            </span>
            <span className="text-xs font-mono px-2 py-0.5 ml-2 rounded-full border border-teal-400/30 bg-teal-400/10 text-teal-400 font-bold">
              Admin
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all group relative"
                style={{
                  backgroundColor: isActive ? 'var(--accent-dim)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-hover)' : '1px solid transparent',
                }}
              >
                <Icon className="w-4 h-4 mr-3" />
                {label}
                {isActive && (
                  <span
                    className="absolute right-3 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-4 border-t border-white/10" style={{ borderColor: 'var(--border-subtle)' }}>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={{
              background: 'var(--bg-surface-hover)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
            title="Toggle between Dark and Bright theme"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-teal-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              Theme: <span className="capitalize text-white" style={{ color: 'var(--text-primary)' }}>{theme}</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10">Toggle</span>
          </button>

          {/* Live site link */}
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-all border border-transparent hover:border-white/10"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Live Site
          </Link>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen backdrop-blur-sm transition-colors duration-300"
        style={{ background: 'var(--bg-surface)' }}
      >
        {/* Top Header bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {currentNav?.label || 'Admin Panel'}
            </h1>
            <p className="text-xs md:text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage and configure your portfolio data with live sync.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border transition-all"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
              title={`Switch to ${theme === 'dark' ? 'Bright / Light' : 'Dark'} theme`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-teal-600" />}
            </button>
          </div>
        </div>

        {/* Content Outlet */}
        <div className="max-w-6xl">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;

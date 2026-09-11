import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Code2, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Share2, 
  GraduationCap, 
  Palette, 
  User 
} from 'lucide-react';

const DashboardOverview = () => {
  const [stats, setStats] = useState({ 
    projects: 0, 
    skills: 0, 
    messages: 0, 
    experiences: 0, 
    blogs: 0,
    services: 0,
    socialLinks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [portfolioRes, msgsRes, servicesRes] = await Promise.all([
          api.get('/portfolio'),
          api.get('/admin/messages').catch(() => ({ data: [] })),
          api.get('/admin/services').catch(() => ({ data: [] }))
        ]);

        setStats({
          projects: portfolioRes.data.projects?.length || 0,
          skills: portfolioRes.data.skills?.length || 0,
          experiences: portfolioRes.data.experiences?.length || 0,
          blogs: portfolioRes.data.blogs?.length || 0,
          socialLinks: portfolioRes.data.socialLinks?.length || 0,
          services: servicesRes.data?.length || 0,
          messages: msgsRes.data?.filter(m => !m.is_read).length || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Projects Archive',
      count: stats.projects,
      icon: Briefcase,
      link: '/admin/projects',
      color: 'text-teal-400',
      bg: 'rgba(0, 229, 160, 0.1)',
      border: 'rgba(0, 229, 160, 0.3)',
    },
    {
      title: 'Published Articles',
      count: stats.blogs,
      icon: FileText,
      link: '/admin/blogs',
      color: 'text-cyan-400',
      bg: 'rgba(6, 182, 212, 0.1)',
      border: 'rgba(6, 182, 212, 0.3)',
    },
    {
      title: 'Skills & Tech',
      count: stats.skills,
      icon: Code2,
      link: '/admin/skills',
      color: 'text-blue-400',
      bg: 'rgba(59, 130, 246, 0.1)',
      border: 'rgba(59, 130, 246, 0.3)',
    },
    {
      title: 'Services Provided',
      count: stats.services,
      icon: Sparkles,
      link: '/admin/services',
      color: 'text-purple-400',
      bg: 'rgba(168, 85, 247, 0.1)',
      border: 'rgba(168, 85, 247, 0.3)',
    },
    {
      title: 'Career & Education',
      count: stats.experiences,
      icon: GraduationCap,
      link: '/admin/experiences',
      color: 'text-amber-400',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.3)',
    },
    {
      title: 'Unread Messages',
      count: stats.messages,
      icon: Mail,
      link: '/admin/messages',
      color: 'text-rose-400',
      bg: 'rgba(244, 63, 94, 0.1)',
      border: 'rgba(244, 63, 94, 0.3)',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.title}
              to={c.link}
              className="admin-card p-6 flex flex-col justify-between group cursor-pointer hover:border-teal-400/40 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  {c.title}
                </span>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: c.bg, border: `1px solid ${c.border}` }}
                >
                  <Icon className={`w-5 h-5 ${c.color}`} />
                </div>
              </div>

              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
                  {loading ? '...' : c.count}
                </p>
                <span className="text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }}>
                  Manage <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Access Card */}
      <div className="admin-card p-6 md:p-8">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-teal-400/30 bg-teal-400/10 text-teal-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Quick Management Hub
            </h2>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Direct access shortcuts to edit your portfolio content and account settings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Edit Profile', to: '/admin/profile', icon: User },
            { label: 'Services Studio', to: '/admin/services', icon: Sparkles },
            { label: 'Projects Archive', to: '/admin/projects', icon: Briefcase },
            { label: 'Articles & Blogs', to: '/admin/blogs', icon: FileText },
            { label: 'Skills & Tech', to: '/admin/skills', icon: Code2 },
            { label: 'Experiences & Edu', to: '/admin/experiences', icon: GraduationCap },
            { label: 'Social Profiles', to: '/admin/social-links', icon: Share2 },
            { label: 'Theme Studio', to: '/admin/themes', icon: Palette },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                className="admin-btn-secondary py-3 text-center justify-center text-xs font-semibold flex items-center gap-2"
              >
                <Icon className="w-3.5 h-3.5 text-teal-400" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;

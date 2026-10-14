import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { ProjectManager } from './ProjectManager';
import { ProfileManager } from './ProfileManager';
import { SkillsManager } from './SkillsManager';
import { ExperienceManager } from './ExperienceManager';
import { ServicesManager } from './ServicesManager';
import { SocialsManager } from './SocialsManager';
import { ThemeManager } from './ThemeManager';
import { MessageInbox } from './MessageInbox';
import { AnalyticsManager } from './AnalyticsManager';
import { MaleCoderAvatar } from '../../components/ui/MaleCoderAvatar';
import { ThemeSelector } from '../themes/ThemeSelector';
import {
  Layers,
  UserCheck,
  Code2,
  Briefcase,
  Zap,
  Share2,
  Sparkles,
  Mail,
  Activity,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useDynamicHead } from '../../lib/useDynamicHead';

type AdminTab =
  | 'projects'
  | 'profile'
  | 'skills'
  | 'experience'
  | 'services'
  | 'socials'
  | 'themes'
  | 'messages'
  | 'analytics';

const TAB_TITLES: Record<AdminTab, string> = {
  projects: 'Projects',
  profile: 'Profile & Favicon',
  skills: 'Skills',
  experience: 'Experience & Education',
  services: 'Services',
  socials: 'Social Links',
  themes: 'Themes',
  messages: 'Inbox Messages',
  analytics: 'Visitor Analytics',
};

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Profile data for sidebar avatar & identity
  const { data: profileData } = useQuery<{ profile: any }>({
    queryKey: ['profile'],
    queryFn: () => apiClient('/profile'),
  });

  useDynamicHead({
    title: `${TAB_TITLES[activeTab]} — Admin Console`,
    faviconUrl: profileData?.profile?.faviconUrl,
  });
  const profile = profileData?.profile;

  // Unread messages count for badge
  const { data: messages = [] } = useQuery<any[]>({
    queryKey: ['messages'],
    queryFn: () => apiClient<any[]>('/messages'),
  });
  const unreadCount = messages.filter((m) => !m.isRead).length;

  const handleLogout = () => {
    localStorage.removeItem('portfolio_admin_token');
    navigate('/');
  };

  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }> = [
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'profile', label: 'Profile & Bio', icon: UserCheck },
    { id: 'skills', label: 'Skills & Stack', icon: Code2 },
    { id: 'experience', label: 'Experience & Edu', icon: Briefcase },
    { id: 'services', label: 'Services', icon: Zap },
    { id: 'socials', label: 'Social Links', icon: Share2 },
    { id: 'themes', label: 'Themes', icon: Sparkles },
    { id: 'messages', label: 'Messages', icon: Mail, badge: unreadCount },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ];

  return (
    <div className="h-screen overflow-hidden bg-background text-text-main flex flex-col items-center justify-center p-2 sm:p-4 font-mono">
      {/* Mobile Top Header */}
      <header className="lg:hidden w-full bg-surface/90 backdrop-blur-md border border-border rounded-xl px-4 py-3 flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-border bg-background">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Admin" className="w-full h-full object-cover" />
            ) : (
              <MaleCoderAvatar className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-text-main leading-tight">Admin Console</div>
            <div className="text-[10px] text-accent">
              {navItems.find((n) => n.id === activeTab)?.label}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg border border-border bg-background text-text-main"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </header>

      {/* Unified 95% Master Viewport Frame (Exact layout matching public site) */}
      <div className="w-[95%] max-w-[1700px] h-[calc(100vh-2rem)] rounded-xl border border-border bg-surface/30 backdrop-blur-md overflow-hidden flex relative shadow-2xl">
        {/* Desktop Docked Left Sidebar */}
        <aside className="w-64 lg:w-72 border-r border-border bg-surface/40 flex-shrink-0 flex flex-col justify-between p-5 overflow-y-auto hidden lg:flex select-none">
          {/* Top Identity Block */}
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-border">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-border bg-background shadow-inner">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile?.name || 'Admin'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MaleCoderAvatar className="w-full h-full object-cover" />
                  )}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface animate-pulse" />
              </div>

              <div className="min-w-0">
                <h1 className="text-sm font-bold text-text-main truncate">
                  {profile?.name || 'Sakil Ahmed'}
                </h1>
                <div className="text-[10px] text-accent tracking-wider font-semibold">
                  // ADMIN_ROOT
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {navItems.map(({ id, label, icon: Icon, badge }) => {
                const isActive = activeTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors duration-150',
                      isActive
                        ? 'bg-accent/10 border border-accent/40 text-accent font-bold shadow-sm'
                        : 'border border-transparent text-text-muted hover:text-text-main hover:bg-surface-hover'
                    )}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-accent' : 'text-text-muted')} />
                      <span className="truncate">{label}</span>
                    </div>

                    {badge !== undefined && badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-accent text-background flex-shrink-0">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Control Actions */}
          <div className="pt-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between pb-2">
              <span className="text-[10px] text-text-muted uppercase">Theme</span>
              <ThemeSelector placement="top" />
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-surface-hover text-text-muted hover:text-text-main text-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-colors font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Slide-Over Drawer Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex">
            <div className="w-4/5 max-w-xs h-full bg-surface border-r border-border p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-xs font-bold text-accent">// NAVIGATION</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-text-muted hover:text-text-main">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {navItems.map(({ id, label, icon: Icon, badge }) => (
                    <button
                      key={id}
                      onClick={() => {
                        setActiveTab(id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors',
                        activeTab === id
                          ? 'bg-accent/10 border border-accent/40 text-accent font-bold'
                          : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </div>
                      {badge !== undefined && badge > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-accent text-background">
                          {badge}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-border space-y-2">
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs text-text-muted"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Site</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Content Pane with Scroll */}
        <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 bg-background relative scrollbar-thin">
          <div key={activeTab} className="animate-in fade-in duration-200">
            {activeTab === 'projects' && <ProjectManager />}
            {activeTab === 'profile' && <ProfileManager />}
            {activeTab === 'skills' && <SkillsManager />}
            {activeTab === 'experience' && <ExperienceManager />}
            {activeTab === 'services' && <ServicesManager />}
            {activeTab === 'socials' && <SocialsManager />}
            {activeTab === 'themes' && <ThemeManager />}
            {activeTab === 'messages' && <MessageInbox />}
            {activeTab === 'analytics' && <AnalyticsManager />}
          </div>
        </main>
      </div>
    </div>
  );
};

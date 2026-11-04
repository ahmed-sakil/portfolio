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
import { HexagonBackground } from '../../components/ui/HexagonBackground';
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
  ExternalLink,
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
  profile: 'Profile & Bio',
  skills: 'Skills & Stack',
  experience: 'Experience & Edu',
  services: 'Services',
  socials: 'Social Links',
  themes: 'Theme Presets',
  messages: 'Inbox Messages',
  analytics: 'Visitor Analytics',
};

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('projects');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [avatarOffset, setAvatarOffset] = useState({ x: 0, y: 0 });
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

  const handleAvatarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setAvatarOffset({
      x: -normX * 18,
      y: -normY * 8,
    });
  };

  const handleAvatarMouseLeave = () => {
    setAvatarOffset({ x: 0, y: 0 });
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

  const activeIndex = navItems.findIndex((item) => item.id === activeTab);

  return (
    <div className="h-[100dvh] w-screen overflow-hidden bg-background text-text-main flex flex-col items-center justify-start lg:justify-center font-mono select-none">
      {/* Mobile Top Header */}
      <header className="lg:hidden w-full bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between flex-shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden border border-border bg-background flex-shrink-0">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="Admin" className="w-full h-full object-cover" />
            ) : (
              <MaleCoderAvatar className="w-full h-full object-cover" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-text-main leading-tight font-mono">Admin Console</div>
            <div className="text-[10px] text-accent font-mono">
              // {TAB_TITLES[activeTab]}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg border border-border bg-surface hover:bg-surface-hover text-text-muted hover:text-text-main text-xs transition-colors"
            title="View Live Site"
            aria-label="View Live Site"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg border border-border bg-background text-text-main"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Unified Master Viewport Frame (Edge-to-edge on mobile, 98vw floating on desktop) */}
      <div className="w-full flex-1 overflow-hidden flex relative lg:w-[98vw] lg:h-[calc(100vh-2rem)] lg:my-4 lg:rounded-xl lg:border lg:border-border lg:bg-surface/30 lg:backdrop-blur-md lg:shadow-2xl">
        {/* Desktop Docked Left Sidebar with Identical Public Homepage Experience */}
        <aside className="hidden lg:flex flex-col justify-between w-80 h-full bg-surface/90 border-r border-border p-5 select-none flex-shrink-0 font-mono">
          {/* Top Profile Card with Cursor-reactive 3D Avatar */}
          <div className="flex flex-col items-center text-center">
            <div
              onMouseMove={handleAvatarMouseMove}
              onMouseLeave={handleAvatarMouseLeave}
              className="relative my-2 group cursor-pointer"
            >
              <div className="p-1 rounded-xl bg-background border border-border group-hover:border-accent/50 transition-colors shadow-inner">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-surface flex items-center justify-center relative">
                  <div
                    className="w-full h-full flex items-center justify-center will-change-transform"
                    style={{
                      transform: `translate3d(${avatarOffset.x}px, ${avatarOffset.y}px, 0) scale(1.12)`,
                      transition:
                        avatarOffset.x === 0
                          ? 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)'
                          : 'transform 0.08s ease-out',
                    }}
                  >
                    {profile?.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name || 'Admin'}
                        className="w-full h-full object-cover pointer-events-none select-none"
                      />
                    ) : (
                      <MaleCoderAvatar className="w-full h-full object-cover pointer-events-none select-none" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Developer Identity */}
            <h1 className="text-base font-bold tracking-tight text-text-main font-mono">
              {profile?.name || 'Md. Sakil Ahmed'}
            </h1>
            <p className="text-xs font-mono text-accent mt-0.5 font-semibold">
              // ADMIN_ROOT
            </p>

            {/* Live Status Chip */}
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <span className="text-text-muted">Master Console Active</span>
            </div>
          </div>

          {/* Navigation Menu with Springy Gliding Hover Backdrop & Gliding Active Left Indicator */}
          <nav
            className="relative flex flex-col gap-1 my-3"
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Springy Gliding Hover Backdrop */}
            {hoveredIndex !== null && (
              <div
                className="absolute left-0 right-0 h-[36px] rounded-lg bg-accent/15 border border-accent/30 transition-all duration-300 pointer-events-none ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
                style={{
                  top: `${hoveredIndex * 40}px`,
                }}
              />
            )}

            {/* Smooth Gliding Active Left Indicator Bar */}
            {activeIndex !== -1 && (
              <div
                className="absolute left-0 w-1 rounded-r-full bg-accent shadow-[0_0_10px_var(--color-accent)] transition-all duration-300 pointer-events-none ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20"
                style={{
                  top: `${activeIndex * 40 + 5}px`,
                  height: '26px',
                }}
              />
            )}

            {navItems.map((item, index) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  className={cn(
                    'relative z-10 w-full h-[36px] flex items-center justify-between px-3 rounded-lg text-xs font-mono transition-colors duration-150 group',
                    isActive
                      ? 'bg-background/80 text-text-main font-bold shadow-sm'
                      : 'text-text-muted hover:text-text-main'
                  )}
                >
                  <div className="flex items-center gap-2.5 pl-1.5 truncate">
                    <div
                      className={cn(
                        'w-5 h-5 flex items-center justify-center transition-colors flex-shrink-0',
                        isActive ? 'text-accent' : 'text-text-muted group-hover:text-accent'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-accent text-background">
                        {item.badge}
                      </span>
                    )}
                    <span
                      className={cn(
                        'text-[11px] font-mono transition-all duration-150',
                        isActive
                          ? 'text-accent translate-x-0 opacity-100'
                          : 'text-accent/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5'
                      )}
                    >
                      &gt;
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Bottom Footer Controls: Theme, Return to Site, Log Out */}
          <div className="pt-3 border-t border-border/50 flex flex-col gap-2 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Palette</span>
              <ThemeSelector placement="top" compact />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-background hover:bg-surface-hover text-text-muted hover:text-text-main text-xs transition-colors"
                title="View live portfolio"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Live Site</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs transition-colors font-medium"
              >
                <LogOut className="w-3 h-3" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Slide-Over Drawer Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex">
            <div className="w-4/5 max-w-xs h-full bg-surface border-r border-border p-5 flex flex-col justify-between overflow-y-auto font-mono">
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <span className="text-xs font-bold text-accent">// ADMIN_CONSOLE</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-text-muted hover:text-text-main p-1"
                  >
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
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[10px] text-text-muted uppercase">Theme</span>
                  <ThemeSelector placement="top" compact />
                </div>
                <button
                  onClick={() => navigate('/')}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border text-xs text-text-muted hover:text-text-main"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Site</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Content Pane with Scroll & Mathematical Hexagon Honeycomb Background */}
        <div className="flex-1 min-w-0 h-full relative overflow-hidden flex flex-col bg-background select-text">
          <HexagonBackground size={14} opacity={0.25} strokeWidth={0.75} />

          {/* Minimal Admin Topbar */}
          <div className="relative z-10 px-4 sm:px-6 py-3 border-b border-border/60 bg-surface/40 backdrop-blur-sm flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-accent font-bold">// ROOT</span>
              <span className="text-text-muted">/</span>
              <span className="text-text-main font-semibold">{TAB_TITLES[activeTab]}</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/80 bg-surface hover:bg-surface-hover text-[11px] text-text-muted hover:text-text-main transition-colors font-mono"
              >
                <span>Preview Site</span>
                <ExternalLink className="w-3 h-3 text-accent" />
              </a>
            </div>
          </div>

          {/* Main Scrollable Management Views */}
          <main className="flex-1 min-w-0 h-full overflow-y-auto p-4 sm:p-6 lg:p-8 relative scrollbar-thin z-10">
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
    </div>
  );
};

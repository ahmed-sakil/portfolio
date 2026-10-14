import React from 'react';
import { X, User, Code2, Briefcase, Mail, ExternalLink, Github, Linkedin, FileText, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';
import { ThemeSelector } from '../../features/themes/ThemeSelector';
import { MaleCoderAvatar } from '../ui/MaleCoderAvatar';
import { renderResolvedIcon } from '../../lib/iconResolver';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: {
    name: string;
    title: string;
    avatarUrl?: string | null;
    bio?: string;
    resumeUrl?: string | null;
    nationality?: string | null;
    languages?: string | null;
    experienceYears?: string | null;
    availableForWork?: boolean | null;
  } | null;
  socials?: Array<{
    id: string;
    title: string;
    icon: string;
    link: string;
  }>;
  onNavigate?: (sectionId: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  socials = [],
  onNavigate,
}) => {
  const navItems = [
    { id: 'hero', label: 'Overview', icon: Sparkles, desc: 'Interactive 3D hero & credentials' },
    { id: 'about', label: 'About', icon: User, desc: 'Bio & background information' },
    { id: 'experience', label: 'Experience & Education', icon: GraduationCap, desc: 'Work history & academic degrees' },
    { id: 'skills', label: 'Skills', icon: Code2, desc: 'Languages, frameworks & databases' },
    { id: 'projects', label: 'Projects', icon: Briefcase, desc: 'Case studies & live demos' },
    { id: 'contact', label: 'Contact', icon: Mail, desc: 'Send direct message or inquiry' },
  ];

  const handleItemClick = (id: string) => {
    onClose();
    if (onNavigate) {
      setTimeout(() => onNavigate(id), 250);
    }
  };

  return (
    <div
      className={`lg:hidden fixed inset-0 z-50 flex justify-end transition-visibility duration-300 ${
        isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
      }`}
    >
      {/* Backdrop with transition */}
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel with smooth transform transition */}
      <div
        className={`relative w-[85%] max-w-sm h-full bg-surface border-l border-border p-6 flex flex-col justify-between z-10 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <span className="text-[11px] font-mono uppercase tracking-wider text-accent font-bold">
              // NAVIGATION_MENU
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="flex flex-col items-center text-center p-4 rounded-lg bg-background border border-border">
            <div className="w-16 h-16 rounded-lg overflow-hidden border border-border bg-surface flex items-center justify-center mb-2.5 shadow-sm">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name || 'Sakil Ahmed'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <MaleCoderAvatar className="w-full h-full object-cover" />
              )}
            </div>
            <h2 className="text-sm font-bold text-text-main font-mono">{profile?.name || 'Sakil Ahmed'}</h2>
            <p className="text-[11px] font-mono text-text-muted mt-0.5">{profile?.title || 'Full Stack Software Engineer'}</p>
            
            <div className="flex flex-wrap justify-center gap-1.5 mt-3">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1.5 font-semibold ${
                profile?.availableForWork !== false
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-surface border-border text-text-muted'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  profile?.availableForWork !== false ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-500'
                }`} />
                {profile?.availableForWork !== false ? 'Available for hire' : 'Unavailable'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-text-muted">
                🇧🇩 {profile?.nationality || 'Bangladesh'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-accent font-semibold">
                {profile?.experienceYears || '5+ yrs exp'}
              </span>
            </div>
          </div>

          {/* Simple Clean Navigation Options */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              Sections
            </div>
            <div className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-background border border-border hover:border-accent/40 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-surface border border-border flex items-center justify-center text-text-muted group-hover:text-accent group-hover:border-accent/40 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-text-main font-mono">{item.label}</div>
                        <div className="text-[10px] text-text-muted">{item.desc}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Links & Resume */}
          <div className="space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
              Quick Links
            </div>
            {socials.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-background border border-border text-xs font-mono text-text-muted hover:text-text-main hover:border-accent/40 transition-colors"
                  >
                    <span className="text-accent flex items-center justify-center">
                      {renderResolvedIcon(social.icon, undefined, 'w-3.5 h-3.5')}
                    </span>
                    <span className="truncate">{social.title}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-background border border-border text-xs font-mono text-text-muted hover:text-text-main transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-background border border-border text-xs font-mono text-text-muted hover:text-text-main transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>LinkedIn</span>
                </a>
              </div>
            )}

            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-surface border border-accent/40 text-xs font-mono text-text-main hover:bg-surface-hover transition-colors font-semibold mt-1"
              >
                <FileText className="w-3.5 h-3.5 text-accent" />
                <span>Download Resume</span>
                <ExternalLink className="w-3 h-3 text-text-muted" />
              </a>
            )}
          </div>
        </div>

        {/* Drawer Footer with Theme Selector */}
        <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
          <ThemeSelector placement="top" />
          <span className="text-[10px] font-mono text-text-muted">v1.3.0</span>
        </div>
      </div>
    </div>
  );
};

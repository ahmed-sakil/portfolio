import React, { useState } from 'react';
import { X, User, Code2, Briefcase, Mail, ExternalLink, FileText, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';
import { MaleCoderAvatar } from '../ui/MaleCoderAvatar';
import { renderResolvedIcon } from '../../lib/iconResolver';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: {
    name: string;
    title: string;
    email?: string | null;
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
    showOnHero?: boolean;
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
  const [avatarOffset, setAvatarOffset] = useState({ x: 0, y: 0 });

  const handleAvatarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    setAvatarOffset({
      x: -normX * 16,
      y: -normY * 8,
    });
  };

  const handleAvatarMouseLeave = () => {
    setAvatarOffset({ x: 0, y: 0 });
  };

  const isAvailable = profile?.availableForWork !== false;

  const displaySocials = socials.length > 0
    ? (socials.some((s) => s.showOnHero) ? socials.filter((s) => s.showOnHero) : socials.slice(0, 5))
    : [];

  const navItems = [
    { id: 'hero', label: 'Home', icon: Sparkles, desc: 'Personal developer overview & credentials' },
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
        className={`relative w-[85%] max-w-sm h-full bg-surface border-l border-border p-6 flex flex-col justify-between z-10 shadow-2xl transition-transform duration-300 ease-out font-mono ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          {/* Drawer Header (Just the close button on the right) */}
          <div className="flex items-center justify-end pb-1 border-b border-border/40">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-border text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Card - Identical structure to large screen sidebar */}
          <div className="flex flex-col items-center text-center p-4 rounded-xl bg-background border border-border">
            <div 
              onMouseMove={handleAvatarMouseMove}
              onMouseLeave={handleAvatarMouseLeave}
              className="p-1 rounded-xl bg-surface border border-border mb-2 shadow-inner group cursor-pointer"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-background flex items-center justify-center relative">
                <div
                  className="w-full h-full flex items-center justify-center will-change-transform"
                  style={{
                    transform: `translate3d(${avatarOffset.x}px, ${avatarOffset.y}px, 0) scale(1.12)`,
                    transition: avatarOffset.x === 0 ? 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'transform 0.08s ease-out',
                  }}
                >
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name || 'Sakil Ahmed'}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                  ) : (
                    <MaleCoderAvatar className="w-full h-full object-cover pointer-events-none select-none" />
                  )}
                </div>
              </div>
            </div>

            <h2 className="text-sm font-bold text-text-main font-mono">
              {profile?.name || 'Md. Sakil Ahmed'}
            </h2>
            <p className="text-[11px] font-mono text-text-muted mt-0.5">
              {profile?.title || 'Software Engineer & Architect'}
            </p>

            {/* Availability status pill */}
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border text-[10px]">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isAvailable
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse'
                    : 'bg-neutral-500'
                }`}
              />
              <span className="text-text-muted">
                {isAvailable ? 'Available for hire' : 'Currently working'}
              </span>
            </div>

            {/* Social Icons Dock - Circular, inverting colors on hover */}
            {(displaySocials.length > 0 || profile?.email) && (
              <div className="flex items-center justify-center gap-2 pt-3.5 w-full flex-wrap">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    title={`Email: ${profile.email}`}
                    className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:bg-text-main hover:text-background hover:border-text-main transition-all duration-200 group shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5 text-current transition-colors" />
                  </a>
                )}
                {displaySocials.map((social) => (
                  <a
                    key={social.id || social.title}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.title}
                    className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:bg-text-main hover:text-background hover:border-text-main transition-all duration-200 group shadow-sm"
                  >
                    {renderResolvedIcon(
                      social.icon,
                      <ExternalLink className="w-3.5 h-3.5 text-current transition-colors" />,
                      "w-3.5 h-3.5 text-current transition-colors"
                    )}
                  </a>
                ))}
              </div>
            )}
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
          {profile?.resumeUrl && (
            <div className="pt-1">
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg bg-surface border border-accent/40 text-xs font-mono text-text-main hover:bg-surface-hover transition-colors font-semibold"
              >
                <FileText className="w-3.5 h-3.5 text-accent" />
                <span>Download Resume</span>
                <ExternalLink className="w-3 h-3 text-text-muted" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

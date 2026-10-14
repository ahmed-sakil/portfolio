import React, { useState } from 'react';
import { ThemeSelector } from '../../features/themes/ThemeSelector';
import { User, Code2, Briefcase, Mail, Sparkles, Layers, Share2 } from 'lucide-react';
import { MaleCoderAvatar } from '../ui/MaleCoderAvatar';
import { cn } from '../../lib/utils';
import { renderResolvedIcon } from '../../lib/iconResolver';

interface SocialLink {
  id?: string;
  title: string;
  icon: string;
  link: string;
  showOnHero?: boolean;
}

interface SidebarProps {
  profile?: {
    name: string;
    title: string;
    avatarUrl?: string | null;
    availableForWork?: boolean | null;
  } | null;
  socials?: SocialLink[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const DesktopSidebar: React.FC<SidebarProps> = ({
  profile,
  socials = [],
  activeSection,
  onNavigate,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const isAvailable = profile?.availableForWork !== false;

  // Filter hero socials, fallback to first 5 socials if none explicitly marked
  const displaySocials = socials.length > 0
    ? (socials.some((s) => s.showOnHero) ? socials.filter((s) => s.showOnHero) : socials.slice(0, 5))
    : [];

  const navItems = [
    { id: 'hero', label: 'Overview', icon: Sparkles },
    { id: 'about', label: 'About', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-80 h-full bg-surface/90 border-r border-border p-5 select-none flex-shrink-0 font-mono">
      {/* Top Profile Card */}
      <div className="flex flex-col items-center text-center">
        {/* Avatar Box */}
        <div className="relative my-2 group">
          <div className="p-1 rounded-xl bg-background border border-border group-hover:border-accent/50 transition-colors shadow-inner">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-surface flex items-center justify-center">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name || 'Sakil Ahmed'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <MaleCoderAvatar className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
              )}
            </div>
          </div>
        </div>

        {/* Developer Name & Role */}
        <h1 className="text-base font-bold tracking-tight text-text-main font-mono">
          {profile?.name || 'Md. Sakil Ahmed'}
        </h1>
        <p className="text-xs font-mono text-text-muted mt-0.5">
          {profile?.title || 'Software Engineer & Architect'}
        </p>

        {/* Availability Status Chip */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background border border-border text-[10px]">
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              isAvailable
                ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"
                : "bg-neutral-500"
            )}
          />
          <span className="text-text-muted">
            {isAvailable ? "Available for hire" : "Currently engaged"}
          </span>
        </div>

        {/* Social Icons Dock (Header / Hero Socials) */}
        {displaySocials.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 pt-3.5 w-full">
            {displaySocials.map((social) => (
              <a
                key={social.id || social.title}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                title={social.title}
                className="w-8 h-8 rounded-md bg-background border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent/50 hover:bg-surface transition-all duration-150 group shadow-sm"
              >
                {renderResolvedIcon(
                  social.icon,
                  <Share2 className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors" />,
                  "w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors"
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Menu with Springy Gliding Hover Backdrop */}
      <nav
        className="relative flex flex-col gap-1.5 my-4"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Springy Gliding Hover Backdrop */}
        {hoveredIndex !== null && (
          <div
            className="absolute left-0 right-0 h-[38px] rounded-lg bg-accent/15 border border-accent/30 transition-all duration-300 pointer-events-none ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
            style={{
              top: `${hoveredIndex * 44}px`,
            }}
          />
        )}

        {navItems.map((item, index) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={() => setHoveredIndex(index)}
              className={cn(
                "relative z-10 w-full h-[38px] flex items-center justify-between px-3 rounded-lg text-xs font-mono transition-colors duration-150 group",
                isActive
                  ? "bg-background text-text-main border border-accent/40 shadow-sm font-bold"
                  : "text-text-muted hover:text-text-main"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "w-6 h-6 rounded flex items-center justify-center transition-colors",
                    isActive
                      ? "bg-surface text-accent border border-border"
                      : "text-text-muted group-hover:text-accent"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className={cn(isActive ? "text-text-main" : "text-text-muted group-hover:text-text-main")}>
                  {item.label}
                </span>
              </div>

              <span
                className={cn(
                  "text-[11px] font-mono transition-all duration-150",
                  isActive
                    ? "text-accent translate-x-0 opacity-100"
                    : "text-accent/60 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                )}
              >
                &gt;
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer & Theme Switcher */}
      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs font-mono">
        <ThemeSelector placement="top" />
      </div>
    </aside>
  );
};

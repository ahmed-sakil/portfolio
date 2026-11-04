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
    email?: string | null;
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
  const [avatarOffset, setAvatarOffset] = useState({ x: 0, y: 0 });

  const handleAvatarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    // Responsive sidewise movement against hover
    setAvatarOffset({
      x: -normX * 18,
      y: -normY * 8,
    });
  };

  const handleAvatarMouseLeave = () => {
    setAvatarOffset({ x: 0, y: 0 });
  };

  const isAvailable = profile?.availableForWork !== false;

  // Filter hero socials, fallback to first 5 socials if none explicitly marked
  const displaySocials = socials.length > 0
    ? (socials.some((s) => s.showOnHero) ? socials.filter((s) => s.showOnHero) : socials.slice(0, 5))
    : [];

  const navItems = [
    { id: 'hero', label: 'Home', icon: Sparkles },
    { id: 'about', label: 'About', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: Layers },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const activeIndex = navItems.findIndex((item) => item.id === activeSection);

  return (
    <aside className="hidden lg:flex flex-col justify-between w-80 h-full bg-surface/90 border-r border-border p-5 select-none flex-shrink-0 font-mono">
      {/* Top Profile Card */}
      <div className="flex flex-col items-center text-center">
        {/* Avatar Box with sidewise responsive hover */}
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
            {isAvailable ? "Available for hire" : "Currently working"}
          </span>
        </div>

        {/* Social Icons Dock - Circular, inverting colors on hover */}
        {(displaySocials.length > 0 || profile?.email) && (
          <div className="flex items-center justify-center gap-2 pt-3.5 w-full flex-wrap">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                title={`Email: ${profile.email}`}
                className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-text-muted hover:bg-text-main hover:text-background hover:border-text-main transition-all duration-200 group shadow-sm"
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
                className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-text-muted hover:bg-text-main hover:text-background hover:border-text-main transition-all duration-200 group shadow-sm"
              >
                {renderResolvedIcon(
                  social.icon,
                  <Share2 className="w-3.5 h-3.5 text-current transition-colors" />,
                  "w-3.5 h-3.5 text-current transition-colors"
                )}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Menu with Springy Gliding Hover Backdrop & Gliding Active Left Indicator */}
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

        {/* Smooth Gliding Active Left Indicator Bar */}
        {activeIndex !== -1 && (
          <div
            className="absolute left-0 w-1 rounded-r-full bg-accent shadow-[0_0_10px_var(--color-accent)] transition-all duration-300 pointer-events-none ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20"
            style={{
              top: `${activeIndex * 44 + 6}px`,
              height: '26px',
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
                  ? "bg-background/80 text-text-main font-bold shadow-sm"
                  : "text-text-muted hover:text-text-main"
              )}
            >
              <div className="flex items-center gap-2.5 pl-1.5">
                <div
                  className={cn(
                    "w-6 h-6 flex items-center justify-center transition-colors",
                    isActive
                      ? "text-accent"
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

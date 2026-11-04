import React from 'react';
import { User, Code2, Briefcase, Mail, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MobileBottomNavProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeSection,
  onNavigate,
  onOpenMenu,
}) => {
  const items = [
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const activeIndex = items.findIndex((i) => i.id === activeSection);

  return (
    <nav className="lg:hidden fixed bottom-3 left-4 right-4 z-40 bg-surface/90 backdrop-blur-lg border border-border rounded-2xl p-1.5 shadow-2xl flex items-center justify-between font-mono select-none">
      <div className="relative flex-1 grid grid-cols-4 items-center">
        {/* Smooth Gliding Active Pill Indicator */}
        {activeIndex !== -1 && (
          <div
            className="absolute top-0 bottom-0 rounded-xl bg-background border border-border shadow-sm pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-0"
            style={{
              width: '25%',
              left: `${activeIndex * 25}%`,
            }}
          />
        )}

        {items.map((item) => {
          const isActive = activeSection === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "relative z-10 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] transition-colors duration-200 outline-none",
                isActive ? "text-text-main font-semibold" : "text-text-muted hover:text-text-main"
              )}
            >
              <Icon className={cn("w-4 h-4 mb-0.5 transition-colors", isActive ? "text-accent" : "text-text-muted")} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="w-[1px] h-6 bg-border mx-1 flex-shrink-0" />

      {/* Burger Menu Button to open Drawer */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[10px] text-text-muted hover:text-text-main transition-colors flex-shrink-0"
        title="More options"
      >
        <Menu className="w-4 h-4 mb-0.5 text-text-muted" />
        <span>Menu</span>
      </button>
    </nav>
  );
};

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

  return (
    <nav className="lg:hidden fixed bottom-3 left-4 right-4 z-40 bg-surface/90 backdrop-blur-lg border border-border rounded-2xl p-2 shadow-2xl flex items-center justify-around">
      {items.map((item) => {
        const isActive = activeSection === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 text-[10px]",
              isActive
                ? "text-text-main font-semibold bg-background border border-border"
                : "text-text-muted hover:text-text-main"
            )}
          >
            <Icon className={cn("w-4 h-4 mb-0.5", isActive ? "text-accent" : "text-text-muted")} />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Burger Menu Button to open Drawer */}
      <button
        onClick={onOpenMenu}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] text-text-muted hover:text-text-main transition-colors"
        title="More options"
      >
        <Menu className="w-4 h-4 mb-0.5 text-text-muted" />
        <span>Menu</span>
      </button>
    </nav>
  );
};

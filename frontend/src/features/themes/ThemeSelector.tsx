import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../app/providers/ThemeProvider';
import { Palette, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ThemeSelectorProps {
  placement?: 'auto' | 'top' | 'bottom';
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ placement = 'auto' }) => {
  const { themes, currentTheme, setThemeBySlug } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute position classes based on placement prop or responsive defaults
  const popoverPositionClass =
    placement === 'bottom'
      ? 'right-0 top-full mt-2'
      : placement === 'top'
      ? 'left-0 bottom-full mb-2'
      : 'right-0 lg:left-0 top-full lg:top-auto lg:bottom-full mt-2 lg:mt-0 lg:mb-2';

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border text-xs font-medium",
          "bg-surface hover:bg-surface-hover text-text-muted hover:text-text-main transition-all duration-200 active:scale-95"
        )}
        title="Change theme"
      >
        <Palette className="w-3.5 h-3.5 text-accent transition-transform duration-200 hover:rotate-45" />
        <span className="hidden sm:inline">{currentTheme?.name || 'Theme'}</span>
        <div
          className="w-2.5 h-2.5 rounded-full border border-border shadow-sm"
          style={{ backgroundColor: currentTheme?.accent || '#fff' }}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute w-56 rounded-2xl bg-surface/95 backdrop-blur-md border border-border p-2 shadow-2xl z-[100]",
            "transition-all duration-200 ease-out origin-top lg:origin-bottom transform animate-in fade-in-0 zoom-in-95",
            popoverPositionClass
          )}
        >
          <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted px-2.5 py-1 flex items-center justify-between border-b border-border/50 mb-1">
            <span>Color Schemes</span>
            <span className="text-[9px] text-accent font-semibold">{themes.length} available</span>
          </div>

          <div className="space-y-1 max-h-60 overflow-y-auto pr-0.5">
            {themes.map((theme) => {
              const isSelected = currentTheme?.slug === theme.slug;
              return (
                <button
                  key={theme.slug}
                  onClick={() => {
                    setThemeBySlug(theme.slug);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all duration-150",
                    isSelected
                      ? "bg-background border border-border text-text-main font-semibold shadow-sm"
                      : "text-text-muted hover:text-text-main hover:bg-surface-hover"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-border inline-block flex-shrink-0 shadow-inner"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <span className="font-mono text-xs">{theme.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-accent" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

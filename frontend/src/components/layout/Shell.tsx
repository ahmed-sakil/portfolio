import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { DesktopSidebar } from './DesktopSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileDrawer } from './MobileDrawer';
import { MaleCoderAvatar } from '../ui/MaleCoderAvatar';
import { ThemeSelector } from '../../features/themes/ThemeSelector';

import { cn } from '../../lib/utils';

interface ShellProps {
  children: React.ReactNode;
  profile?: any;
  socials?: any[];
  heroSocials?: any[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  catalogView?: React.ReactNode;
  isCatalogOpen?: boolean;
  projectDetailView?: React.ReactNode;
  isProjectDetailOpen?: boolean;
}

export const Shell: React.FC<ShellProps> = ({
  children,
  profile,
  socials = [],
  heroSocials = [],
  activeSection,
  onNavigate,
  catalogView,
  isCatalogOpen = false,
  projectDetailView,
  isProjectDetailOpen = false,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = mainRef.current;
    const content = innerRef.current;
    if (!wrapper || !content) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      autoResize: true,
    });

    (window as any).__portfolioLenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__portfolioLenis;
    };
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-background text-text-main flex flex-col items-center justify-center relative">
      {/* Mobile Top Header (Displays avatar, name, and role on mobile, theme opens downward) */}
      <header className="lg:hidden w-full bg-surface/90 backdrop-blur-md border-b border-border sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-background group-hover:border-accent/50 transition-colors">
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
            <div
              className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface transition-colors",
                profile?.availableForWork !== false ? "bg-emerald-500" : "bg-neutral-500"
              )}
              title={profile?.availableForWork !== false ? "Available for hire" : "Currently unavailable"}
            />
          </div>
          <div>
            <div className="text-xs font-bold text-text-main leading-tight group-hover:text-accent transition-colors font-mono">
              {profile?.name || 'Sakil Ahmed'}
            </div>
            <div className="text-[10px] font-mono text-text-muted">
              {profile?.title || 'Full Stack Software Engineer'}
            </div>
          </div>
        </div>

        {/* Theme selector on mobile header opens downward */}
        <div className="flex items-center gap-2">
          <ThemeSelector placement="bottom" />
        </div>
      </header>

      {/* Unified 95% Width Master Viewport Frame */}
      <div className="w-[95%] max-w-[1700px] h-[calc(100dvh-7.5rem)] my-2 lg:h-[calc(100vh-2rem)] lg:my-4 rounded-xl border border-border bg-surface/30 backdrop-blur-md overflow-hidden flex relative shadow-2xl">
        {/* Docked Desktop Sidebar (internal column separated by border-r) */}
        <DesktopSidebar
          profile={profile}
          socials={heroSocials && heroSocials.length > 0 ? heroSocials : socials}
          activeSection={activeSection}
          onNavigate={onNavigate}
        />

        {/* Content Pane: Holds the primary overview scroll area and smooth slide-over panel */}
        <div className="flex-1 min-w-0 h-full relative overflow-hidden">
          <main
            ref={mainRef}
            id="main-content-scroll"
            className="w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8 relative"
          >
            <div ref={innerRef} id="main-content-inner" className="w-full pb-20 lg:pb-0">
              {children}
            </div>
          </main>

          {/* Layer 1: All Projects Catalog Slide-Over Panel (z-20) */}
          <div
            className={cn(
              "absolute inset-0 bg-background z-20 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl",
              isCatalogOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
            )}
          >
            {catalogView}
          </div>

          {/* Layer 2: Specific Project Detail Slide-Over Panel (z-30) */}
          <div
            className={cn(
              "absolute inset-0 bg-background z-30 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl",
              isProjectDetailOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
            )}
          >
            {projectDetailView}
          </div>
        </div>
      </div>

      {/* Mobile App Bottom Navigation */}
      <MobileBottomNav
        activeSection={activeSection}
        onNavigate={onNavigate}
        onOpenMenu={() => setIsMobileDrawerOpen(true)}
      />

      {/* Mobile Drawer with onNavigate handler */}
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        profile={profile}
        socials={heroSocials && heroSocials.length > 0 ? heroSocials : socials}
        onNavigate={onNavigate}
      />
    </div>
  );
};

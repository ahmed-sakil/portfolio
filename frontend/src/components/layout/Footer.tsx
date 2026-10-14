import React from 'react';
import { Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

interface FooterProps {
  profile?: {
    name?: string;
    bio?: string;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    nationality?: string | null;
  } | null;
}

export const Footer: React.FC<FooterProps> = ({ profile }) => {
  const handleScrollToTop = () => {
    const lenis = (window as any).__portfolioLenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      const scrollContainer = document.getElementById('main-content-scroll');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const email = profile?.email || 'sakil@example.com';
  const phone = profile?.phone || '+880 1700-000000';
  const location = profile?.location || (profile?.nationality ? `${profile.nationality}, Bangladesh` : 'Dhaka, Bangladesh');
  const bio = profile?.bio || 'Building scalable web applications, robust backend architectures, and high-performance interactive interfaces.';

  return (
    <footer className="mt-16 pt-8 pb-24 lg:pb-8 border-t border-border space-y-8 font-mono">
      {/* Brand & Top Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-surface border border-border flex items-center justify-center text-accent font-bold text-xs">
              &gt;_
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <h2 className="text-base font-bold tracking-tight text-text-main font-mono">
                  // sakil.me
                </h2>
              </div>
            </div>
          </div>
          <p className="text-xs text-text-muted leading-relaxed font-sans">
            {bio}
          </p>
        </div>

        {/* Back to Top Button */}
        <button
          onClick={handleScrollToTop}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-accent/50 hover:bg-surface-hover text-text-main text-xs font-mono transition-all group shadow-sm self-start sm:self-auto flex-shrink-0"
          title="Return to top of page"
        >
          <span>BACK_TO_TOP</span>
          <ArrowUp className="w-3.5 h-3.5 text-accent group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* Contact Metadata Cards (Email, Phone, Location) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Email Card */}
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-3.5 p-3.5 rounded-lg bg-surface border border-border hover:border-accent/40 transition-colors group"
        >
          <div className="w-9 h-9 rounded-md bg-background border border-border flex items-center justify-center text-accent group-hover:border-accent/50 transition-colors flex-shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-text-muted uppercase block">// DIRECT_EMAIL</span>
            <span className="text-xs font-semibold text-text-main group-hover:text-accent transition-colors truncate block">
              {email}
            </span>
          </div>
        </a>

        {/* Phone Card */}
        <a
          href={`tel:${phone.replace(/\s+/g, '')}`}
          className="flex items-center gap-3.5 p-3.5 rounded-lg bg-surface border border-border hover:border-accent/40 transition-colors group"
        >
          <div className="w-9 h-9 rounded-md bg-background border border-border flex items-center justify-center text-accent group-hover:border-accent/50 transition-colors flex-shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-text-muted uppercase block">// TELEPHONE</span>
            <span className="text-xs font-semibold text-text-main group-hover:text-accent transition-colors truncate block">
              {phone}
            </span>
          </div>
        </a>

        {/* Location Card */}
        <div className="flex items-center gap-3.5 p-3.5 rounded-lg bg-surface border border-border sm:col-span-2 lg:col-span-1">
          <div className="w-9 h-9 rounded-md bg-background border border-border flex items-center justify-center text-accent flex-shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-text-muted uppercase block">// LOCATION</span>
            <span className="text-xs font-semibold text-text-main truncate block">
              {location}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Legal */}
      <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-text-muted">
        <div>
          © {new Date().getFullYear()} <span className="text-text-main font-semibold">sakil.me</span> — All rights reserved.
        </div>
      </div>
    </footer>
  );
};

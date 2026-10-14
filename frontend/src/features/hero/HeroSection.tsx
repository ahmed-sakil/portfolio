import React, { useState, useEffect } from 'react';
import { GlassRubiksCube } from './GlassRubiksCube';
import { ArrowDown, FileText } from 'lucide-react';

interface HeroSectionProps {
  profile?: {
    name?: string;
    title?: string;
    resumeUrl?: string | null;
  } | null;
}

const EXPERTISE_ITEMS = [
  'Software Development',
  'Architecture Design',
  'AI / ML Engineering',
  'Scalable Distributed Systems',
];

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  // Typewriter state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const currentPhrase = EXPERTISE_ITEMS[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 75);
      } else {
        // Word completed, pause before deleting
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 1800);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length - 1));
        }, 40);
      } else {
        // Deletion complete, advance to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % EXPERTISE_ITEMS.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  const scrollTo = (id: string) => {
    const lenis = (window as any).__portfolioLenis;
    const el = document.getElementById(id);
    if (lenis && el) {
      lenis.scrollTo(el, { duration: 1.2, offset: -20 });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const developerName = profile?.name || 'Md. Sakil Ahmed';

  return (
    <section
      id="hero"
      className="relative rounded-2xl border border-border bg-surface/30 backdrop-blur-md overflow-hidden p-6 sm:p-10 lg:p-12 font-mono shadow-xl"
    >
      {/* Static Cyber Grid Background (Zero JS / Zero GPU listeners) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(circle at 60% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 60% 50%, black 20%, transparent 80%)',
        }}
      />

      {/* Subtle Static Ambient Glow behind the cube */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background:
            'radial-gradient(circle at 75% 50%, rgba(16, 185, 129, 0.07), transparent 60%)',
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
        {/* Left Column: Clean Identity, Typewriter & CTAs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-text-main tracking-tight leading-none">
              {developerName}
            </h1>

            <p className="text-sm sm:text-base text-accent font-semibold tracking-wider pt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>CSE Graduate</span>
            </p>
          </div>

          {/* Dynamic Engineering Typewriter (Natural width, stable row height, no underline) */}
          <div className="flex items-center text-sm sm:text-base text-text-muted min-h-[32px] pt-1 select-none">
            <span className="text-text-muted/80 mr-2 shrink-0">Expertise in</span>
            <span className="text-text-main font-semibold tracking-wide">
              {displayText}
            </span>
            <span className="inline-block w-2 h-4 ml-1.5 bg-accent animate-pulse align-middle shrink-0" />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => scrollTo('projects')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-background font-bold text-xs hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Explore Projects</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            <a
              href={profile?.resumeUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-surface-hover hover:border-accent/40 text-text-main text-xs font-semibold transition-colors shadow-sm"
              title="Checkout my CV"
            >
              <FileText className="w-3.5 h-3.5 text-accent" />
              <span>Checkout my CV</span>
            </a>
          </div>
        </div>

        {/* Right Column: Autonomous Glassy Rubik's Cube (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <GlassRubiksCube />
        </div>
      </div>
    </section>
  );
};

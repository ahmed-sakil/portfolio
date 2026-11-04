import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { MaleCoderAvatar } from '../../components/ui/MaleCoderAvatar';

interface HeroSectionProps {
  profile?: {
    name?: string;
    title?: string;
    avatarUrl?: string | null;
    heroImageUrl?: string | null;
    resumeUrl?: string | null;
    heroTagline?: string | null;
    expertiseItems?: string[] | null;
  } | null;
  onNavigate?: (id: string) => void;
}

const DEFAULT_EXPERTISE = [
  'Software Development',
  'Architecture Design',
  'AI / ML Engineering',
  'Scalable Distributed Systems',
];

export const HeroSection: React.FC<HeroSectionProps> = ({ profile, onNavigate }) => {
  const expertiseList =
    profile?.expertiseItems && profile.expertiseItems.length > 0
      ? profile.expertiseItems
      : DEFAULT_EXPERTISE;

  // Typewriter state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Counter-directional hover displacement state (3D tilt & counter-shift)
  const imageCardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageCardRef.current) return;
    const rect = imageCardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalised distance from center (-1 to 1)
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    // Counter-directional offset: move opposite to cursor position
    const moveX = -normX * 18; // shifts opposite on X axis
    const moveY = -normY * 18; // shifts opposite on Y axis
    const rotX = normY * 12;   // tilts on 3D perspective
    const rotY = -normX * 12;

    setTilt({ x: moveX, y: moveY, rotateX: rotX, rotateY: rotY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  };

  // Typewriter effect
  useEffect(() => {
    const currentPhrase = expertiseList[phraseIndex % expertiseList.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (displayText.length < currentPhrase.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 70);
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
        }, 35);
      } else {
        // Deletion complete, advance to next phrase
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % expertiseList.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex, expertiseList]);

  const scrollTo = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
      return;
    }
    const lenis = (window as any).__portfolioLenis;
    const el = document.getElementById(id);
    if (lenis && el) {
      lenis.scrollTo(el, { duration: 1.2, offset: -20 });
    } else if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const developerName = profile?.name || 'SAKIL AHMED';
  const cleanName = developerName.replace(/^(Md\.|Mr\.|Dr\.)\s*/i, '').trim() || 'SAKIL AHMED';
  const rawParts = cleanName.split(/\s+/);
  const nameParts = rawParts.length > 1
    ? [rawParts[0], rawParts.slice(1).join(' ')]
    : [cleanName, ''];

  const heroTagline =
    profile?.heroTagline ||
    'I develop web applications for my clients that help organize, scale, and accelerate their digital workflows.';

  // Prefer dedicated heroImageUrl, fallback to avatarUrl
  const heroImageSrc = profile?.heroImageUrl || profile?.avatarUrl;

  return (
    <section
      id="hero"
      className="relative min-h-[580px] sm:min-h-[680px] lg:min-h-[740px] flex flex-col justify-between rounded-xl sm:rounded-2xl glass-panel overflow-hidden p-4 sm:p-10 lg:p-12 font-mono group/hero"
    >
      {/* Static Subtle Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 80%)',
        }}
      />

      {/* Ambient Accent Glow Behind Center */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(circle at 50% 55%, rgba(16, 185, 129, 0.08), transparent 60%)',
        }}
      />

      {/* 1. TOP MIDDLE: Name followed and ended by architectural line (only name placed there) */}
      <div className="relative z-20 w-full flex justify-center items-center">
        <div className="flex items-center gap-3 sm:gap-4 max-w-full px-4">
          {/* Leading line */}
          <div className="w-12 sm:w-20 md:w-28 h-[1px] bg-gradient-to-r from-transparent via-border to-accent/70" />

          {/* Clean Name */}
          <span className="text-xs sm:text-sm md:text-base font-bold tracking-widest text-text-main uppercase whitespace-nowrap">
            {developerName}
          </span>

          {/* Trailing line */}
          <div className="w-12 sm:w-20 md:w-28 h-[1px] bg-gradient-to-l from-transparent via-border to-accent/70" />
        </div>
      </div>

      {/* 2. CENTER STAGE: Responsive Backdrop Text with Large Image in Front */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center py-6 sm:py-8 overflow-hidden select-none">
        {/* Responsive Backdrop Typography: calibrated text size and gap so S and D stay completely inside the container */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden px-2 sm:px-6">
          <h1 className="stroke-display-text text-[clamp(1.6rem,4.8vw,5.2rem)] font-black uppercase tracking-normal sm:tracking-wide leading-none whitespace-nowrap flex items-center justify-between w-full max-w-5xl px-3 sm:px-6 select-none will-change-transform group-hover/hero:scale-[1.01] transition-transform duration-700 ease-out">
            <span className="text-left">{nameParts[0]}</span>
            {nameParts[1] && <span className="text-right">{nameParts[1]}</span>}
          </h1>
        </div>

        {/* Center Large Self Image with Counter-Directional Hover Parallax */}
        <div
          ref={imageCardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative z-10 flex flex-col items-center cursor-pointer p-4"
          style={{ perspective: '1000px' }}
        >
          <div
            className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 overflow-visible transition-all duration-200 ease-out flex items-center justify-center pointer-events-auto"
            style={{
              transform: `translate3d(${tilt.x}px, ${tilt.y}px, 0) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              willChange: 'transform',
            }}
          >
            {heroImageSrc ? (
              <img
                src={heroImageSrc}
                alt={developerName}
                className="w-full h-full object-contain object-bottom drop-shadow-2xl transition-transform duration-500 select-none"
                style={{
                  transform: `scale(1.05) translate3d(${-tilt.x * 0.4}px, ${-tilt.y * 0.4}px, 0)`,
                }}
              />
            ) : (
              <MaleCoderAvatar className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      </div>

      {/* 3. LOWER REGION: Left (Expertise + Pitch Line + See My Work & CV Buttons on same line) */}
      <div className="relative z-20 w-full pt-2 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        {/* Left Column: Two-line Expertise + Tagline + Both Action Buttons */}
        <div className="space-y-4 max-w-xl">
          {/* Two-line Expertise Display */}
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
              <span>// EXPERTISE IN</span>
            </div>
            <div className="text-base sm:text-lg lg:text-xl font-bold text-text-main flex items-center min-h-[30px]">
              <span className="tracking-tight">{displayText}</span>
              <span className="inline-block w-2 h-5 ml-1.5 bg-accent animate-pulse align-middle" />
            </div>
          </div>

          {/* Client Pitch Line */}
          <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
            {heroTagline}
          </p>

          {/* Action Buttons: See My Work and CV on the same line (left) */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => scrollTo('projects')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-accent text-background font-bold text-xs sm:text-sm hover:opacity-90 transition-all shadow-md group"
            >
              <span>See my work</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {profile?.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border bg-background hover:bg-surface-hover hover:border-accent/50 text-text-main text-xs sm:text-sm font-semibold transition-all shadow-sm group"
                title="Download or view Curriculum Vitae"
              >
                <FileText className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                <span>Curriculum Vitae</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

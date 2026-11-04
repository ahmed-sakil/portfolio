import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface DeveloperBootScreenProps {
  onBootComplete: () => void;
  developerName?: string;
}

const BOOT_LOGS = [
  'Initializing runtime environment...',
  'Connecting to backend services...',
  'Handshake established with server [200 OK]',
  'Fetching developer profile & project repository...',
  'Parsing themes and typography system...',
  'Mapping application datasets...',
  'Compiling interface components...',
  'Welcome to the portfolio.',
];

export const DeveloperBootScreen: React.FC<DeveloperBootScreenProps> = ({
  onBootComplete,
  developerName: _developerName = 'SAKIL AHMED',
}) => {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onBootComplete();
    }, 200);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const totalDuration = 3200; // Snappy ~3.2s
    const intervalTime = 40;
    const increment = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          // Trigger fadeout
          setIsFadingOut(true);
          setTimeout(() => {
            onBootComplete();
          }, 350);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => {
      clearInterval(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBootComplete]);

  // Advance logs based on progress percentage
  useEffect(() => {
    const step = Math.floor((progress / 100) * BOOT_LOGS.length);
    if (step < BOOT_LOGS.length) {
      setCurrentLogIndex(step);
    }
  }, [progress]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background text-text-main transition-all duration-700 ease-out select-none ${
        isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle Matrix/Hex Noise Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative w-[92%] max-w-lg p-6 sm:p-8 rounded-xl bg-surface border border-border shadow-2xl space-y-6">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-accent" />
            <span className="font-mono text-xs font-bold text-text-main">
              Loading portfolio...
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-muted">
            <span className="text-accent font-bold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Central Progress Bar */}
        <div className="relative space-y-2">
          {/* Progress bar line */}
          <div className="relative w-full h-2 rounded-full overflow-hidden bg-background border border-border">
            <div
              className="h-full bg-accent transition-all duration-75 rounded-full shadow-[0_0_8px_var(--color-accent)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Console Boot Log Stream */}
        <div className="p-4 rounded-lg bg-background border border-border font-mono text-xs space-y-2 min-h-[105px]">
          <div className="space-y-1.5 text-[11px]">
            {BOOT_LOGS.slice(0, currentLogIndex + 1).slice(-4).map((log, i) => (
              <div key={i} className="flex items-center gap-2 truncate text-text-muted">
                <span className="text-accent font-bold">&gt;</span>
                <span className="truncate text-text-main">{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Skip Trigger */}
        <div className="flex items-center justify-end pt-1 font-mono text-[10px] text-text-muted">
          <button
            onClick={handleSkip}
            className="hover:text-accent underline underline-offset-2 transition-colors cursor-pointer"
          >
            [Press ESC or Click to Skip]
          </button>
        </div>
      </div>
    </div>
  );
};

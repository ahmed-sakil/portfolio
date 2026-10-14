import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

interface DeveloperBootScreenProps {
  onBootComplete: () => void;
  developerName?: string;
}

const BOOT_LOGS = [
  'BIOS_POST: CPU ok, 8 cores detected @ 3.4GHz',
  'INIT_KERNEL: Loading developer workstation environment...',
  'MMU: Virtual memory tables initialized [0x00000000 - 0x7FFFFFFF]',
  'DEVICE: Mounting PostgreSQL distributed telemetry socket...',
  'THEME_SUBSYSTEM: Parsing active 5-token palette configuration...',
  'FONT_ENGINE: Loading JetBrains Mono ligature glyph caches...',
  'ASSETS: Cloudinary media bucket handshake verified [200 OK]',
  'SEC_AUDIT: TLS handshake 1.3 / AES-256 session established...',
  'DAEMON: Visitor telemetry heartbeat daemon spawned...',
  'SYS_READY: Portfolio runtime compiled successfully. Mounting UI...',
];

export const DeveloperBootScreen: React.FC<DeveloperBootScreenProps> = ({
  onBootComplete,
  developerName = 'SAKIL AHMED',
}) => {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const totalDuration = 4200; // ~4.2 seconds
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
          }, 600);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onBootComplete]);

  // Advance logs based on progress percentage
  useEffect(() => {
    const step = Math.floor((progress / 100) * BOOT_LOGS.length);
    if (step < BOOT_LOGS.length) {
      setCurrentLogIndex(step);
    }
  }, [progress]);

  // Construct visual ASCII progress bar
  const totalBars = 30;
  const filledBars = Math.floor((progress / 100) * totalBars);
  const emptyBars = Math.max(0, totalBars - filledBars);
  const progressBarAscii = `[${'='.repeat(filledBars)}${filledBars < totalBars ? '>' : ''}${' '.repeat(Math.max(0, emptyBars - 1))}]`;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background text-text-main transition-all duration-700 ease-out select-none ${
        isFadingOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Subtle Matrix/Hex Noise Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative w-[92%] max-w-xl p-6 sm:p-8 rounded-lg bg-surface border border-border shadow-2xl space-y-6">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-accent" />
            <span className="font-mono text-xs font-bold text-text-main">
              // BOOT_SEQUENCE: {developerName.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>INITIALIZING</span>
          </div>
        </div>

        {/* Central Barcode Scanner Laser Effect */}
        <div className="relative py-2 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
            <span>MEM: 0x{Math.floor(progress * 1337).toString(16).toUpperCase().padStart(6, '0')}</span>
            <span className="text-accent font-bold">{Math.round(progress)}%</span>
          </div>

          {/* Barcode Strip */}
          <div className="relative w-full h-8 barcode-divider rounded overflow-hidden border border-border/60">
            {/* Animated Laser Scanner Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-accent shadow-[0_0_12px_var(--color-accent)] transition-all duration-75"
              style={{ left: `${progress}%` }}
            />
          </div>

          {/* ASCII Progress Bar */}
          <div className="font-mono text-xs text-text-muted text-center tracking-widest pt-1">
            <span className="text-accent">{progressBarAscii}</span>
          </div>
        </div>

        {/* Console Boot Log Stream */}
        <div className="p-3.5 rounded bg-background border border-border/80 font-mono text-xs space-y-1.5 min-h-[96px] overflow-hidden">
          <div className="text-[10px] text-text-muted/60 uppercase tracking-wider pb-1 border-b border-border/30 flex justify-between">
            <span>Kernel Event Logger</span>
            <span>tty1</span>
          </div>
          <div className="space-y-1 text-[11px]">
            {BOOT_LOGS.slice(0, currentLogIndex + 1).slice(-3).map((log, i) => (
              <div key={i} className="flex items-center gap-2 truncate text-text-muted">
                <span className="text-accent">&gt;</span>
                <span className="truncate">{log}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Status Tag */}
        <div className="flex items-center justify-between text-[10px] font-mono text-text-muted pt-1">
          <span>PORTFOLIO_OS v1.4.0</span>
          <span>ESTABLISHING RUNTIME...</span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  tag: string;           // e.g. "// about", "// timeline", "// skills", "// projects", "// contact"
  title: string;         // e.g. "ENGINEERING PROFILE"
  subtitle?: string;      // e.g. "Full stack systems, architecture, and background"
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  tag,
  title,
  subtitle,
  className,
}) => {
  return (
    <div className={cn("space-y-2 pb-5", className)}>
      {/* Title Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold text-accent tracking-wider">
            {tag.startsWith('//') ? tag : `// ${tag}`}
          </span>
          <span className="text-border-subtle font-mono text-xs">/</span>
          <h2 className="text-sm sm:text-base font-bold tracking-tight text-text-main font-mono uppercase">
            {title}
          </h2>
        </div>

        {/* Barcode-style decorative segment */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-24 sm:w-36 h-3 barcode-divider rounded" />
          <span className="text-[9px] font-mono text-text-muted/60">0x{(title.length * 16).toString(16).toUpperCase()}</span>
        </div>
      </div>

      {subtitle && (
        <p className="text-xs font-mono text-text-muted leading-relaxed max-w-3xl">
          {subtitle}
        </p>
      )}

      {/* Subtle Barcode Line Separator */}
      <div className="w-full h-1.5 barcode-divider rounded mt-2" />
    </div>
  );
};

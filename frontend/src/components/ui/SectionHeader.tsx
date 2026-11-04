import React from 'react';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  tag?: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  tag: _tag,
  title,
  subtitle,
  className,
}) => {
  return (
    <div className={cn("space-y-2 pb-5", className)}>
      {/* Title Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-base sm:text-lg lg:text-xl font-bold text-accent tracking-wider">
            //
          </span>
          <h2 className="text-base sm:text-lg lg:text-xl font-bold tracking-tight text-text-main font-mono uppercase">
            {title.replace(/^\/\/\s*/, '')}
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

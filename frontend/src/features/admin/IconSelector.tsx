import React, { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { renderResolvedIcon } from '../../lib/iconResolver';
import { Sparkles, Upload, Link2, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  presets?: string[];
  fallbackIcon?: React.ReactElement;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  onChange,
  label = 'Icon Selection',
  presets = ['FolderGit2', 'Globe', 'Smartphone', 'Database', 'Server', 'Cpu', 'Layers', 'Terminal', 'Sparkles', 'Code2', 'Shield', 'Cloud'],
  fallbackIcon,
}) => {
  // Determine initial mode based on value
  const initialMode = !value
    ? 'lucide'
    : value.includes('cloudinary.com') || (!value.includes('http') && !value.includes('/'))
    ? 'lucide'
    : value.includes('opensourceicon.com') || value.startsWith('http')
    ? 'link'
    : 'upload';

  const [mode, setMode] = useState<'lucide' | 'upload' | 'link'>(initialMode);
  const [linkInput, setLinkInput] = useState(value.startsWith('http') ? value : '');

  const handleLinkSubmit = (url: string) => {
    setLinkInput(url);
    onChange(url.trim());
  };

  return (
    <div className="space-y-2 p-3 rounded-xl bg-surface/50 border border-border font-mono">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase text-text-muted font-bold tracking-wider">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setLinkInput('');
            }}
            className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* 3-Mode Segmented Control */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-background rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setMode('lucide')}
          className={cn(
            'flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-colors',
            mode === 'lucide'
              ? 'bg-accent text-background font-bold shadow-xs'
              : 'text-text-muted hover:text-text-main'
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lucide</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('upload')}
          className={cn(
            'flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-colors',
            mode === 'upload'
              ? 'bg-accent text-background font-bold shadow-xs'
              : 'text-text-muted hover:text-text-main'
          )}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('link')}
          className={cn(
            'flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-colors',
            mode === 'link'
              ? 'bg-accent text-background font-bold shadow-xs'
              : 'text-text-muted hover:text-text-main'
          )}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>URL / Link</span>
        </button>
      </div>

      {/* Preview Box & Active Mode Input */}
      <div className="flex items-center gap-2.5 pt-1">
        <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0 p-0 overflow-hidden text-accent shadow-xs">
          {renderResolvedIcon(
            value,
            fallbackIcon || <Sparkles className="w-5 h-5 text-accent" />,
            'w-full h-full object-cover sm:object-contain text-accent'
          )}
        </div>

        <div className="flex-1 min-w-0">
          {mode === 'lucide' && (
            <input
              type="text"
              value={value.startsWith('http') ? '' : value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. FolderGit2, Globe, Database"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
            />
          )}

          {mode === 'upload' && (
            <ImageUploader
              label=""
              onUploadSuccess={(url) => {
                onChange(url);
              }}
            />
          )}

          {mode === 'link' && (
            <input
              type="url"
              value={value.startsWith('http') || value.startsWith('/') ? value : linkInput}
              onChange={(e) => handleLinkSubmit(e.target.value)}
              placeholder="e.g. https://opensourceicon.com/cdn/prime/twitter.svg"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
            />
          )}
        </div>
      </div>

      {/* Quick Pick Chips for Lucide */}
      {mode === 'lucide' && presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-1">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={cn(
                'px-2 py-0.5 rounded text-[10px] border transition-colors',
                value === preset
                  ? 'bg-accent text-background font-bold border-accent'
                  : 'bg-background border-border text-text-muted hover:text-text-main'
              )}
            >
              {preset}
            </button>
          ))}
        </div>
      )}

      {/* Helper Note for Link Mode */}
      {mode === 'link' && (
        <div className="p-2 rounded bg-background/60 border border-border/60 text-[10px] text-text-muted space-y-0.5">
          <p className="text-accent font-semibold flex items-center gap-1">
            <span>// OpenSourceIcon CDN Supported</span>
          </p>
          <p>
            Paste any SVG URL (e.g. <code className="text-accent">https://opensourceicon.com/cdn/prime/twitter.svg</code>).
            The color automatically adapts to your active theme!
          </p>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ImageUploader } from './ImageUploader';
import { renderResolvedIcon } from '../../lib/iconResolver';
import { Sparkles, Upload, Link2, X, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { apiClient } from '../../lib/api';

export interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  presets?: string[];
  fallbackIcon?: React.ReactElement;
}

export const detectIconMode = (val?: string | null): 'lucide' | 'upload' | 'link' => {
  if (!val || !val.trim()) return 'lucide';
  const clean = val.trim();
  if (clean.includes('cloudinary.com') || clean.startsWith('/uploads/') || clean.startsWith('/api/uploads')) {
    return 'upload';
  }
  if (clean.includes('opensourceicon.com') || clean.startsWith('http://') || clean.startsWith('https://')) {
    return 'link';
  }
  return 'lucide';
};

export const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  onChange,
  label = 'Icon Selection',
  presets = ['FolderGit2', 'Globe', 'Smartphone', 'Database', 'Server', 'Cpu', 'Layers', 'Terminal', 'Sparkles', 'Code2', 'Shield', 'Cloud'],
  fallbackIcon,
}) => {
  const [mode, setMode] = useState<'lucide' | 'upload' | 'link'>(() => detectIconMode(value));
  const [linkInput, setLinkInput] = useState(
    value && (value.startsWith('http') || value.startsWith('/')) ? value : ''
  );
  const [isReplacing, setIsReplacing] = useState(false);
  const [replaceError, setReplaceError] = useState('');

  // Synchronize mode and inputs whenever value changes externally (e.g. clicking Edit or resetting form)
  useEffect(() => {
    setMode(detectIconMode(value));
    if (value && (value.startsWith('http') || value.startsWith('/'))) {
      setLinkInput(value);
    } else {
      setLinkInput('');
    }
  }, [value]);

  const handleLinkSubmit = (url: string) => {
    setLinkInput(url);
    onChange(url.trim());
  };

  const handleReplaceFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsReplacing(true);
    setReplaceError('');
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await apiClient<{ url: string }>('/upload', {
        method: 'POST',
        body: formData,
      });

      onChange(res.url);
    } catch (err: any) {
      setReplaceError(err.message || 'Image replacement failed');
    } finally {
      setIsReplacing(false);
    }
  };

  const isUploadedImage = Boolean(
    value &&
    (value.includes('cloudinary.com') || value.startsWith('/uploads/') || value.startsWith('/api/uploads'))
  );

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
            className="text-[10px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Clear Icon</span>
          </button>
        )}
      </div>

      {/* 3-Mode Segmented Control */}
      <div className="grid grid-cols-3 gap-1 p-1 bg-background rounded-lg border border-border">
        <button
          type="button"
          onClick={() => setMode('lucide')}
          className={cn(
            'flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer',
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
            'flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer',
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
            'flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer',
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
            'w-5 h-5 text-accent',
            'w-full h-full object-contain p-0.5'
          )}
        </div>

        <div className="flex-1 min-w-0">
          {mode === 'lucide' && (
            <input
              type="text"
              value={value.startsWith('http') || value.startsWith('/') ? '' : value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. FolderGit2, Globe, Database"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-xs text-text-main focus:outline-none focus:border-accent"
            />
          )}

          {mode === 'upload' && (
            <div>
              {isUploadedImage ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-background border border-border gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-emerald-400 leading-tight">
                        Icon Uploaded
                      </div>
                      <p className="text-[10px] text-text-muted truncate max-w-[150px] sm:max-w-[220px]">
                        {value}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <label className="flex items-center gap-1 px-2.5 py-1 rounded bg-surface hover:bg-surface-hover border border-border text-[10px] font-semibold text-text-main cursor-pointer transition-colors">
                      {isReplacing ? (
                        <Loader2 className="w-3 h-3 animate-spin text-accent" />
                      ) : (
                        <Upload className="w-3 h-3 text-accent" />
                      )}
                      <span>{isReplacing ? 'Uploading...' : 'Replace'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleReplaceFile}
                        disabled={isReplacing}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => onChange('')}
                      className="p-1 rounded text-text-muted hover:text-rose-400 transition-colors cursor-pointer"
                      title="Clear Icon"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <ImageUploader
                  label=""
                  onUploadSuccess={(url) => {
                    onChange(url);
                  }}
                />
              )}
              {replaceError && (
                <span className="text-[10px] text-rose-400 font-mono block mt-1">{replaceError}</span>
              )}
            </div>
          )}

          {mode === 'link' && (
            <input
              type="url"
              value={linkInput}
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

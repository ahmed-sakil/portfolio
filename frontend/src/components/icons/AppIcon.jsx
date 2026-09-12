import React, { useState } from 'react';
import { 
  Code2, 
  Layers, 
  Terminal, 
  Database, 
  Layout, 
  PenTool, 
  Cpu, 
  Server, 
  Sparkles, 
  Globe, 
  Briefcase, 
  FileText 
} from 'lucide-react';

const LUCIDE_FALLBACKS = {
  code: Code2,
  code2: Code2,
  layers: Layers,
  terminal: Terminal,
  database: Database,
  layout: Layout,
  pentool: PenTool,
  cpu: Cpu,
  server: Server,
  sparkles: Sparkles,
  globe: Globe,
  briefcase: Briefcase,
  filetext: FileText,
};

const BUILT_IN_SVGS = {
  github: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  linkedin: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63-.73-1.63-1.63-1.63Z" />
    </svg>
  ),
  x: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  twitter: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  leetcode: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.874 5.874 0 0 0 .349 1.017 5.938 5.938 0 0 0 .578.991l3.966 4.474a1.442 1.442 0 0 0 1.08.455c.783 0 1.422-.64 1.422-1.422a1.41 1.41 0 0 0-.41-.992L4.99 15.38a3.178 3.178 0 0 1-.72-1.897 3.036 3.036 0 0 1 .65-1.897l3.85-4.12 4.71-4.71a1.42 1.42 0 0 0 0-2.012 1.385 1.385 0 0 0-1-.444zM16.14 7.37a1.42 1.42 0 0 0-1.01.44 1.42 1.42 0 0 0 0 2.01l4.7 4.71c.42.42.66 1.01.66 1.63 0 .62-.24 1.2-.66 1.63l-5.69 5.69a1.42 1.42 0 1 0 2.01 2.01l5.69-5.69c.96-.96 1.49-2.23 1.49-3.64s-.53-2.68-1.49-3.64l-4.7-4.71a1.385 1.385 0 0 0-1-.44zM9.83 11.23a1.42 1.42 0 0 0-1.42 1.42 1.42 1.42 0 0 0 1.42 1.42h8.54a1.42 1.42 0 0 0 1.42-1.42 1.42 1.42 0 0 0 1.42-1.42H9.83z" />
    </svg>
  ),
  codeforces: (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.5 7.5a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-3 0V9a1.5 1.5 0 0 1 1.5-1.5zM12 3a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-3 0v-15A1.5 1.5 0 0 1 12 3zm7.5 7.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-3 0v-6a1.5 1.5 0 0 1 1.5-1.5z" />
    </svg>
  )
};

/**
 * Universal Icon Component
 * 
 * Props:
 * - iconUrl: Direct image URL (Cloudinary, SVG, PNG, etc.)
 * - iconName: SimpleIcons slug, Lucide name, or built-in SVG key
 * - iconType: 'light' | 'dark' (when 'dark', wraps icon in a light container so it stands out against dark background)
 * - platform: Optional fallback platform name
 * - className: CSS classes for icon size and layout
 * - plateClassName: Additional styling when dark-mode light plate is active
 * - fallbackChar: First character to show if icon cannot be resolved
 */
const AppIcon = ({
  iconUrl = '',
  iconName = '',
  iconType = 'light',
  platform = '',
  className = 'w-4 h-4',
  plateClassName = '',
  fallbackChar = ''
}) => {
  const [loadError, setLoadError] = useState(false);

  const cleanName = (iconName || platform || '').trim();
  const slug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isDark = iconType === 'dark';

  // Helper to optionally wrap content in a crisp light plate when icon is dark
  const wrapPlate = (node) => {
    if (!isDark) return node;
    return (
      <span
        className={`inline-flex items-center justify-center bg-white/95 rounded-md p-1 shadow-sm shrink-0 ${plateClassName}`}
        title={`${cleanName} (dark-icon highlight plate)`}
      >
        {node}
      </span>
    );
  };

  // 1. Direct Image URL (Custom Uploaded Icon or Direct SVG/PNG link)
  const resolvedUrl = iconUrl || (cleanName.startsWith('http://') || cleanName.startsWith('https://') || cleanName.startsWith('/') ? cleanName : null);
  if (resolvedUrl && !loadError) {
    return wrapPlate(
      <img
        src={resolvedUrl}
        alt={cleanName || 'icon'}
        className={`${className} object-contain`}
        onError={() => setLoadError(true)}
      />
    );
  }

  // 2. Built-in vector icons
  if (slug && BUILT_IN_SVGS[slug]) {
    const SvgComponent = BUILT_IN_SVGS[slug];
    const defaultColor = isDark ? 'text-slate-900' : 'text-current';
    return wrapPlate(<SvgComponent className={`${className} ${defaultColor}`} />);
  }

  // 3. Lucide Icons
  if (slug && LUCIDE_FALLBACKS[slug]) {
    const LucideComponent = LUCIDE_FALLBACKS[slug];
    const defaultColor = isDark ? 'text-slate-900' : 'text-current';
    return wrapPlate(<LucideComponent className={`${className} ${defaultColor}`} />);
  }

  // 4. SimpleIcons CDN
  if (slug && !loadError) {
    return wrapPlate(
      <img
        src={`https://cdn.simpleicons.org/${slug}`}
        alt={cleanName}
        className={`${className} object-contain`}
        onError={() => setLoadError(true)}
      />
    );
  }

  // 5. Fallback Character or Generic Icon
  if (fallbackChar || cleanName) {
    const char = (fallbackChar || cleanName).charAt(0).toUpperCase();
    return (
      <span className={`rounded bg-white/10 flex items-center justify-center font-bold text-teal-400 select-none ${className}`}>
        {char}
      </span>
    );
  }

  return <Globe className={`${className} text-teal-400`} />;
};

export default AppIcon;

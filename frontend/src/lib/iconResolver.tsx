import { LucideIcon, Terminal } from 'lucide-react';
import * as Icons from 'lucide-react';

export const TECH_ICONS_MAP: Record<string, string> = {
  react: 'Atom',
  'react.js': 'Atom',
  'reactjs': 'Atom',
  next: 'Globe',
  'next.js': 'Globe',
  'nextjs': 'Globe',
  node: 'Server',
  'node.js': 'Server',
  'nodejs': 'Server',
  typescript: 'Code2',
  ts: 'Code2',
  javascript: 'Code2',
  js: 'Code2',
  python: 'Terminal',
  py: 'Terminal',
  go: 'Cpu',
  golang: 'Cpu',
  rust: 'Cpu',
  postgresql: 'Database',
  postgres: 'Database',
  sql: 'Database',
  mysql: 'Database',
  mongodb: 'Database',
  mongo: 'Database',
  redis: 'Database',
  docker: 'Box',
  kubernetes: 'Layers',
  k8s: 'Layers',
  aws: 'Cloud',
  cloud: 'Cloud',
  git: 'Code2',
  github: 'Code2',
  security: 'Shield',
  linux: 'Terminal',
  tailwind: 'Sparkles',
  tailwindcss: 'Sparkles',
  css: 'Sparkles',
  html: 'Code2',
};

function isValidLucideComponent(comp: any): comp is LucideIcon {
  return Boolean(
    comp &&
      (typeof comp === 'function' ||
        (typeof comp === 'object' && comp !== null && (comp.render || comp.$$typeof || comp.displayName)))
  );
}

export function resolveLucideIcon(iconName?: string | null): LucideIcon | null {
  if (!iconName) return null;
  const clean = iconName.trim();
  if (!clean) return null;

  const allIcons = Icons as unknown as Record<string, any>;

  // 1. Direct match
  if (isValidLucideComponent(allIcons[clean])) {
    return allIcons[clean];
  }

  // 2. Direct match with "Icon" suffix
  if (isValidLucideComponent(allIcons[`${clean}Icon`])) {
    return allIcons[`${clean}Icon`];
  }

  // 3. Tech alias match
  const alias = TECH_ICONS_MAP[clean.toLowerCase()];
  if (alias && isValidLucideComponent(allIcons[alias])) {
    return allIcons[alias];
  }

  // 4. PascalCase conversion (e.g. "code-2" -> "Code2", "database" -> "Database")
  const stripped = clean.replace(/icon$/i, '').trim();
  const pascal = stripped
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');

  if (isValidLucideComponent(allIcons[pascal])) {
    return allIcons[pascal];
  }

  if (isValidLucideComponent(allIcons[`${pascal}Icon`])) {
    return allIcons[`${pascal}Icon`];
  }

  // 5. Case-insensitive lookup over keys
  const lower = clean.toLowerCase();
  for (const key of Object.keys(allIcons)) {
    if (key.toLowerCase() === lower && isValidLucideComponent(allIcons[key])) {
      return allIcons[key];
    }
  }

  return null;
}

export function renderResolvedIcon(
  iconStr?: string | null,
  fallback = <Terminal className="w-3.5 h-3.5 text-accent" />,
  sizeClass = "w-3.5 h-3.5 text-accent"
) {
  if (!iconStr || !iconStr.trim()) return fallback;
  const str = iconStr.trim();
  if (str.startsWith('http://') || str.startsWith('https://')) {
    return <img src={str} alt="Icon" className="w-4 h-4 object-contain" />;
  }
  const IconComp = resolveLucideIcon(str);
  if (IconComp) {
    return <IconComp className={sizeClass} />;
  }
  return fallback;
}

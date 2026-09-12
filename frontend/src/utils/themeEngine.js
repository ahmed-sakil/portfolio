/**
 * Centralized 4-Color Theme Engine
 * Controls the entire visual styling of the portfolio from:
 * 1. bg_base
 * 2. bg_surface
 * 3. text_primary
 * 4. accent
 */

// Helper to determine if a hex color is light or dark
export const isColorLight = (colorStr) => {
  if (!colorStr) return false;
  let r = 0, g = 0, b = 0;
  const hex = colorStr.trim();
  if (hex.startsWith('#')) {
    const cleanHex = hex.slice(1);
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length >= 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
  } else if (hex.startsWith('rgb')) {
    const parts = hex.replace(/[^\d,]/g, '').split(',');
    r = parseInt(parts[0], 10) || 0;
    g = parseInt(parts[1], 10) || 0;
    b = parseInt(parts[2], 10) || 0;
  }
  // HSP equation
  const hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
  return hsp > 155;
};

export const DEFAULT_DARK_THEME = {
  id: 'default-dark',
  name: 'Dark (Default)',
  accent: '#00e5a0',
  bg_base: '#0a0f1e',
  bg_surface: 'rgba(15, 23, 42, 0.88)',
  text_primary: '#f8fafc',
  bg_type: 'NEURON',
  flat_bg_code: '',
  is_active: true
};

export const DEFAULT_LIGHT_THEME = {
  id: 'default-light',
  name: 'Light (Default)',
  accent: '#0d9488',
  bg_base: '#f8fafc',
  bg_surface: 'rgba(255, 255, 255, 0.90)',
  text_primary: '#0f172a',
  bg_type: 'NEURON',
  flat_bg_code: '',
  is_active: false
};

/**
 * Injects CSS variables onto :root and body styles
 * @param {Object} theme - { accent, bg_base, bg_surface, text_primary, bg_type, flat_bg_code }
 */
export const applyThemeToDocument = (theme) => {
  if (!theme) return;
  const root = document.documentElement;

  const bgBase = theme.bg_base || '#0a0f1e';
  const bgSurface = theme.bg_surface || 'rgba(15, 23, 42, 0.88)';
  const textPrimary = theme.text_primary || '#f8fafc';
  const accent = theme.accent || '#00e5a0';
  const isLight = isColorLight(bgBase);

  // Set standard [data-theme] indicator
  root.setAttribute('data-theme', isLight ? 'light' : 'dark');

  // Core 4 Colors
  root.style.setProperty('--bg-base', bgBase);
  root.style.setProperty('--bg-surface', bgSurface);
  root.style.setProperty('--text-primary', textPrimary);
  root.style.setProperty('--accent', accent);

  // Mathematically derived colors using modern CSS color-mix
  root.style.setProperty('--text-secondary', `color-mix(in srgb, ${textPrimary} 70%, transparent)`);
  root.style.setProperty('--text-muted', `color-mix(in srgb, ${textPrimary} 45%, transparent)`);
  root.style.setProperty('--border-subtle', `color-mix(in srgb, ${textPrimary} 10%, transparent)`);
  root.style.setProperty('--border-card', `color-mix(in srgb, ${textPrimary} 12%, transparent)`);
  root.style.setProperty('--border-hover', `color-mix(in srgb, ${accent} 45%, transparent)`);
  root.style.setProperty('--border-focus', accent);
  root.style.setProperty('--accent-dim', `color-mix(in srgb, ${accent} 15%, transparent)`);
  root.style.setProperty('--accent-glow', `0 0 20px color-mix(in srgb, ${accent} 30%, transparent)`);

  // Text inverted for buttons with solid accent background
  const accentIsLight = isColorLight(accent);
  root.style.setProperty('--text-inverted', accentIsLight ? '#0a0f1e' : '#ffffff');

  // Surface variations
  root.style.setProperty('--bg-card', bgSurface);
  root.style.setProperty('--bg-input', bgSurface);
  root.style.setProperty('--bg-modal', bgSurface);
  root.style.setProperty(
    '--bg-surface-hover',
    `color-mix(in srgb, ${bgSurface} 92%, ${isLight ? '#000000' : '#ffffff'} 8%)`
  );

  // Shadows
  if (isLight) {
    root.style.setProperty(
      '--shadow-card',
      '0 12px 36px 0 rgba(0, 0, 0, 0.06), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)'
    );
  } else {
    root.style.setProperty(
      '--shadow-card',
      '0 20px 50px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
    );
  }

  // Handle Background Engine: Flat vs Neuron
  const body = document.body;
  if (theme.bg_type === 'FLAT' && theme.flat_bg_code && theme.flat_bg_code.trim()) {
    const rawCode = theme.flat_bg_code.trim();
    body.style.background = rawCode;
    body.classList.add('custom-flat-bg');
  } else {
    body.style.background = bgBase;
    body.classList.remove('custom-flat-bg');
  }

  // Cache applied theme
  try {
    localStorage.setItem('portfolio-active-theme', JSON.stringify(theme));
  } catch (e) {
    // Ignore storage issues
  }

  // Dispatch custom event for real-time canvas / cursor synchronization
  window.dispatchEvent(new CustomEvent('portfolio-theme-change', { detail: theme }));
};

/**
 * Retrieves the currently saved or initial theme from localStorage
 */
export const getStoredTheme = () => {
  try {
    const stored = localStorage.getItem('portfolio-active-theme');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    // Fall back to default
  }
  return DEFAULT_DARK_THEME;
};

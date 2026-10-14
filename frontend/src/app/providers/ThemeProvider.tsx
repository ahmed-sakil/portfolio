import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';

export interface Theme {
  id: string;
  name: string;
  slug: string;
  bg: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
  isDefault: boolean;
}

interface ThemeContextType {
  themes: Theme[];
  currentTheme: Theme | null;
  setThemeBySlug: (slug: string) => void;
  isLoading: boolean;
}

const defaultFallbackTheme: Theme = {
  id: 'default-obsidian',
  name: 'Obsidian Minimal',
  slug: 'obsidian-minimal',
  bg: '#09090b',
  surface: '#121215',
  border: '#27272a',
  text: '#fafafa',
  textMuted: '#a1a1aa',
  accent: '#ffffff',
  isDefault: true,
};

const ThemeContext = createContext<ThemeContextType>({
  themes: [defaultFallbackTheme],
  currentTheme: defaultFallbackTheme,
  setThemeBySlug: () => {},
  isLoading: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: themes = [defaultFallbackTheme], isLoading } = useQuery<Theme[]>({
    queryKey: ['themes'],
    queryFn: () => apiClient<Theme[]>('/themes'),
    staleTime: 1000 * 60 * 30, // 30 minutes cache
  });

  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultFallbackTheme);

  // Apply theme tokens to CSS Variables
  const applyThemeTokens = (theme: Theme) => {
    const root = document.documentElement;
    root.style.setProperty('--color-bg', theme.bg);
    root.style.setProperty('--color-surface', theme.surface);
    root.style.setProperty('--color-surface-hover', adjustAlpha(theme.surface, 0.9));
    root.style.setProperty('--color-border', theme.border);
    root.style.setProperty('--color-border-subtle', adjustAlpha(theme.border, 0.6));
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-text-muted', theme.textMuted);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-accent-hover', adjustAlpha(theme.accent, 0.85));
  };

  // Light helper for hover derivations if needed
  function adjustAlpha(hex: string, _alpha: number) {
    return hex; // keep clean hex by default
  }

  useEffect(() => {
    if (!themes || themes.length === 0) return;

    const savedSlug = localStorage.getItem('portfolio_active_theme');
    let selected = themes.find((t) => t.slug === savedSlug);

    if (!selected) {
      selected = themes.find((t) => t.isDefault) || themes[0];
    }

    if (selected) {
      setCurrentTheme(selected);
      applyThemeTokens(selected);
    }
  }, [themes]);

  const setThemeBySlug = (slug: string) => {
    const found = themes.find((t) => t.slug === slug);
    if (found) {
      setCurrentTheme(found);
      localStorage.setItem('portfolio_active_theme', found.slug);
      applyThemeTokens(found);
    }
  };

  return (
    <ThemeContext.Provider value={{ themes, currentTheme, setThemeBySlug, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

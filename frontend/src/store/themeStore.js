import { create } from 'zustand';
import {
  applyThemeToDocument,
  getStoredTheme,
  DEFAULT_DARK_THEME,
  DEFAULT_LIGHT_THEME,
  isColorLight
} from '../utils/themeEngine';

const initialTheme = getStoredTheme();
// Apply on initial script load
if (typeof document !== 'undefined') {
  applyThemeToDocument(initialTheme);
}

export const useThemeStore = create((set, get) => ({
  activeTheme: initialTheme,
  mode: isColorLight(initialTheme.bg_base) ? 'light' : 'dark',
  availableThemes: [],
  primaryThemeId: null,

  setAvailableThemes: (themes, primaryId = null) => {
    const primary = primaryId || themes?.find(t => t.is_active)?.id || null;
    set({ availableThemes: themes || [], primaryThemeId: primary });
  },

  // Apply a full custom theme (from user selection or admin studio)
  setCustomTheme: (themeObj, isUserAction = true) => {
    if (!themeObj) return;
    applyThemeToDocument(themeObj);
    if (isUserAction && typeof window !== 'undefined') {
      try {
        localStorage.setItem('portfolio-manual-theme-selected', 'true');
        localStorage.setItem('portfolio-active-theme', JSON.stringify(themeObj));
      } catch (e) {}
    }
    const mode = isColorLight(themeObj.bg_base) ? 'light' : 'dark';
    set({ activeTheme: themeObj, mode });
  },

  // Hydrate from server (does NOT overwrite if visitor manually picked a theme)
  hydrateServerTheme: (serverTheme) => {
    if (!serverTheme) return;
    set({ primaryThemeId: serverTheme.id });

    let userHasChosen = false;
    try {
      userHasChosen = localStorage.getItem('portfolio-manual-theme-selected') === 'true';
    } catch (e) {}

    // Only apply server theme as default if user hasn't explicitly selected one
    if (!userHasChosen) {
      applyThemeToDocument(serverTheme);
      const mode = isColorLight(serverTheme.bg_base) ? 'light' : 'dark';
      set({ activeTheme: serverTheme, mode });
    }
  },

  // Toggle between Dark and Light mode
  toggleTheme: () => {
    const { mode } = get();
    const nextMode = mode === 'dark' ? 'light' : 'dark';

    const targetTheme = nextMode === 'light' ? DEFAULT_LIGHT_THEME : DEFAULT_DARK_THEME;
    applyThemeToDocument(targetTheme);
    try {
      localStorage.setItem('portfolio-manual-theme-selected', 'true');
      localStorage.setItem('portfolio-active-theme', JSON.stringify(targetTheme));
    } catch (e) {}
    set({ activeTheme: targetTheme, mode: nextMode });
  }
}));

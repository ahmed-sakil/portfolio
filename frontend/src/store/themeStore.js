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

  // Apply a full custom theme (from database or theme studio)
  setCustomTheme: (themeObj) => {
    if (!themeObj) return;
    applyThemeToDocument(themeObj);
    const mode = isColorLight(themeObj.bg_base) ? 'light' : 'dark';
    set({ activeTheme: themeObj, mode });
  },

  // Toggle between Dark and Light mode
  toggleTheme: () => {
    const { mode, activeTheme } = get();
    const nextMode = mode === 'dark' ? 'light' : 'dark';

    // If activeTheme is a custom theme with same lightness, toggle between default light & dark
    const targetTheme = nextMode === 'light' ? DEFAULT_LIGHT_THEME : DEFAULT_DARK_THEME;
    applyThemeToDocument(targetTheme);
    set({ activeTheme: targetTheme, mode: nextMode });
  }
}));

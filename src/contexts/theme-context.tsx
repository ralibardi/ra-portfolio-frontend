'use client';

import type { Theme } from '@type/theme';
import type { IThemeContext } from '@type/theme-context';
import {
  applyThemeToDocument,
  enableThemeTransitions,
  getEffectiveTheme,
  THEME_STORAGE_KEY,
  watchSystemTheme,
} from '@utils/theme-utils';
import type React from 'react';
import {
  createContext,
  type FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

const ThemeContext = createContext<IThemeContext | null>(null);

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'system';
  }

  // Check localStorage first
  const storedTheme = window.localStorage?.getItem(THEME_STORAGE_KEY) as Theme;
  if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
    return storedTheme;
  }

  // Default to system preference
  return 'system';
};

export const ThemeProvider: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === 'undefined' ? 'system' : getPreferredTheme(),
  );

  // Initialize theme and enable transitions
  useEffect(() => {
    enableThemeTransitions();
    applyThemeToDocument(theme);
  }, [theme]);

  // Handle system theme changes
  useEffect(() => {
    const cleanup = watchSystemTheme(() => {
      if (theme === 'system') {
        applyThemeToDocument(theme);
      }
    });

    return cleanup;
  }, [theme]);

  // Apply theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      applyThemeToDocument(theme);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      switch (prevTheme) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'system';
        default:
          return 'light';
      }
    });
  }, []);

  const setSpecificTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  const getEffectiveThemeValue = useCallback(() => {
    return getEffectiveTheme(theme);
  }, [theme]);

  const contextValue = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme: setSpecificTheme,
      effectiveTheme: getEffectiveThemeValue(),
    }),
    [theme, toggleTheme, setSpecificTheme, getEffectiveThemeValue],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;

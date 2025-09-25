import { Theme } from '@type/theme';
import { IThemeContext } from '@type/theme-context';
import {
  THEME_STORAGE_KEY,
  getEffectiveTheme,
  applyThemeToDocument,
  watchSystemTheme,
  enableThemeTransitions,
} from '@utils/theme-utils';
import React, {
  createContext,
  useState,
  useEffect,
  FunctionComponent,
  useCallback,
  useMemo,
} from 'react';

const ThemeContext = createContext<IThemeContext | null>(null);

const getPreferredTheme = (): Theme => {
  // Check localStorage first
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
  if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
    return storedTheme;
  }

  // Default to system preference
  return 'system';
};

export const ThemeProvider: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getPreferredTheme);

  // Initialize theme and enable transitions
  useEffect(() => {
    enableThemeTransitions();
    applyThemeToDocument(theme);
  }, []);

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
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    applyThemeToDocument(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      switch (prevTheme) {
        case 'light':
          return 'dark';
        case 'dark':
          return 'system';
        case 'system':
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

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

import { Theme } from '@type/theme';
import { IThemeContext } from '@type/theme-context';
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
  const preferredTheme = localStorage.getItem('theme') as Theme;
  if (preferredTheme) return preferredTheme;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const isDarkMode = (theme: Theme): boolean =>
  theme === 'dark' ||
  (theme === 'system' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches);

export const ThemeProvider: FunctionComponent<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getPreferredTheme);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.classList.toggle('dark-mode', isDarkMode(theme));
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light')),
    [],
  );

  const contextValue = useMemo(
    () => ({ theme, toggleTheme }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

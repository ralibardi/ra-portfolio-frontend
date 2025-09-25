import { useTheme } from './use-theme';
import { useCallback, useMemo } from 'react';
import { Theme } from '@type/theme';
import { getThemeColor, isDarkTheme } from '@utils/theme-utils';

/**
 * Advanced theme hook with additional utilities
 */
export const useAdvancedTheme = () => {
  const themeContext = useTheme();

  const getColorForTheme = useCallback(
    (colors: { light: string; dark: string }) => {
      return getThemeColor(themeContext.theme, colors);
    },
    [themeContext.theme],
  );

  const isCurrentlyDark = useMemo(
    () => isDarkTheme(themeContext.theme),
    [themeContext.theme],
  );

  const setLightTheme = useCallback(
    () => themeContext.setTheme('light'),
    [themeContext],
  );

  const setDarkTheme = useCallback(
    () => themeContext.setTheme('dark'),
    [themeContext],
  );

  const setSystemTheme = useCallback(
    () => themeContext.setTheme('system'),
    [themeContext],
  );

  const cycleTheme = useCallback(() => {
    const { theme } = themeContext;
    const nextTheme: Theme =
      theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    themeContext.setTheme(nextTheme);
  }, [themeContext]);

  return {
    ...themeContext,
    getColorForTheme,
    isCurrentlyDark,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    cycleTheme,
  };
};

export default useAdvancedTheme;

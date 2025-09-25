import { Theme } from '@type/theme';

/**
 * Theme utility functions for advanced theme management
 */

export const THEME_STORAGE_KEY = 'ra-portfolio-theme';

/**
 * Get the effective theme based on user preference and system settings
 */
export const getEffectiveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return theme;
};

/**
 * Check if the current effective theme is dark
 */
export const isDarkTheme = (theme: Theme): boolean => {
  return getEffectiveTheme(theme) === 'dark';
};

/**
 * Get theme-appropriate color values
 */
export const getThemeColor = (
  theme: Theme,
  colors: { light: string; dark: string },
): string => {
  return isDarkTheme(theme) ? colors.dark : colors.light;
};

/**
 * Apply theme to document with proper meta tag updates
 */
export const applyThemeToDocument = (theme: Theme): void => {
  const effectiveTheme = getEffectiveTheme(theme);
  const root = document.documentElement;

  // Set data attribute for CSS
  root.setAttribute('data-theme', effectiveTheme);

  // Update PWA meta tags
  updateMetaThemeColor(effectiveTheme);
  updateStatusBarStyle(effectiveTheme);
};

/**
 * Update meta theme-color for PWA
 */
const updateMetaThemeColor = (theme: 'light' | 'dark'): void => {
  const color = theme === 'dark' ? '#2c3e50' : '#fdfdfd';

  updateMetaTag('theme-color', color);
  updateMetaTag('msapplication-navbutton-color', color);
  updateMetaTag(
    'apple-mobile-web-app-status-bar-style',
    theme === 'dark' ? 'black-translucent' : 'default',
  );
};

/**
 * Update status bar style for mobile browsers
 */
const updateStatusBarStyle = (theme: 'light' | 'dark'): void => {
  const style = theme === 'dark' ? 'black-translucent' : 'default';
  updateMetaTag('apple-mobile-web-app-status-bar-style', style);
};

/**
 * Helper to update meta tags
 */
const updateMetaTag = (name: string, content: string): void => {
  let meta = document.querySelector(`meta[name="${name}"]`);

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
};

/**
 * Get system theme preference
 */
export const getSystemThemePreference = (): 'light' | 'dark' => {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/**
 * Listen for system theme changes
 */
export const watchSystemTheme = (
  callback: (theme: 'light' | 'dark') => void,
): (() => void) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };

  mediaQuery.addEventListener('change', handleChange);

  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handleChange);
};

/**
 * Theme transition utilities
 */
export const enableThemeTransitions = (): void => {
  document.documentElement.style.setProperty(
    '--theme-transition',
    'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
  );
};

export const disableThemeTransitions = (): void => {
  document.documentElement.style.removeProperty('--theme-transition');
};

/**
 * Preload theme-specific assets
 */
export const preloadThemeAssets = (theme: 'light' | 'dark'): void => {
  // This could be used to preload theme-specific images or fonts
  // For now, it's a placeholder for future enhancements
  console.debug(`Preloading assets for ${theme} theme`);
};

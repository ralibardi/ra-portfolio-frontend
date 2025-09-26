import type { Theme } from '../type/theme';
import {
  applyThemeToDocument,
  disableThemeTransitions,
  enableThemeTransitions,
  getEffectiveTheme,
  getSystemThemePreference,
  getThemeColor,
  isDarkTheme,
  preloadThemeAssets,
  THEME_STORAGE_KEY,
  watchSystemTheme,
} from './theme-utils';

// Define theme constants for testing
const THEME_LIGHT: Theme = 'light';
const THEME_DARK: Theme = 'dark';
const THEME_SYSTEM: Theme = 'system';

// Mock matchMedia
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: mockMatchMedia,
});

// Mock document
const mockDocumentElement = {
  setAttribute: jest.fn(),
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
  },
  style: {
    setProperty: jest.fn(),
    removeProperty: jest.fn(),
  },
};
Object.defineProperty(document, 'documentElement', {
  value: mockDocumentElement,
});

describe('theme-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('THEME_STORAGE_KEY', () => {
    it('should have the correct storage key', () => {
      expect(THEME_STORAGE_KEY).toBe('ra-portfolio-theme');
    });
  });

  describe('getEffectiveTheme', () => {
    it('should return light for light theme', () => {
      expect(getEffectiveTheme(THEME_LIGHT)).toBe('light');
    });

    it('should return dark for dark theme', () => {
      expect(getEffectiveTheme(THEME_DARK)).toBe('dark');
    });

    it('should return system preference for system theme', () => {
      mockMatchMedia.mockReturnValue({ matches: true });
      expect(getEffectiveTheme(THEME_SYSTEM)).toBe('dark');

      mockMatchMedia.mockReturnValue({ matches: false });
      expect(getEffectiveTheme(THEME_SYSTEM)).toBe('light');
    });

    it('should handle missing matchMedia', () => {
      const originalMatchMedia = window.matchMedia;
      // @ts-expect-error
      window.matchMedia = undefined;

      expect(getEffectiveTheme(THEME_SYSTEM)).toBe('light');

      window.matchMedia = originalMatchMedia;
    });
  });

  describe('isDarkTheme', () => {
    it('should return true for dark theme', () => {
      expect(isDarkTheme(THEME_DARK)).toBe(true);
    });

    it('should return false for light theme', () => {
      expect(isDarkTheme(THEME_LIGHT)).toBe(false);
    });

    it('should handle system theme', () => {
      mockMatchMedia.mockReturnValue({ matches: true });
      expect(isDarkTheme(THEME_SYSTEM)).toBe(true);

      mockMatchMedia.mockReturnValue({ matches: false });
      expect(isDarkTheme(THEME_SYSTEM)).toBe(false);
    });
  });

  describe('getThemeColor', () => {
    const colors = { light: '#ffffff', dark: '#000000' };

    it('should return dark color for dark theme', () => {
      expect(getThemeColor(THEME_DARK, colors)).toBe('#000000');
    });

    it('should return light color for light theme', () => {
      expect(getThemeColor(THEME_LIGHT, colors)).toBe('#ffffff');
    });

    it('should handle system theme', () => {
      mockMatchMedia.mockReturnValue({ matches: true });
      expect(getThemeColor(THEME_SYSTEM, colors)).toBe('#000000');

      mockMatchMedia.mockReturnValue({ matches: false });
      expect(getThemeColor(THEME_SYSTEM, colors)).toBe('#ffffff');
    });
  });

  describe('applyThemeToDocument', () => {
    it('should apply light theme to document', () => {
      // Mock document methods for meta tag manipulation
      const mockMeta = { setAttribute: jest.fn() };
      const mockHead = { appendChild: jest.fn() };

      Object.defineProperty(document, 'querySelector', {
        value: jest.fn().mockReturnValue(mockMeta),
        writable: true,
      });
      Object.defineProperty(document, 'head', {
        value: mockHead,
        writable: true,
      });

      applyThemeToDocument(THEME_LIGHT);

      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    });

    it('should apply dark theme to document', () => {
      // Mock document methods for meta tag manipulation
      const mockMeta = { setAttribute: jest.fn() };
      const mockHead = { appendChild: jest.fn() };

      Object.defineProperty(document, 'querySelector', {
        value: jest.fn().mockReturnValue(mockMeta),
        writable: true,
      });
      Object.defineProperty(document, 'head', {
        value: mockHead,
        writable: true,
      });

      applyThemeToDocument(THEME_DARK);

      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });

    it('should handle system theme', () => {
      // Mock document methods for meta tag manipulation
      const mockMeta = { setAttribute: jest.fn() };
      const mockHead = { appendChild: jest.fn() };

      Object.defineProperty(document, 'querySelector', {
        value: jest.fn().mockReturnValue(mockMeta),
        writable: true,
      });
      Object.defineProperty(document, 'head', {
        value: mockHead,
        writable: true,
      });

      mockMatchMedia.mockReturnValue({ matches: true });
      applyThemeToDocument(THEME_SYSTEM);

      expect(mockDocumentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    });
  });

  describe('getSystemThemePreference', () => {
    it('should return dark when system prefers dark', () => {
      mockMatchMedia.mockReturnValue({ matches: true });

      const theme = getSystemThemePreference();
      expect(theme).toBe('dark');
      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('should return light when system prefers light', () => {
      mockMatchMedia.mockReturnValue({ matches: false });

      const theme = getSystemThemePreference();
      expect(theme).toBe('light');
    });

    it('should handle missing matchMedia', () => {
      const originalMatchMedia = window.matchMedia;
      // @ts-expect-error
      window.matchMedia = undefined;

      const theme = getSystemThemePreference();
      expect(theme).toBe('light');

      window.matchMedia = originalMatchMedia;
    });
  });

  describe('watchSystemTheme', () => {
    it('should set up media query listener', () => {
      const mockAddEventListener = jest.fn();
      const mockRemoveEventListener = jest.fn();
      const mockMediaQuery = {
        matches: false,
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
      };

      mockMatchMedia.mockReturnValue(mockMediaQuery);

      const callback = jest.fn();
      const unwatch = watchSystemTheme(callback);

      expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

      // Test cleanup
      unwatch();
      expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('should handle missing matchMedia', () => {
      const originalMatchMedia = window.matchMedia;
      // @ts-expect-error
      window.matchMedia = undefined;

      const callback = jest.fn();
      const unwatch = watchSystemTheme(callback);

      expect(typeof unwatch).toBe('function');
      unwatch(); // Should not throw

      window.matchMedia = originalMatchMedia;
    });
  });

  describe('enableThemeTransitions', () => {
    it('should set theme transition CSS property', () => {
      enableThemeTransitions();

      expect(mockDocumentElement.style.setProperty).toHaveBeenCalledWith(
        '--theme-transition',
        'background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease',
      );
    });
  });

  describe('disableThemeTransitions', () => {
    it('should remove theme transition CSS property', () => {
      disableThemeTransitions();

      expect(mockDocumentElement.style.removeProperty).toHaveBeenCalledWith('--theme-transition');
    });
  });

  describe('preloadThemeAssets', () => {
    it('should handle light theme preload', () => {
      // This is currently a placeholder function, so just test it doesn't throw
      expect(() => preloadThemeAssets('light')).not.toThrow();
    });

    it('should handle dark theme preload', () => {
      // This is currently a placeholder function, so just test it doesn't throw
      expect(() => preloadThemeAssets('dark')).not.toThrow();
    });
  });
});

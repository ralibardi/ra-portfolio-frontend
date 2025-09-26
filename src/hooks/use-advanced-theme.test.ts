import { act } from '@testing-library/react';
import { customRenderHook } from '@utils/test-utilities';
import { useAdvancedTheme } from './use-advanced-theme';

// Mock the theme utils module
jest.mock('@utils/theme-utils', () => ({
  getThemeColor: jest.fn(),
  isDarkTheme: jest.fn(),
  getEffectiveTheme: jest.fn(),
  enableThemeTransitions: jest.fn(),
  applyThemeToDocument: jest.fn(),
  watchSystemTheme: jest.fn(),
}));

// Import the mocked functions after the mock is set up
import {
  applyThemeToDocument,
  enableThemeTransitions,
  getEffectiveTheme,
  getThemeColor,
  isDarkTheme,
  watchSystemTheme,
} from '@utils/theme-utils';

const mockGetThemeColor = getThemeColor as jest.MockedFunction<typeof getThemeColor>;
const mockIsDarkTheme = isDarkTheme as jest.MockedFunction<typeof isDarkTheme>;
const mockGetEffectiveTheme = getEffectiveTheme as jest.MockedFunction<typeof getEffectiveTheme>;
const mockEnableThemeTransitions = enableThemeTransitions as jest.MockedFunction<
  typeof enableThemeTransitions
>;
const mockApplyThemeToDocument = applyThemeToDocument as jest.MockedFunction<
  typeof applyThemeToDocument
>;
const mockWatchSystemTheme = watchSystemTheme as jest.MockedFunction<typeof watchSystemTheme>;

describe('useAdvancedTheme', () => {
  beforeEach(() => {
    localStorage.clear();

    // Mock matchMedia for consistent testing
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query !== '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Setup mock implementations
    mockGetThemeColor.mockImplementation((theme, colors) => {
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
      return isDark ? colors.dark : colors.light;
    });

    mockIsDarkTheme.mockImplementation((theme) => {
      return (
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia?.('(prefers-color-scheme: dark)').matches)
      );
    });

    mockGetEffectiveTheme.mockImplementation((theme) => {
      if (theme === 'system') {
        return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme;
    });

    mockEnableThemeTransitions.mockImplementation(() => {
      // Mock implementation - no-op for tests
    });

    mockApplyThemeToDocument.mockImplementation(() => {
      // Mock implementation - no-op for tests
    });

    mockWatchSystemTheme.mockImplementation(() => {
      // Mock implementation - return cleanup function
      return () => {
        // Cleanup function for system theme watcher
      };
    });
  });

  it('should provide all theme context properties plus advanced utilities', () => {
    const { result } = customRenderHook(() => useAdvancedTheme());

    // Basic theme context properties
    expect(result.current.theme).toBeDefined();
    expect(result.current.toggleTheme).toBeDefined();
    expect(result.current.setTheme).toBeDefined();
    expect(result.current.effectiveTheme).toBeDefined();

    // Advanced utilities
    expect(result.current.getColorForTheme).toBeDefined();
    expect(result.current.isCurrentlyDark).toBeDefined();
    expect(result.current.setLightTheme).toBeDefined();
    expect(result.current.setDarkTheme).toBeDefined();
    expect(result.current.setSystemTheme).toBeDefined();
    expect(result.current.cycleTheme).toBeDefined();
  });

  it('should return correct color for theme', () => {
    const { result } = customRenderHook(() => useAdvancedTheme());

    const colors = { light: '#ffffff', dark: '#000000' };
    const color = result.current.getColorForTheme(colors);

    // Should return light color since system preference is mocked as light
    expect(color).toBe('#ffffff');
  });

  it('should correctly identify if current theme is dark', () => {
    const { result } = customRenderHook(() => useAdvancedTheme());

    // With light system preference, should not be dark
    expect(result.current.isCurrentlyDark).toBe(false);
  });

  it('should set specific themes', () => {
    const { result } = customRenderHook(() => useAdvancedTheme());

    act(() => {
      result.current.setLightTheme();
    });
    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.setDarkTheme();
    });
    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.setSystemTheme();
    });
    expect(result.current.theme).toBe('system');
  });

  it('should cycle through themes correctly', () => {
    const { result } = customRenderHook(() => useAdvancedTheme());

    // Start with system theme
    expect(result.current.theme).toBe('system');

    // Cycle: system -> light
    act(() => {
      result.current.cycleTheme();
    });
    expect(result.current.theme).toBe('light');

    // Cycle: light -> dark
    act(() => {
      result.current.cycleTheme();
    });
    expect(result.current.theme).toBe('dark');

    // Cycle: dark -> system
    act(() => {
      result.current.cycleTheme();
    });
    expect(result.current.theme).toBe('system');
  });
});

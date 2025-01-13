import { renderHook } from '@testing-library/react';
import { useTheme } from './use-theme';
import { customRenderHook } from '@utils/test-utilities';

describe('useTheme', () => {
  let consoleErrorSpy: jest.SpyInstance;
  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should return the context when used within a ThemeProvider', () => {
    const { result } = customRenderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
  });

  it('should throw an error when used outside a ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      'useTheme must be used within a ThemeProvider',
    );
  });
});

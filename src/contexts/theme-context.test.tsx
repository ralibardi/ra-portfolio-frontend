import React, { FunctionComponent } from 'react';
import { customRender, screen, act } from '@utils/test-utilities';
import userEvent from '@testing-library/user-event';
import ThemeContext, { ThemeProvider } from './theme-context';
import { IThemeContext } from '@type/theme-context';
import { useTheme } from '@hooks/use-theme';

describe('ThemeProvider', () => {
  const TestComponent: FunctionComponent<{ onClick?: () => void }> = ({
    onClick,
  }) => {
    const themeContextValue = useTheme();
    const { toggleTheme } = themeContextValue;
    return (
      <button onClick={onClick || toggleTheme} data-testid="toggle-theme">
        Toggle Theme
      </button>
    );
  };

  beforeEach(() => {
    localStorage.clear();
    document.body.className = '';
  });

  it('renders children correctly', () => {
    customRender(
      <ThemeProvider>
        <div data-testid="child">Test Child</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('provides a theme context value', () => {
    let themeContextValue: IThemeContext | null = null;
    customRender(
      <ThemeProvider>
        <ThemeContext.Consumer>
          {(value) => {
            themeContextValue = value;
            return null;
          }}
        </ThemeContext.Consumer>
      </ThemeProvider>,
    );

    expect(themeContextValue).toHaveProperty('theme', 'light');
  });

  it('allows theme to be toggled', async () => {
    let themeContextValue: IThemeContext | null = null;
    customRender(
      <ThemeProvider>
        <TestComponent />
        <ThemeContext.Consumer>
          {(value) => {
            themeContextValue = value;
            return null;
          }}
        </ThemeContext.Consumer>
      </ThemeProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('toggle-theme'));
    });

    expect(themeContextValue).toHaveProperty('theme', 'dark');
  });

  it('initializes theme based on system preference and localStorage', () => {
    const mockMatchMedia = (prefersDark: boolean) =>
      jest.fn().mockImplementation((query) => ({
        matches:
          query === '(prefers-color-scheme: dark)' ? prefersDark : !prefersDark,
        addListener: jest.fn(),
        removeListener: jest.fn(),
      }));

    const testCases = [
      { localStorage: null, systemPreference: 'light', expected: 'light' },
      { localStorage: null, systemPreference: 'dark', expected: 'dark' },
      { localStorage: 'light', systemPreference: 'dark', expected: 'light' },
      { localStorage: 'dark', systemPreference: 'light', expected: 'dark' },
    ];

    testCases.forEach(({ localStorage, systemPreference, expected }) => {
      if (localStorage) {
        window.localStorage.setItem('theme', localStorage);
      }
      window.matchMedia = mockMatchMedia(systemPreference === 'dark');

      customRender(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>,
      );

      expect(document.body.classList.contains('dark-mode')).toBe(
        expected === 'dark',
      );
      window.localStorage.clear();
    });
  });

  it('updates localStorage and body class on theme toggle', async () => {
    customRender(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    );

    await act(async () => {
      await userEvent.click(screen.getByTestId('toggle-theme'));
    });

    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.body.classList.contains('dark-mode')).toBe(true);

    await act(async () => {
      await userEvent.click(screen.getByTestId('toggle-theme'));
    });

    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.body.classList.contains('dark-mode')).toBe(false);
  });
});

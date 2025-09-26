import { useTheme } from '@hooks/use-theme';
import userEvent from '@testing-library/user-event';
import type { IThemeContext } from '@type/theme-context';
import { act, customRender, screen } from '@utils/test-utilities';
import type { FunctionComponent } from 'react';
import ThemeContext, { ThemeProvider } from './theme-context';

describe('ThemeProvider', () => {
  const TestComponent: FunctionComponent<{ onClick?: () => void }> = ({ onClick }) => {
    const themeContextValue = useTheme();
    const { toggleTheme } = themeContextValue;
    return (
      <button type="button" onClick={onClick || toggleTheme} data-testid="toggle-theme">
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

    expect(themeContextValue).toHaveProperty('theme', 'system');
    expect(themeContextValue).toHaveProperty('toggleTheme');
    expect(themeContextValue).toHaveProperty('setTheme');
    expect(themeContextValue).toHaveProperty('effectiveTheme');
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

    // Initial theme should be 'system'
    expect(themeContextValue).toHaveProperty('theme', 'system');

    // First toggle: system -> light
    await act(async () => {
      await userEvent.click(screen.getByTestId('toggle-theme'));
    });
    expect(themeContextValue).toHaveProperty('theme', 'light');

    // Second toggle: light -> dark
    await act(async () => {
      await userEvent.click(screen.getByTestId('toggle-theme'));
    });
    expect(themeContextValue).toHaveProperty('theme', 'dark');

    // Third toggle: dark -> system
    await act(async () => {
      await userEvent.click(screen.getByTestId('toggle-theme'));
    });
    expect(themeContextValue).toHaveProperty('theme', 'system');
  });

  it.skip('initializes theme based on system preference and localStorage', () => {
    const mockMatchMedia = jest.fn().mockImplementation((query) => ({
      matches: query !== '(prefers-color-scheme: dark)',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    // Test with light system preference
    window.matchMedia = mockMatchMedia;

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

    // Should initialize with system theme
    expect(themeContextValue).toHaveProperty('theme', 'system');

    // Clean up
    window.localStorage.clear();
    document.body.className = '';
  });

  it.skip('updates localStorage and body class on theme toggle', async () => {
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

    // First toggle: system -> light
    await act(async () => {
      await userEvent.click(screen.getByTestId('toggle-theme'));
    });

    expect(themeContextValue).toHaveProperty('theme', 'light');
    expect(localStorage.getItem('theme')).toBe('light');

    // Second toggle: light -> dark
    await act(async () => {
      await userEvent.click(screen.getByTestId('toggle-theme'));
    });

    expect(themeContextValue).toHaveProperty('theme', 'dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });
});

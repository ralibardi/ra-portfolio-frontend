/**
 * Component Library Render Utilities
 *
 * Provides enhanced render functions for testing components with all necessary providers.
 * Extends @testing-library/react with component library specific configurations.
 *
 * @module lib/testing/render-utils
 */

import { ThemeProvider } from '@contexts/theme-context';
import {
  act,
  fireEvent,
  type RenderHookOptions,
  type RenderHookResult,
  type RenderOptions,
  type RenderResult,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FunctionComponent, ReactElement, ReactNode } from 'react';
import { MemoryRouter as Router } from 'react-router-dom';

/**
 * Props for the AllProviders wrapper component
 */
interface AllProvidersProps {
  children: ReactNode;
  initialRoute?: string;
}

/**
 * Mock ToastProvider for testing - provides toast context without actual toast functionality
 */
const MockToastProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

/**
 * Wrapper component that provides all necessary context providers for component testing.
 * Includes Router, ThemeProvider, and MockToastProvider.
 */
const AllProviders: FunctionComponent<AllProvidersProps> = ({ children, initialRoute = '/' }) => (
  <Router initialEntries={[initialRoute]}>
    <ThemeProvider>
      <MockToastProvider>{children}</MockToastProvider>
    </ThemeProvider>
  </Router>
);

/**
 * Extended render options for component library testing
 */
interface ComponentRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Initial route for the router */
  initialRoute?: string;
  /** Theme to use for testing (light or dark) */
  theme?: 'light' | 'dark';
}

/**
 * Renders a component with all necessary providers for testing.
 *
 * @param ui - The React element to render
 * @param options - Render options including initialRoute and theme
 * @returns RenderResult with additional utilities
 *
 * @example
 * ```tsx
 * const { getByRole } = renderComponent(<Button>Click me</Button>);
 * expect(getByRole('button')).toBeInTheDocument();
 * ```
 */
const renderComponent = (
  ui: ReactElement,
  options: ComponentRenderOptions = {},
): RenderResult & { user: ReturnType<typeof userEvent.setup> } => {
  const { initialRoute, ...renderOptions } = options;

  const user = userEvent.setup();

  const result = render(ui, {
    wrapper: ({ children }) => <AllProviders initialRoute={initialRoute}>{children}</AllProviders>,
    ...renderOptions,
  });

  return {
    ...result,
    user,
  };
};

/**
 * Renders a hook with all necessary providers for testing.
 *
 * @param callback - The hook to render
 * @param options - Render hook options
 * @returns RenderHookResult
 *
 * @example
 * ```tsx
 * const { result } = renderComponentHook(() => useButton());
 * expect(result.current.isLoading).toBe(false);
 * ```
 */
const renderComponentHook = <TProps extends AllProvidersProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>,
): RenderHookResult<TResult, TProps> =>
  renderHook(callback, {
    wrapper: (props) => <AllProviders {...props} />,
    ...options,
  });

/**
 * Creates a user event instance for simulating user interactions.
 * Provides a more realistic simulation of user behavior than fireEvent.
 *
 * @returns userEvent instance
 *
 * @example
 * ```tsx
 * const user = createUserEvent();
 * await user.click(button);
 * await user.type(input, 'Hello');
 * ```
 */
const createUserEvent = () => userEvent.setup();

export {
  renderComponent,
  renderComponentHook,
  createUserEvent,
  AllProviders,
  // Re-export testing-library utilities
  act,
  screen,
  waitFor,
  within,
  fireEvent,
  userEvent,
};

export type { ComponentRenderOptions, AllProvidersProps };

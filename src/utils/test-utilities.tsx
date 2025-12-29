import { ThemeProvider } from '@contexts/theme-context';
import {
  act,
  type RenderHookOptions,
  type RenderHookResult,
  type RenderOptions,
  type RenderResult,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import type { FunctionComponent, ReactElement, ReactNode } from 'react';

interface IAllProvidersProps {
  children: ReactNode;
}

// Mock ToastProvider for testing
const MockToastProvider: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const AllProviders: FunctionComponent<IAllProvidersProps> = ({ children }) => (
  <ThemeProvider>
    <MockToastProvider>{children}</MockToastProvider>
  </ThemeProvider>
);

const customRender = (ui: ReactElement, options?: RenderOptions): RenderResult =>
  render(ui, { wrapper: AllProviders, ...options });

const customRenderHook = <TProps extends IAllProvidersProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>,
): RenderHookResult<TResult, TProps> =>
  renderHook(callback, {
    wrapper: (props) => <AllProviders {...props} />,
    ...options,
  });

export { customRender, customRenderHook, act, screen, waitFor };

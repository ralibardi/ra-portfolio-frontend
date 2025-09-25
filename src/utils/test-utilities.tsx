import React, { FunctionComponent, ReactNode, ReactElement } from 'react';
import { act } from '@testing-library/react';
import { MemoryRouter as Router } from 'react-router-dom';
import {
  render,
  RenderHookOptions,
  RenderHookResult,
  RenderOptions,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';
import { ThemeProvider } from '@contexts/theme-context';
import { renderHook } from '@testing-library/react';

interface IAllProvidersProps {
  children: ReactNode;
}

// Mock ToastProvider for testing
const MockToastProvider: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

const AllProviders: FunctionComponent<IAllProvidersProps> = ({ children }) => (
  <Router>
    <ThemeProvider>
      <MockToastProvider>{children}</MockToastProvider>
    </ThemeProvider>
  </Router>
);

const customRender = (
  ui: ReactElement,
  options?: RenderOptions,
): RenderResult => render(ui, { wrapper: AllProviders, ...options });

const customRenderHook = <TProps extends IAllProvidersProps, TResult>(
  callback: (props: TProps) => TResult,
  options?: RenderHookOptions<TProps>,
): RenderHookResult<TResult, TProps> =>
  renderHook(callback, {
    wrapper: (props) => <AllProviders {...props} />,
    ...options,
  });

export { customRender, customRenderHook, act, screen, waitFor };

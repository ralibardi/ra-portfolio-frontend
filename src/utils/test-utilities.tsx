import React, {
  act,
  FunctionComponent,
  ReactNode,
  ReactElement,
  ComponentType,
} from 'react';
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

const AllProviders: FunctionComponent<IAllProvidersProps> = ({ children }) => (
  <Router>
    <ThemeProvider>{children}</ThemeProvider>
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
    wrapper: AllProviders as ComponentType<TProps>,
    ...options,
  });

export { customRender, customRenderHook, act, screen, waitFor };

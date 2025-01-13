import React, { act, FunctionComponent } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@contexts/theme-context';
import App from './app';

const TestableComponent: FunctionComponent = () => {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

describe('App', () => {
  it('renders without crashing', async () => {
    render(<TestableComponent />);

    const element = await act(() => {
      const element = screen;
      return element;
    });

    expect(element).not.toBeNull();
  });

  it('renders the App container component', async () => {
    render(<TestableComponent />);

    const element = await act(() => {
      const element = screen.getAllByTestId('app-container');
      return element;
    });

    expect(element).not.toBeNull();
  });
});

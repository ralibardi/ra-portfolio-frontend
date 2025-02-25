import React from 'react';
import HomePage from './home-page';
import { render, screen } from '@testing-library/react';

// Mock the Loading component
jest.mock('@components/loading', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

// Mock Suspense to immediately render its children without delay
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    Suspense: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('HomePage', () => {
  it('renders without crashing', async () => {
    render(<HomePage />);
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
  });

  it('displays the construction message', async () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', {
      name: /under construction/i,
    });
    const message = screen.getByText(/thank you for your patience/i);

    expect(heading).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });

  it('applies correct styles to container', async () => {
    render(<HomePage />);
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('container');
  });

  it('applies correct styles to construction message', async () => {
    render(<HomePage />);
    const message = screen.getByText(/thank you for your patience/i);
    const messageContainer = message.closest('div');
    expect(messageContainer).toHaveClass('constructionMessage');
  });
});

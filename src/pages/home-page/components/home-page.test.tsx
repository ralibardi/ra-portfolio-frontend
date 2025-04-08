import React from 'react';
import HomePage from './home-page';
import { render, screen } from '@testing-library/react';

// Mock the Loading component since it's lazy loaded
jest.mock('@components/loading', () => () => (
  <div data-testid="loading">Loading...</div>
));

describe('HomePage', () => {
  it('renders without crashing', async () => {
    render(<HomePage />);
    const container = await screen.findByTestId('container');
    expect(container).toBeInTheDocument();
  });

  it('displays the under construction heading', async () => {
    render(<HomePage />);
    const heading = await screen.findByRole('heading', {
      name: /under construction/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('displays the construction message', async () => {
    render(<HomePage />);
    const message = await screen.findByText(/thank you for your patience/i);
    expect(message).toBeInTheDocument();
  });

  it('has the correct CSS class', async () => {
    render(<HomePage />);
    const container = await screen.findByTestId('container');
    expect(container).toHaveClass('container');
  });
});

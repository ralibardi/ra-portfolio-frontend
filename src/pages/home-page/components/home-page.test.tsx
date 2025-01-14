import React from 'react';
import HomePage from './home-page';
import { render, screen } from '@testing-library/react';

describe('HomePage', () => {
  it('renders without crashing', async () => {
    render(<HomePage />);
    const container = await screen.findByRole('generic');
    expect(container).toBeInTheDocument();
  });
});

import React from 'react';
import GamingPage from './gaming-page';
import { render, screen } from '@testing-library/react';

describe('GamingPage', () => {
  it('renders without crashing', async () => {
    render(<GamingPage />);
    const container = await screen.findByRole('generic');
    expect(container).toBeInTheDocument();
  });
});

import React from 'react';
import CVPage from './cv-page';
import { render, screen } from '@testing-library/react';

describe('CVPage', () => {
  it('renders without crashing', async () => {
    render(<CVPage />);
    const container = await screen.findByRole('generic');
    expect(container).toBeInTheDocument();
  });
});

import React from 'react';
import PhotographyPage from './photography-page';
import { render, screen } from '@testing-library/react';

describe('PhotographyPage', () => {
  it('renders without crashing', async () => {
    render(<PhotographyPage />);
    const container = await screen.findByRole('generic');
    expect(container).toBeInTheDocument();
  });
});

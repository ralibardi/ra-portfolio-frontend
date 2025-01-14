import React from 'react';
import ContactPage from './contact-page';
import { render, screen } from '@testing-library/react';

describe('ContactPage', () => {
  it('renders without crashing', async () => {
    render(<ContactPage />);
    const container = await screen.findByRole('generic');
    expect(container).toBeInTheDocument();
  });
});

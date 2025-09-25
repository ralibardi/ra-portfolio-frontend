import React from 'react';
import { render, screen } from '@testing-library/react';
import Divider from './divider';

describe('Divider', () => {
  it('renders horizontal divider', () => {
    render(<Divider />);
    const sep = screen.getByRole('separator');
    expect(sep).toBeInTheDocument();
    expect(sep).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renders label when provided', () => {
    render(<Divider label="OR" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('renders vertical divider', () => {
    render(<Divider orientation="vertical" />);
    const sep = screen.getByRole('separator');
    expect(sep).toBeInTheDocument();
    expect(sep).toHaveAttribute('aria-orientation', 'vertical');
  });
});

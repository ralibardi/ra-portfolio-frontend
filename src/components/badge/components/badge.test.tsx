import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '../components/badge';

describe('Badge', () => {
  it('renders content', () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText('Badge')).toBeInTheDocument();
  });
});

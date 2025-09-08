import React from 'react';
import { render, screen } from '@testing-library/react';
import Container from '../components/container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>content</Container>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});

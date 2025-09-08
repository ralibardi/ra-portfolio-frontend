import React from 'react';
import { render, screen } from '@testing-library/react';
import Grid from '../components/grid';

describe('Grid', () => {
  it('renders children as grid items', () => {
    render(
      <Grid>
        <div>Item 1</div>
        <div>Item 2</div>
      </Grid>,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });
});

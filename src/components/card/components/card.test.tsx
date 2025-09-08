import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../components/card';

describe('Card', () => {
  it('renders header and footer', () => {
    render(
      <Card header={<div>Header</div>} footer={<div>Footer</div>}>
        Body
      </Card>,
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});

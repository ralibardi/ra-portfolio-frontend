import React from 'react';
import { render, screen } from '@testing-library/react';
import Section from '../components/section';

describe('Section', () => {
  it('renders title and subtitle', () => {
    render(<Section title="Title" subtitle="Subtitle" />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });
});

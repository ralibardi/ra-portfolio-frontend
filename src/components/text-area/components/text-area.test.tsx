import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextArea from './text-area';

describe('TextArea', () => {
  it('renders label and textarea', () => {
    render(<TextArea label="Message" placeholder="Your message" />);
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your message')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<TextArea label="Message" helperText="Max 500 characters" />);
    expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
  });

  it('shows error text and aria-invalid', () => {
    render(<TextArea label="Message" error="Too short" />);
    const area = screen.getByLabelText('Message');
    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(area).toHaveAttribute('aria-invalid', 'true');
  });

  it('accepts typing', async () => {
    const user = userEvent.setup();
    render(<TextArea label="Message" />);
    const area = screen.getByLabelText('Message');
    await user.type(area, 'Hello');
    expect(area).toHaveValue('Hello');
  });
});

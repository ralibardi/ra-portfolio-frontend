import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from './text-input';

describe('TextInput', () => {
  it('renders label and input', () => {
    render(<TextInput label="Name" placeholder="Your name" />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Your name')).toBeInTheDocument();
  });

  it('shows helper text', () => {
    render(<TextInput label="Email" helperText="We will not spam you" />);
    expect(screen.getByText('We will not spam you')).toBeInTheDocument();
  });

  it('shows error text and aria-invalid', () => {
    render(<TextInput label="Email" error="Invalid email" />);
    const input = screen.getByLabelText('Email');
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('accepts typing', async () => {
    const user = userEvent.setup();
    render(<TextInput label="Name" />);
    const input = screen.getByLabelText('Name');
    await user.type(input, 'Ronny');
    expect(input).toHaveValue('Ronny');
  });
});

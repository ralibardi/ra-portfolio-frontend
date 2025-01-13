import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleWithLabel from './toggle-with-label';

describe('ToggleWithLabel', () => {
  it('renders without crashing', () => {
    render(<ToggleWithLabel onClick={jest.fn()} label="Testing" />);
    expect(screen.getByTestId('toggle-container')).toBeInTheDocument();
  });

  it('renders unchecked by default', () => {
    render(<ToggleWithLabel onClick={jest.fn()} label="Testing" />);
    const toggle = screen.getByTestId('toggle-switch-container');
    expect(toggle).toHaveAttribute('data-ison', 'false');
  });

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn();
    render(<ToggleWithLabel onClick={onClick} label="Testing" />);
    const toggle = screen.getByTestId('toggle-switch-container');
    await userEvent.click(toggle);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders the label correctly', () => {
    const label = 'Test Label';
    render(<ToggleWithLabel onClick={jest.fn()} label={label} />);
    expect(screen.getByTestId('toggle-label')).toHaveTextContent(label);
  });
});

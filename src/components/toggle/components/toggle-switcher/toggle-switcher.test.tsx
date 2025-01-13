import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleSwitcher from './toggle-switcher';

describe('ToggleSwitcher', () => {
  const renderToggleSwitcher = (props = {}) => {
    const defaultProps = {
      checked: false,
      onChange: jest.fn(),
      invertedIconLogic: false,
    };
    return render(<ToggleSwitcher {...defaultProps} {...props} />);
  };

  it('renders without errors', () => {
    renderToggleSwitcher();
    expect(screen.getByTestId('toggle-input')).toBeInTheDocument();
  });

  it('renders the switcher in the off state by default', () => {
    renderToggleSwitcher();
    expect(screen.getByTestId('toggle-input')).not.toBeChecked();
  });

  it('renders the switcher in the on state when checked prop is true', () => {
    renderToggleSwitcher({ checked: true });
    expect(screen.getByTestId('toggle-input')).toBeChecked();
  });

  it('calls the onChange callback when clicked', async () => {
    const onChange = jest.fn();
    renderToggleSwitcher({ onChange });

    await userEvent.click(screen.getByTestId('toggle-input'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('respects invertedIconLogic prop', () => {
    renderToggleSwitcher({ checked: true, invertedIconLogic: true });
    expect(screen.getByTestId('toggle-input')).not.toBeChecked();
  });
});

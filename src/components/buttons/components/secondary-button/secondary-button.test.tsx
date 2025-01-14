import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SecondaryButton } from '..';

describe('SecondaryButton', () => {
  const renderButton = (props = {}) => {
    return render(
      <SecondaryButton label="Test" onClick={jest.fn()} {...props} />,
    );
  };

  test('renders correctly', () => {
    renderButton();

    const buttonContainer = screen.getByTestId('secondary-button-container');
    const label = screen.getByTestId('secondary-button-label');

    expect(buttonContainer).toHaveAttribute('id', 'secondary-button');
    expect(label).toHaveTextContent('Test');
  });

  test('handles click events', async () => {
    const handleClick = jest.fn();
    renderButton({ onClick: handleClick });

    const buttonContainer = screen.getByTestId('secondary-button-container');
    await userEvent.click(buttonContainer);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('shows spinner when loading', () => {
    renderButton({ label: 'Loading', isLoading: true });

    expect(screen.getByTestId('secondary-button-container')).toHaveAttribute(
      'id',
      'secondary-button',
    );
    expect(screen.getByTestId('loading-container')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});

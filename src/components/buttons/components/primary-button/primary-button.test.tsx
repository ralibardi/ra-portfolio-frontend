import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { PrimaryButton } from '..';

describe('PrimaryButton', () => {
  const renderButton = (props = {}) => {
    return render(
      <PrimaryButton label="Test" onClick={jest.fn()} {...props} />,
    );
  };

  test('renders correctly', () => {
    renderButton();

    const buttonContainer = screen.getByTestId('primary-button-container');
    const label = screen.getByTestId('primary-button-label');

    expect(buttonContainer).toHaveAttribute('id', 'primary-button');
    expect(label).toHaveTextContent('Test');
  });

  test('handles click events', async () => {
    const handleClick = jest.fn();
    renderButton({ onClick: handleClick });

    const buttonContainer = screen.getByTestId('primary-button-container');
    await userEvent.click(buttonContainer);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('shows spinner when loading', () => {
    renderButton({ label: 'Loading', isLoading: true });

    expect(screen.getByTestId('primary-button-container')).toHaveAttribute(
      'id',
      'primary-button',
    );
    expect(screen.getByTestId('loading-container')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { SecondaryButton } from '..';

describe('SecondaryButton', () => {
  const renderButton = (props = {}) => {
    return render(<SecondaryButton label="Test" onClick={jest.fn()} {...props} />);
  };

  test('renders correctly', () => {
    renderButton();

    const buttonContainer = screen.getByTestId('secondary-button-container');
    const label = screen.getByTestId('secondary-button-label');

    expect(buttonContainer).toHaveAttribute('id');
    expect(buttonContainer.getAttribute('id')).toBeTruthy();
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

    const buttonContainer = screen.getByTestId('secondary-button-container');
    expect(buttonContainer).toHaveAttribute('id');
    expect(buttonContainer.getAttribute('id')).toBeTruthy();
    expect(screen.getByTestId('loading-container')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});

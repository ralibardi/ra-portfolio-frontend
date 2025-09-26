import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { Toggle } from '..';

describe('Toggle', () => {
  const setup = () => {
    const handleClick = jest.fn();
    render(<Toggle onClick={handleClick} />);
    const switchContainer = screen.getByTestId('toggle-container');
    const switchElement = screen.getByTestId('toggle-switch');
    return { switchContainer, switchElement, handleClick };
  };

  test('renders correctly', () => {
    const { switchContainer, switchElement } = setup();

    expect(switchContainer).toBeInTheDocument();
    expect(switchElement).toBeInTheDocument();
  });

  test('handles click events', async () => {
    const { switchElement, handleClick } = setup();

    await userEvent.click(switchElement);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

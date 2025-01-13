import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleWithIcons from './toggle-with-icons';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

describe('ToggleWithIcons', () => {
  it('renders without crashing', () => {
    render(<ToggleWithIcons onClick={jest.fn()} />);
    expect(screen.getByTestId('toggle-container')).toBeInTheDocument();
  });

  it('renders with the correct icons', () => {
    render(
      <ToggleWithIcons
        iconLeft={faCheck}
        iconRight={faTimes}
        onClick={jest.fn()}
      />,
    );

    expect(screen.getByTestId('toggle-icon-left')).toHaveClass('iconLeft');
    expect(screen.getByTestId('toggle-icon-right')).toHaveClass('iconRight');
  });

  it('renders unchecked by default', () => {
    render(<ToggleWithIcons onClick={jest.fn()} />);
    expect(screen.getByTestId('toggle-container')).not.toHaveAttribute(
      'data-ison',
      'true',
    );
  });

  it('calls onClick when clicked', async () => {
    const onClick = jest.fn();
    render(<ToggleWithIcons onClick={onClick} />);

    await userEvent.click(screen.getByTestId('toggle-container'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

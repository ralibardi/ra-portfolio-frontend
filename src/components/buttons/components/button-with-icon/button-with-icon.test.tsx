import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ButtonWithIcon } from '..';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

describe('ButtonWithIcon', () => {
  const defaultProps = {
    label: 'Test',
    onClick: jest.fn(),
    icon: faArrowLeft,
  };

  test('renders correctly', () => {
    render(<ButtonWithIcon {...defaultProps} />);

    expect(screen.getByTestId('button-with-icon-container')).toHaveAttribute(
      'id',
      'button-with-icon',
    );
    expect(
      screen.getByTestId('button-with-icon-label-container'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('button-with-icon-icon')).toBeInTheDocument();
    expect(screen.getByTestId('button-with-icon-label')).toHaveTextContent(
      'Test',
    );
  });

  test('handles click events', async () => {
    const user = userEvent.setup();
    render(<ButtonWithIcon {...defaultProps} />);

    await user.click(screen.getByTestId('button-with-icon-container'));

    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  test('shows spinner when loading', () => {
    render(<ButtonWithIcon {...defaultProps} isLoading />);

    expect(screen.getByTestId('loading-container')).toBeInTheDocument();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(
      screen.queryByTestId('button-with-icon-label-container'),
    ).not.toBeInTheDocument();
  });
});

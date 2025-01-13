import React from 'react';
import { customRender } from './test-utilities';
import userEvent from '@testing-library/user-event';

describe('clickButton', () => {
  const renderButton = (onClick: jest.Mock, disabled: boolean = false) => {
    const { getByRole } = customRender(
      <button onClick={onClick} disabled={disabled}>
        Click me
      </button>,
    );
    return getByRole('button');
  };

  it('should call the onClick function when a button is clicked', async () => {
    const onClick = jest.fn();
    const button = renderButton(onClick);

    await userEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it('should not call the onClick function when a disabled button is clicked', async () => {
    const onClick = jest.fn();
    const button = renderButton(onClick, true);

    await userEvent.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should call the onClick function with the correct event object', async () => {
    const onClick = jest.fn();
    const button = renderButton(onClick);

    await userEvent.click(button);

    expect(onClick).toHaveBeenCalledWith(expect.any(Object));
  });
});

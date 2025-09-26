import userEvent from '@testing-library/user-event';
import { customRender } from './test-utilities';

describe('clickButton', () => {
  const renderButton = (onClick: jest.Mock, disabled = false) => {
    const { getByRole } = customRender(
      <button type="button" onClick={onClick} disabled={disabled}>
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

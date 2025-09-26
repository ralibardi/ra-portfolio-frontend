import { ToastProvider, useToast } from '@contexts/toast-context';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
import ToastContainer from './toast-container';

const Harness: React.FC = () => {
  const { success, showToast } = useToast();
  return (
    <div>
      <button type="button" onClick={() => success('Success!')} aria-label="trigger-success">
        trigger
      </button>
      <button
        type="button"
        onClick={() => showToast('Timed', { durationMs: 1000 })}
        aria-label="trigger-timed"
      >
        trigger timed
      </button>
    </div>
  );
};

const renderWithProvider = (ui: React.ReactElement) =>
  render(
    <ToastProvider>
      <ToastContainer />
      {ui}
    </ToastProvider>,
  );

describe('ToastContainer', () => {
  it('shows a success toast', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness />);

    await user.click(screen.getByLabelText('trigger-success'));
    const toast = await screen.findByRole('status');
    expect(toast).toBeInTheDocument();
    expect(toast).toHaveTextContent('Success!');
  });

  it('dismisses a toast when close is clicked', async () => {
    const user = userEvent.setup();
    renderWithProvider(<Harness />);

    await user.click(screen.getByLabelText('trigger-success'));
    const toast = await screen.findByRole('status');
    expect(toast).toBeInTheDocument();

    const close = screen.getByLabelText('Dismiss');
    await user.click(close);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('auto-dismisses after duration', async () => {
    jest.useFakeTimers();

    try {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      await act(async () => {
        renderWithProvider(<Harness />);
      });

      await act(async () => {
        await user.click(screen.getByLabelText('trigger-timed'));
      });

      expect(await screen.findByText('Timed')).toBeInTheDocument();

      // Fast-forward time and wait for state updates
      await act(async () => {
        jest.advanceTimersByTime(1100); // Slightly more than 1000ms
      });

      // Wait for the toast to be removed
      await act(async () => {
        // Allow React to process pending updates
        await Promise.resolve();
      });

      expect(screen.queryByText('Timed')).not.toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  }, 15000); // Increase timeout to 15 seconds
});

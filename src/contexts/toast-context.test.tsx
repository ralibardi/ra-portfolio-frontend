import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import type React from 'react';
import { ToastProvider, useToast } from './toast-context';

// Test component to interact with toast context
const TestComponent: React.FC = () => {
  const { showToast, success, error, info, warning, remove, toasts } = useToast();

  return (
    <div>
      <button
        type="button"
        onClick={() => showToast('Test message', { type: 'success' })}
        data-testid="show-success"
      >
        Show Success Toast
      </button>
      <button
        type="button"
        onClick={() => showToast('Error message', { type: 'error' })}
        data-testid="show-error"
      >
        Show Error Toast
      </button>
      <button
        type="button"
        onClick={() => showToast('Info message', { type: 'info' })}
        data-testid="show-info"
      >
        Show Info Toast
      </button>
      <button
        type="button"
        onClick={() => showToast('Warning message', { type: 'warning' })}
        data-testid="show-warning"
      >
        Show Warning Toast
      </button>
      <button type="button" onClick={() => success('Success helper')} data-testid="success-helper">
        Success Helper
      </button>
      <button type="button" onClick={() => error('Error helper')} data-testid="error-helper">
        Error Helper
      </button>
      <button type="button" onClick={() => info('Info helper')} data-testid="info-helper">
        Info Helper
      </button>
      <button type="button" onClick={() => warning('Warning helper')} data-testid="warning-helper">
        Warning Helper
      </button>
      <button
        type="button"
        onClick={() => toasts.length > 0 && remove(toasts[0].id)}
        data-testid="remove-first"
      >
        Remove First Toast
      </button>
      <div data-testid="toast-count">{toasts.length}</div>
      {toasts.map((toast) => (
        <div key={toast.id} data-testid={`toast-${toast.id}`}>
          {toast.message} - {toast.type}
        </div>
      ))}
    </div>
  );
};

describe('ToastContext', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('should provide toast context to children', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('should show success toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('show-success'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Test message - success')).toBeInTheDocument();
  });

  it('should show error toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('show-error'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Error message - error')).toBeInTheDocument();
  });

  it('should show info toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('show-info'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Info message - info')).toBeInTheDocument();
  });

  it('should show warning toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('show-warning'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Warning message - warning')).toBeInTheDocument();
  });

  it('should use success helper method', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('success-helper'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Success helper - success')).toBeInTheDocument();
  });

  it('should use error helper method', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('error-helper'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Error helper - error')).toBeInTheDocument();
  });

  it('should use info helper method', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('info-helper'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Info helper - info')).toBeInTheDocument();
  });

  it('should use warning helper method', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('warning-helper'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Warning helper - warning')).toBeInTheDocument();
  });

  it('should show multiple toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('show-success'));
    fireEvent.click(screen.getByTestId('show-error'));
    fireEvent.click(screen.getByTestId('show-info'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('3');
  });

  it('should auto-hide toasts after timeout', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('show-success'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    // Fast-forward time to trigger auto-hide (default 3000ms)
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });
  });

  it('should manually remove toast by id', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('show-success'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    fireEvent.click(screen.getByTestId('remove-first'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('should handle removing non-existent toast gracefully', () => {
    const TestComponentWithRemove: React.FC = () => {
      const { remove, toasts } = useToast();

      return (
        <div>
          <button
            type="button"
            onClick={() => remove('non-existent-id')}
            data-testid="remove-non-existent"
          >
            Remove Non-existent Toast
          </button>
          <div data-testid="toast-count">{toasts.length}</div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestComponentWithRemove />
      </ToastProvider>,
    );

    // Try to remove a toast that doesn't exist
    fireEvent.click(screen.getByTestId('remove-non-existent'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
  });

  it('should handle toast with custom duration', async () => {
    const TestComponentWithDuration: React.FC = () => {
      const { showToast, toasts } = useToast();

      const handleShowToast = () => {
        showToast('Test message', { type: 'success', durationMs: 1000 });
      };

      return (
        <div>
          <button type="button" onClick={handleShowToast} data-testid="show-toast">
            Show Toast
          </button>
          <div data-testid="toast-count">{toasts.length}</div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestComponentWithDuration />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('show-toast'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    // Fast-forward time by custom duration
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });
  });

  it('should use default type when none provided', () => {
    const TestComponentDefault: React.FC = () => {
      const { showToast, toasts } = useToast();

      return (
        <div>
          <button
            type="button"
            onClick={() => showToast('Default message')}
            data-testid="show-default"
          >
            Show Default Toast
          </button>
          <div data-testid="toast-count">{toasts.length}</div>
          {toasts.map((toast) => (
            <div key={toast.id} data-testid={`toast-${toast.id}`}>
              {toast.message} - {toast.type}
            </div>
          ))}
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestComponentDefault />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('show-default'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
    expect(screen.getByText('Default message - info')).toBeInTheDocument();
  });

  it('should throw error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Suppress console.error during test
    });

    const TestComponentOutsideProvider: React.FC = () => {
      useToast();
      return <div>Test</div>;
    };

    expect(() => {
      render(<TestComponentOutsideProvider />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleSpy.mockRestore();
  });

  it('should handle helper methods with custom duration', async () => {
    const TestComponentHelperDuration: React.FC = () => {
      const { success, error, info, warning, toasts } = useToast();

      return (
        <div>
          <button
            type="button"
            onClick={() => success('Success with duration', 500)}
            data-testid="success-duration"
          >
            Success with Duration
          </button>
          <button
            type="button"
            onClick={() => error('Error with duration', 500)}
            data-testid="error-duration"
          >
            Error with Duration
          </button>
          <button
            type="button"
            onClick={() => info('Info with duration', 500)}
            data-testid="info-duration"
          >
            Info with Duration
          </button>
          <button
            type="button"
            onClick={() => warning('Warning with duration', 500)}
            data-testid="warning-duration"
          >
            Warning with Duration
          </button>
          <div data-testid="toast-count">{toasts.length}</div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestComponentHelperDuration />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByTestId('success-duration'));
    fireEvent.click(screen.getByTestId('error-duration'));
    fireEvent.click(screen.getByTestId('info-duration'));
    fireEvent.click(screen.getByTestId('warning-duration'));

    expect(screen.getByTestId('toast-count')).toHaveTextContent('4');

    // Fast-forward time by custom duration
    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.getByTestId('toast-count')).toHaveTextContent('0');
    });
  });

  it('should generate unique IDs for toasts', () => {
    const TestComponentWithIds: React.FC = () => {
      const { showToast, toasts } = useToast();

      const handleShowToast = () => {
        showToast('Test message', { type: 'success' });
      };

      const uniqueIds = toasts.map((t) => t.id);
      const hasUniqueIds = uniqueIds.length === new Set(uniqueIds).size;

      return (
        <div>
          <button type="button" onClick={handleShowToast} data-testid="show-toast">
            Show Toast
          </button>
          <div data-testid="unique-ids">{hasUniqueIds ? 'unique' : 'duplicate'}</div>
          <div data-testid="toast-count">{toasts.length}</div>
        </div>
      );
    };

    render(
      <ToastProvider>
        <TestComponentWithIds />
      </ToastProvider>,
    );

    // Show multiple toasts
    fireEvent.click(screen.getByTestId('show-toast'));
    fireEvent.click(screen.getByTestId('show-toast'));
    fireEvent.click(screen.getByTestId('show-toast'));

    expect(screen.getByTestId('unique-ids')).toHaveTextContent('unique');
    expect(screen.getByTestId('toast-count')).toHaveTextContent('3');
  });
});

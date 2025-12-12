import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PWAUpdate from './PWAUpdate';

// Mock service worker
const mockServiceWorker = {
  postMessage: jest.fn(),
  addEventListener: jest.fn(),
};

const mockRegistration = {
  waiting: mockServiceWorker,
} as unknown as ServiceWorkerRegistration;

// Mock navigator.serviceWorker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    addEventListener: jest.fn(),
  },
  writable: true,
  configurable: true,
});

describe('PWAUpdate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when no registration is provided', () => {
    render(<PWAUpdate />);
    expect(screen.queryByText('A new version is available!')).not.toBeInTheDocument();
  });

  it('should not render when registration has no waiting service worker', () => {
    const registrationWithoutWaiting = {} as ServiceWorkerRegistration;
    render(<PWAUpdate registration={registrationWithoutWaiting} />);
    expect(screen.queryByText('A new version is available!')).not.toBeInTheDocument();
  });

  it('should render update banner when registration has waiting service worker', () => {
    render(<PWAUpdate registration={mockRegistration} />);
    expect(screen.getByText('A new version is available!')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Later')).toBeInTheDocument();
  });

  it('should handle update button click', async () => {
    const user = userEvent.setup();
    render(<PWAUpdate registration={mockRegistration} />);

    const updateButton = screen.getByText('Update');
    await user.click(updateButton);

    expect(mockServiceWorker.postMessage).toHaveBeenCalledWith({
      type: 'SKIP_WAITING',
    });
    expect(navigator.serviceWorker.addEventListener).toHaveBeenCalledWith(
      'controllerchange',
      expect.any(Function),
    );
    expect(screen.getByText('Updating...')).toBeInTheDocument();
  });

  it('should handle dismiss button click', async () => {
    const user = userEvent.setup();
    render(<PWAUpdate registration={mockRegistration} />);

    const dismissButton = screen.getByText('Later');
    await user.click(dismissButton);

    expect(screen.queryByText('A new version is available!')).not.toBeInTheDocument();
  });

  it('should not handle update when no waiting service worker', async () => {
    const registrationWithoutWaiting = {} as ServiceWorkerRegistration;
    const user = userEvent.setup();

    // First render with waiting SW to show the banner
    const { rerender } = render(<PWAUpdate registration={mockRegistration} />);

    // Then rerender without waiting SW
    rerender(<PWAUpdate registration={registrationWithoutWaiting} />);

    const updateButton = screen.getByText('Update');
    await user.click(updateButton);

    // Should not call postMessage since there's no waiting SW
    expect(mockServiceWorker.postMessage).not.toHaveBeenCalled();
  });
});

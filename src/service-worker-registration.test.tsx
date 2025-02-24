import { Register, Unregister } from './service-worker-registration';

interface IServiceWorkerMock {
  state: string;
  onstatechange: ((event: Event) => void) | null;
}

interface IServiceWorkerRegistrationMock {
  installing: IServiceWorkerMock | null;
  onupdatefound: (() => void) | null;
  unregister?: () => Promise<boolean>;
}

interface INavigatorServiceWorkerMock {
  register: (url: string) => Promise<IServiceWorkerRegistrationMock>;
  controller?: object;
  ready: Promise<IServiceWorkerRegistrationMock>;
}

describe('Service Worker Registration', () => {
  const originalEnv = { ...process.env };
  const originalLocation = window.location;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    // Override window.location for tests.
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: {
        hostname: 'example.com',
        href: 'http://example.com',
        origin: 'http://example.com',
      },
    });
    // Clear any previous mocks on navigator.serviceWorker and fetch.
    (
      navigator as unknown as {
        serviceWorker: INavigatorServiceWorkerMock | undefined;
      }
    ).serviceWorker = undefined;
    // Mock fetch globally
    global.fetch = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {
          get: () => 'application/javascript',
        },
      }),
    ) as jest.Mock;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    Object.defineProperty(window, 'location', { value: originalLocation });
    jest.restoreAllMocks();
  });

  describe('Register', () => {
    it('should not register service worker when not in production', async () => {
      process.env.NODE_ENV = 'development';
      const onSuccess = jest.fn();
      const onUpdate = jest.fn();
      const registerSpy = jest.fn();
      // Even if serviceWorker exists, the ENV check should prevent registration.
      (
        navigator as unknown as { serviceWorker: INavigatorServiceWorkerMock }
      ).serviceWorker = {
        register: registerSpy,
        ready: Promise.resolve({
          installing: null,
          onupdatefound: null,
        } as IServiceWorkerRegistrationMock),
      };

      Register({ onSuccess, onUpdate });
      window.dispatchEvent(new Event('load'));

      await Promise.resolve(); // Wait for any potential async operations
      expect(registerSpy).not.toHaveBeenCalled();
    });

    it('should register service worker and trigger onSuccess when worker state becomes "installed" without controller', async () => {
      process.env.NODE_ENV = 'production';
      process.env.PUBLIC_URL = 'public';
      // Ensure non-localhost (so that RegisterValidSW is called).
      Object.defineProperty(window, 'location', {
        configurable: true,
        writable: true,
        value: {
          hostname: 'example.com',
          href: 'http://example.com',
          origin: 'http://example.com',
        },
      });

      const onSuccess = jest.fn();
      const onUpdate = jest.fn();

      // Create a fake worker and registration object.
      const fakeWorker: IServiceWorkerMock = { state: '', onstatechange: null };
      const fakeRegistration: IServiceWorkerRegistrationMock = {
        installing: null,
        onupdatefound: null,
      };

      const registerMock = jest.fn().mockImplementation((_: string) => {
        return Promise.resolve(fakeRegistration);
      });
      (
        navigator as unknown as { serviceWorker: INavigatorServiceWorkerMock }
      ).serviceWorker = {
        register: registerMock,
        ready: Promise.resolve({
          installing: null,
          onupdatefound: null,
          unregister: jest.fn(),
        } as IServiceWorkerRegistrationMock),
      };

      Register({ onSuccess, onUpdate });
      window.dispatchEvent(new Event('load'));

      // Wait for the initial promise to resolve
      await new Promise(process.nextTick);

      // Simulate the registration's update found callback.
      fakeRegistration.installing = fakeWorker;
      if (typeof fakeRegistration.onupdatefound === 'function') {
        fakeRegistration.onupdatefound();
      }

      // Now simulate the worker state change to "installed".
      fakeWorker.state = 'installed';
      if (typeof fakeWorker.onstatechange === 'function') {
        fakeWorker.onstatechange(new Event('statechange'));
      }

      // Wait for all state change promises to resolve
      await new Promise(process.nextTick);

      expect(registerMock).toHaveBeenCalledWith('public/service-worker.js');
      expect(onSuccess).toHaveBeenCalledWith(fakeRegistration);
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it('should register service worker and trigger onUpdate when worker state becomes "installed" with a controller present', async () => {
      process.env.NODE_ENV = 'production';
      process.env.PUBLIC_URL = 'public';

      const onSuccess = jest.fn();
      const onUpdate = jest.fn();

      const fakeWorker: IServiceWorkerMock = { state: '', onstatechange: null };
      const fakeRegistration: IServiceWorkerRegistrationMock = {
        installing: null,
        onupdatefound: null,
      };

      const registerMock = jest.fn().mockImplementation((_: string) => {
        return Promise.resolve(fakeRegistration);
      });
      // Simulate that a controller exists.
      (
        navigator as unknown as { serviceWorker: INavigatorServiceWorkerMock }
      ).serviceWorker = {
        register: registerMock,
        controller: {},
        ready: Promise.resolve({
          installing: null,
          onupdatefound: null,
          unregister: jest.fn(),
        } as IServiceWorkerRegistrationMock),
      };

      Register({ onSuccess, onUpdate });
      window.dispatchEvent(new Event('load'));

      // Wait for the initial promise to resolve
      await new Promise(process.nextTick);

      fakeRegistration.installing = fakeWorker;
      if (typeof fakeRegistration.onupdatefound === 'function') {
        fakeRegistration.onupdatefound();
      }

      fakeWorker.state = 'installed';
      if (typeof fakeWorker.onstatechange === 'function') {
        fakeWorker.onstatechange(new Event('statechange'));
      }

      // Wait for all state change promises to resolve
      await new Promise(process.nextTick);

      expect(registerMock).toHaveBeenCalledWith('public/service-worker.js');
      expect(onUpdate).toHaveBeenCalledWith(fakeRegistration);
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should handle localhost: validate the service worker script via fetch and register it', async () => {
      process.env.NODE_ENV = 'production';
      process.env.PUBLIC_URL = 'public';
      // Set hostname to localhost.
      Object.defineProperty(window, 'location', {
        configurable: true,
        writable: true,
        value: {
          hostname: 'localhost',
          href: 'http://localhost',
          origin: 'http://localhost',
        },
      });

      const onSuccess = jest.fn();
      const onUpdate = jest.fn();

      const fakeWorker: IServiceWorkerMock = { state: '', onstatechange: null };
      const fakeRegistration: IServiceWorkerRegistrationMock = {
        installing: null,
        onupdatefound: null,
      };

      const registerMock = jest.fn().mockImplementation((_: string) => {
        return Promise.resolve(fakeRegistration);
      });
      (
        navigator as unknown as { serviceWorker: INavigatorServiceWorkerMock }
      ).serviceWorker = {
        register: registerMock,
        ready: Promise.resolve({
          installing: null,
          onupdatefound: null,
          unregister: jest.fn(),
        } as IServiceWorkerRegistrationMock),
      };

      Register({ onSuccess, onUpdate });
      window.dispatchEvent(new Event('load'));

      // Wait for all promises to resolve
      await Promise.resolve();
      await Promise.resolve();

      expect(global.fetch).toHaveBeenCalledWith('public/service-worker.js', {
        headers: { 'Service-Worker': 'script' },
      });

      fakeRegistration.installing = fakeWorker;
      if (typeof fakeRegistration.onupdatefound === 'function') {
        fakeRegistration.onupdatefound();
      }

      fakeWorker.state = 'installed';
      if (typeof fakeWorker.onstatechange === 'function') {
        fakeWorker.onstatechange(new Event('statechange'));
      }

      // Wait for all promises to resolve
      await Promise.resolve();
      await Promise.resolve();

      expect(registerMock).toHaveBeenCalledWith('public/service-worker.js');
      expect(onSuccess).toHaveBeenCalledWith(fakeRegistration);
      expect(onUpdate).not.toHaveBeenCalled();
    });

    it('should log an error when registration fails', async () => {
      process.env.NODE_ENV = 'production';
      process.env.PUBLIC_URL = 'public';

      const errorMsg = 'Registration failed';
      const registerMock = jest.fn().mockRejectedValue(new Error(errorMsg));
      (
        navigator as unknown as { serviceWorker: INavigatorServiceWorkerMock }
      ).serviceWorker = {
        register: registerMock,
        ready: Promise.resolve({
          unregister: jest.fn().mockRejectedValue(new Error(errorMsg)),
        } as unknown as IServiceWorkerRegistrationMock),
      };

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      Register();
      window.dispatchEvent(new Event('load'));

      // Wait for all promises to resolve and flush the promise queue
      await new Promise(process.nextTick);

      expect(registerMock).toHaveBeenCalledWith('public/service-worker.js');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error during service worker registration:',
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Unregister', () => {
    it('should unregister the service worker if registration exists', async () => {
      const unregisterMock = jest.fn().mockResolvedValue(true);
      (
        navigator as unknown as { serviceWorker: INavigatorServiceWorkerMock }
      ).serviceWorker = {
        ready: Promise.resolve({
          installing: null,
          onupdatefound: null,
          unregister: unregisterMock,
        } as unknown as IServiceWorkerRegistrationMock),
        register: jest.fn(),
      };

      await Unregister();
      expect(unregisterMock).toHaveBeenCalled();
    });

    it('should log an error when unregister fails', async () => {
      const error = new Error('Unregister failed');
      (
        navigator as unknown as { serviceWorker: INavigatorServiceWorkerMock }
      ).serviceWorker = {
        ready: Promise.reject(error),
        register: jest.fn(),
      };

      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      await Unregister();

      // Wait for all promises to resolve
      await Promise.resolve();
      await Promise.resolve();

      expect(consoleErrorSpy).toHaveBeenCalledWith(error.message);

      consoleErrorSpy.mockRestore();
    });
  });
});

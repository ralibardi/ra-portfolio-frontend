import { waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock PWAPrompt component
jest.mock('react-ios-pwa-prompt', () => ({
  __esModule: true,
  default: () => null
}));

describe('Main Entry (src/main.tsx)', () => {
  beforeEach(() => {
    // Set up a DOM element as the render target
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    // Clean up the DOM after each test
    document.body.innerHTML = '';
  });

  it('renders the App container into #root', async () => {
    // Import the main entry file dynamically to trigger the render
    jest.isolateModules(() => {
      require('./main');
    });

    // Wait for the App component (with data-testid="app-container") to appear
    await waitFor(() => {
      const appContainer = document.querySelector('[data-testid="app-container"]');
      expect(appContainer).toBeInTheDocument();
    }, { timeout: 3000 }); // Increase timeout to allow for React.Suspense
  });

  it('populates the #root element with rendered content', async () => {
    jest.isolateModules(() => {
      require('./main');
    });

    // Wait for the root element to be populated
    await waitFor(() => {
      const rootElement = document.getElementById('root');
      expect(rootElement).not.toBeNull();
    }, { timeout: 3000 }); // Increase timeout to allow for React.Suspense
  });
});

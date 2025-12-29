import type { AppDictionary } from '@app/i18n/get-dictionary';
import enDictionary from '@public/locales/en-GB/translation.json';
import { render, screen } from '@testing-library/react';
import { act } from 'react';

// Mock react-error-boundary before importing the component
jest.mock('react-error-boundary', () => {
  const React = require('react');

  interface MockErrorBoundaryProps {
    children: React.ReactNode;
    // biome-ignore lint/style/useNamingConvention: Must match react-error-boundary API
    FallbackComponent: React.ComponentType<{ error: Error }>;
  }

  interface MockErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
  }

  class MockErrorBoundary extends React.Component<MockErrorBoundaryProps, MockErrorBoundaryState> {
    constructor(props: MockErrorBoundaryProps) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    render() {
      if (this.state.hasError && this.state.error) {
        const { FallbackComponent } = this.props;
        return <FallbackComponent error={this.state.error} />;
      }
      return this.props.children;
    }
  }

  return {
    // biome-ignore lint/style/useNamingConvention: Required for Jest ES module mock
    __esModule: true,
    ErrorBoundary: MockErrorBoundary,
  };
});

import ErrorBoundary from './error-boundary';

const dictionary = enDictionary as AppDictionary;

describe('ErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
      // Suppress console errors in tests
    });
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should render children when there is no error', async () => {
    render(
      <ErrorBoundary dictionary={dictionary}>
        <div>Child Component</div>
      </ErrorBoundary>,
    );

    const { childComponent } = await act(() => {
      const childComponent = screen.getByText('Child Component');
      return { childComponent };
    });

    expect(childComponent).toBeInTheDocument();
  });

  it('should render error content when there is an error', async () => {
    const ErrorThrowingComponent = () => {
      throw new Error('Something went wrong');
    };

    render(
      <ErrorBoundary dictionary={dictionary}>
        <ErrorThrowingComponent />
      </ErrorBoundary>,
    );

    const { headingElement } = await act(() => {
      const headingElement = screen.getByTestId('error-heading');
      return { headingElement };
    });

    expect(headingElement).toHaveTextContent(dictionary.pages.error.title);
  });

  it('renders error details when an error occurs', async () => {
    const ErrorThrowingComponent = () => {
      throw new Error('Something went wrong');
    };

    render(
      <ErrorBoundary dictionary={dictionary}>
        <ErrorThrowingComponent />
      </ErrorBoundary>,
    );

    const { detailsElement } = await act(() => {
      const detailsElement = screen.getByTestId('error-details');
      return { detailsElement };
    });

    expect(detailsElement).toBeInTheDocument();
  });
});
